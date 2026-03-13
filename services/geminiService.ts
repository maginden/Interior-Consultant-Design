
import { GoogleGenAI, Modality } from '@google/genai';

function base64ToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType,
    },
  };
}

export async function generateStyledImage(base64Image: string, prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
    const imagePart = base64ToGenerativePart(base64Image, 'image/jpeg');
    
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
              parts: [imagePart, { text: prompt }],
          },
          config: {
              responseModalities: [Modality.IMAGE],
          },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:image/png;base64,${base64ImageBytes}`;
        }
      }
      throw new Error('No image data found in response');

    } catch (error) {
      console.error('Gemini image generation failed:', error);
      throw new Error('Failed to generate image with Gemini.');
    }
}