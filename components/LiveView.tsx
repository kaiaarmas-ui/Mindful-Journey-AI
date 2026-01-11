
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/geminiService';
import { ArrowLeft } from 'lucide-react';

interface LiveViewProps {
  onBack?: () => void;
}

const LiveView: React.FC<LiveViewProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.debug('Nexus Live: Connection opened');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.startsWith('AI: ')) {
                  return [...prev.slice(0, -1), last + text];
                }
                return [...prev, 'AI: ' + text];
              });
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.startsWith('You: ')) {
                  return [...prev.slice(0, -1), last + text];
                }
                return [...prev, 'You: ' + text];
              });
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Nexus Live: Error', e);
            stopSession();
          },
          onclose: () => {
            console.debug('Nexus Live: Connection closed');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are Gemini Nexus, a highly intuitive and helpful voice assistant. Keep responses conversational and concise.'
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputContextRef.current) outputContextRef.current.close();
    setIsActive(false);
    setTranscripts([]);
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-900 p-6 md:p-10">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-8">
        <header className="text-center space-y-2 relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h2 className="text-3xl font-bold text-white">Live Echo</h2>
          <p className="text-slate-400">Speak naturally. Experience zero-latency human-like conversation.</p>
        </header>

        <div className="flex-1 bg-slate-800/30 rounded-3xl border border-slate-700/50 p-8 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-4">
            {transcripts.length === 0 && !isActive && !isConnecting && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <div className="w-20 h-20 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p>Click start to begin a voice session</p>
              </div>
            )}
            
            {transcripts.map((t, i) => (
              <div key={i} className={`p-4 rounded-xl text-sm ${t.startsWith('AI: ') ? 'bg-indigo-500/10 text-indigo-200 self-start' : 'bg-slate-700/50 text-slate-300 self-end ml-auto max-w-[80%]'}`}>
                {t}
              </div>
            ))}

            {isActive && (
              <div className="flex justify-center py-10">
                <div className="flex items-center gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-indigo-500 rounded-full animate-pulse" 
                      style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            {isActive ? (
              <button
                onClick={stopSession}
                className="group flex items-center gap-4 px-10 py-5 rounded-full bg-red-600 text-white font-bold shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95"
              >
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                Stop Conversation
              </button>
            ) : (
              <button
                onClick={startSession}
                disabled={isConnecting}
                className="group flex items-center gap-4 px-10 py-5 rounded-full bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                {isConnecting ? 'Initializing...' : 'Start Session'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <span className="block text-xl font-bold text-indigo-400">16kHz</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Input Rate</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <span className="block text-xl font-bold text-indigo-400">24kHz</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Output Rate</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <span className="block text-xl font-bold text-indigo-400">PCM</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
