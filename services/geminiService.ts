
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeMusicalResonance(fileData: string, mimeType: string) {
  const ai = getAIClient();
  const prompt = `Analyze this ${mimeType.split('/')[0]} and describe its musical 'resonance'. Suggest a specific genre, BPM, and mood that would match this visual or auditory input. Keep it poetic and short.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: fileData.split(',')[1], mimeType } },
        { text: prompt }
      ]
    },
  });
  
  return response.text || "A silent frequency waiting to be heard.";
}

export async function generatePoem(theme: string) {
  const ai = getAIClient();
  const prompt = `Write a short, deeply mindful, and evocative poem based on the theme: "${theme}". Focus on sensory details and inner peace. Limit to 3 stanzas.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || '';
}

export async function generateStory(setting: string, vibe: string) {
  const ai = getAIClient();
  const prompt = `Tell a very short, peaceful, and immersive story (max 300 words). Setting: ${setting}. Tone: ${vibe}. The story should leave the reader feeling focused and calm.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || '';
}

export async function chatWithGrounding(message: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: { tools: [{ googleSearch: {} }] },
  });
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    uri: chunk.web?.uri || '',
  })).filter((l: any) => l.uri) || [];
  return { text: response.text || '', links };
}

export async function chatWithLite(message: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: message,
  });
  return { text: response.text || '', links: [] };
}

export async function chatWithPro(message: string, useThinking: boolean = true) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: useThinking ? { thinkingConfig: { thinkingBudget: 32768 } } : undefined,
  });
  return { text: response.text || '', links: [] };
}

export async function fetchGlobalWisdom() {
  const ai = getAIClient();
  const prompt = `What are 3 emerging or trending mindfulness practices or mental wellness news items? Provide a concise summary for each.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] },
  });
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    uri: chunk.web?.uri || '',
  })).filter((l: any) => l.uri) || [];
  return { text: response.text || '', links };
}

export async function searchWellnessResearch(topic: string) {
  const ai = getAIClient();
  const prompt = `Find the latest scientific research regarding: ${topic}. Summarize findings and provide links.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] },
  });
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    uri: chunk.web?.uri || '',
  })).filter((l: any) => l.uri) || [];
  return { text: response.text || '', links };
}

export async function generateImage(prompt: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error('No image was generated');
}

export async function startVideoGeneration(prompt: string) {
  const ai = getAIClient();
  return await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });
}

export async function pollVideoOperation(operationId: any) {
  const ai = getAIClient();
  return await ai.operations.getVideosOperation({ operation: operationId });
}

export async function generateTTS(text: string, voiceName: string = 'Kore') {
  const ai = getAIClient();
  const cleanText = text.replace(/[*#`_~>]/g, '').replace(/\[.*?\]\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say: ${cleanText}` }] }],
    config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } },
  });
  return response.candidates?.[0]?.content?.parts[0]?.inlineData?.data || '';
}

export async function generateJournalInsight(content: string) {
  const ai = getAIClient();
  const prompt = `Read this journal entry and provide a single, poetic sentence of reflection: "${content}"`;
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return response.text || "Your journey is uniquely yours.";
}

// Added missing generateMarketingAssets export to fix the error in MarketingToolkitView.tsx
export async function generateMarketingAssets() {
  const ai = getAIClient();
  const prompt = `Generate 3 professional marketing ad copy variants for "Mindful Journey", a premium AI-powered mindfulness and journaling app.
  The variants should focus on:
  - Neural composition and human focus.
  - The power of Gemini AI for personalized reflection.
  - Privacy and local-first data storage.
  Keep the tone sophisticated, calm, and evocative.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  
  return response.text || "A new vision for mindfulness.";
}

export function encode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
