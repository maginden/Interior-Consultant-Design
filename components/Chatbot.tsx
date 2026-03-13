import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { WandIcon, ChatBubbleIcon } from '../constants';
import { Tooltip } from './Tooltip';
import { useLocalization } from '../hooks/useLocalization';

interface ChatbotProps {
  history: ChatMessage[];
  onSendMessage: (prompt: string, intent: 'refine' | 'ask') => void;
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

// A simple component to render markdown's **bold** syntax.
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Sanitize by replacing < and > to prevent accidental HTML injection
    const sanitizedContent = (content || '')
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace **text** with <strong>text</strong> for bolding
    const htmlContent = sanitizedContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
    return <p className="text-sm" dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ whiteSpace: 'pre-wrap' }} />;
};


export const Chatbot: React.FC<ChatbotProps> = ({ history, onSendMessage, isLoading, containerRef }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocalization();
  
  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  const handleSubmit = (intent: 'refine' | 'ask') => {
    if (message.trim() && !isLoading) {
      onSendMessage(message, intent);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit('ask');
    }
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[700px] bg-white border border-gray-200 rounded-lg shadow-inner">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.role === 'user' 
                ? <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                : <MarkdownRenderer content={msg.content} />
              }
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse ml-1" style={{animationDelay: '75ms'}}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse ml-1" style={{animationDelay: '150ms'}}></div>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <Tooltip text={t('tooltips.refine')}>
            <button
              onClick={() => handleSubmit('refine')}
              disabled={isLoading || !message.trim()}
              aria-label={t('tooltips.refineAria')}
              className="flex items-center justify-center p-2 h-10 w-10 bg-purple-500 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              <WandIcon />
            </button>
          </Tooltip>
          <Tooltip text={t('tooltips.ask')}>
            <button
              onClick={() => handleSubmit('ask')}
              disabled={isLoading || !message.trim()}
              aria-label={t('tooltips.askAria')}
              className="flex items-center justify-center p-2 h-10 w-10 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              <ChatBubbleIcon />
            </button>
          </Tooltip>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center" dangerouslySetInnerHTML={{ __html: t('chat.helperText') }} />
      </div>
    </div>
  );
};