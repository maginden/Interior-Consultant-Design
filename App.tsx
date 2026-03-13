
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { ImageComparator } from './components/ImageComparator';
import { Chatbot } from './components/Chatbot';
import { generateStyledImage } from './services/geminiService';
import { LoadingIcon, UndoIcon, RedoIcon } from './constants';
import type { ChatMessage } from './types';
import { InfoModal } from './components/InfoModal';
import { Tooltip } from './components/Tooltip';
import { useLocalization } from './hooks/useLocalization';

const App: React.FC = () => {
  const { t } = useLocalization();
  
  const DESIGN_STYLES: string[] = t('designStyles');
  const LOADING_MESSAGES: string[] = t('loadingMessages');

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const chatRef = useRef<Chat | null>(null);
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<number | null>(null);

  const generatedImage = imageHistory[historyIndex] ?? null;
  
  useEffect(() => {
    if (DESIGN_STYLES.length > 0 && !selectedStyle) {
        setSelectedStyle(DESIGN_STYLES[0]);
    }
  }, [DESIGN_STYLES, selectedStyle]);


  useEffect(() => {
    const initializeChat = async () => {
        if (generatedImage && !chatRef.current) {
            try {
                setIsLoadingChat(true);
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: t('gemini.systemInstruction'),
                    },
                });
                chatRef.current = chat;

                const initialChatPrompt = t('gemini.initialChatMessage');
                const response = await chat.sendMessage({ message: initialChatPrompt });
                
                setChatHistory([{ role: 'assistant', content: response.text || t('errors.chatInitFallback') }]);
            } catch (err) {
                setError(t('errors.chatInit'));
                console.error(err);
            } finally {
                setIsLoadingChat(false);
            }
        }
    };

    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedImage, t]);
  
  useEffect(() => {
    if (chatbotContainerRef.current) {
      chatbotContainerRef.current.scrollTop = chatbotContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isLoadingImage && !generatedImage && LOADING_MESSAGES.length > 0) {
      setLoadingMessage(LOADING_MESSAGES[0]);
      let messageIndex = 0;
      loadingIntervalRef.current = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 2500);
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, [isLoadingImage, generatedImage, LOADING_MESSAGES]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
        }
    }, [historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < imageHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
        }
    }, [historyIndex, imageHistory.length]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    handleUndo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    handleRedo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);


  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setImageHistory([]);
      setHistoryIndex(-1);
      setChatHistory([]);
      chatRef.current = null;
      setInitialPrompt('');
      setError(null);
    };
    reader.readAsDataURL(file);
  };
  
  const handleGenerateClick = async () => {
    if (!originalImage || !initialPrompt.trim()) return;
    setIsLoadingImage(true);
    setError(null);
    setImageHistory([]);
    setHistoryIndex(-1);
    chatRef.current = null;
    setChatHistory([]);

    try {
      const fullPrompt = `${initialPrompt}. ${t('gemini.generationSuffix')}`;
      const newImage = await generateStyledImage(originalImage, fullPrompt);
      setImageHistory([newImage]);
      setHistoryIndex(0);
    } catch (err)
 {
      setError(t('errors.imageGeneration'));
      console.error(err);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleSendMessage = async (prompt: string, intent: 'refine' | 'ask') => {
    if (!prompt.trim()) return;

    if (intent === 'refine') {
      if (!generatedImage) return;
      setChatHistory(prev => [...prev, { role: 'user', content: `${t('chat.refinementPrefix')}: ${prompt}` }]);
      setIsLoadingImage(true);
      setError(null);

      try {
        const newImage = await generateStyledImage(generatedImage, prompt);
        const newHistory = [...imageHistory.slice(0, historyIndex + 1), newImage];
        setImageHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setChatHistory(prev => [...prev, { role: 'assistant', content: t('chat.refinementSuccess') }]);
      } catch (err) {
        setError(t('errors.imageRefinement'));
        setChatHistory(prev => [...prev, { role: 'assistant', content: t('errors.refinementResponse') }]);
        console.error(err);
      } finally {
        setIsLoadingImage(false);
      }
    } else { // 'ask' intent
      if (!chatRef.current) return;
      setChatHistory(prev => [...prev, { role: 'user', content: prompt }]);
      setIsLoadingChat(true);
      setError(null);

      try {
        const response = await chatRef.current.sendMessage({ message: prompt });
        setChatHistory(prev => [...prev, { role: 'assistant', content: response.text || t('errors.chatResponse') }]);
      } catch (err) {
        setError(t('errors.chatResponse'));
        setChatHistory(prev => [...prev, { role: 'assistant', content: t('errors.chatConnection') }]);
        console.error(err);
      } finally {
        setIsLoadingChat(false);
      }
    }
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    setInitialPrompt(t('prompts.styleBased', { style }));
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < imageHistory.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header onInfoClick={() => setIsInfoModalOpen(true)} />
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('app.title')}</h2>
          <p className="mt-2 text-lg text-gray-600">{t('app.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">{t('errors.title')}</p>
            <p>{error}</p>
          </div>
        )}

        <ImageUploader onImageUpload={handleImageUpload} />

        {originalImage && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{t('app.originalRoom')}</h3>
                    <img src={originalImage} alt={t('app.originalRoomAlt')} className="rounded-lg shadow-md w-full object-contain" />
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">{t('app.selectStyle')}</h3>
                    <StyleCarousel styles={DESIGN_STYLES} selectedStyle={selectedStyle} onSelectStyle={handleStyleSelect} />
                    
                    <h3 className="text-xl font-semibold text-gray-800">{t('app.describeVision')}</h3>
                     <textarea
                        value={initialPrompt}
                        onChange={(e) => setInitialPrompt(e.target.value)}
                        placeholder={t('app.visionPlaceholder')}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                    
                    <button
                      onClick={handleGenerateClick}
                      disabled={isLoadingImage || !initialPrompt.trim()}
                      className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                      {isLoadingImage ? <><LoadingIcon /> {t('buttons.generating')}</> : t('buttons.reimagine')}
                    </button>
                </div>
            </div>
          </div>
        )}

        {isLoadingImage && !generatedImage && (
             <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-500">
                <div className="flex justify-center items-center mb-4">
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-spin-slow" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                        <div className="absolute inset-2 border-2 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-2 border-2 border-indigo-400 rounded-full animate-spin-slower" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                    </div>
                </div>
                <p className="text-lg font-semibold text-indigo-600 animate-pulse">{t('app.magic')}</p>
                <div className="h-6 mt-2">
                  <p key={loadingMessage} className="text-gray-500 mt-1 animate-fade-in">{loadingMessage}</p>
                </div>
            </div>
        )}

        {originalImage && generatedImage && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">{t('app.compareDesigns')}</h3>
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                    <Tooltip text={t('tooltips.undo')}>
                        <button 
                            onClick={handleUndo} 
                            disabled={!canUndo}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
                            aria-label={t('tooltips.undoAria')}
                        >
                            <UndoIcon />
                        </button>
                    </Tooltip>
                    <Tooltip text={t('tooltips.redo')}>
                         <button 
                            onClick={handleRedo}
                            disabled={!canRedo}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
                            aria-label={t('tooltips.redoAria')}
                        >
                            <RedoIcon />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <ImageComparator originalImage={originalImage} generatedImage={generatedImage} />
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">{t('app.chatTitle')}</h3>
              <Chatbot
                history={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isLoadingChat || isLoadingImage}
                containerRef={chatbotContainerRef}
              />
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-100 mt-12">
        <p>{t('app.footer')}</p>
      </footer>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default App;