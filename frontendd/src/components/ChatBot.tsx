import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// This is the institutional API key for AgriPredict AI services
const GEMINI_API_KEY = "AIzaSyBZ_a-tQjvqkgcVlnIwI5sU9R4oSFpguSg";

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes
  useEffect(() => {
    if (history.length === 0) {
      // We don't save the welcome in history to keep it out of the prompt context if needed, 
      // but we display it as a virtual message.
    }
  }, [i18n.language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const clearChat = () => {
    setHistory([]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newHistory: Message[] = [...history, { role: 'user', parts: [{ text: userText }] }];
    
    setInput('');
    setHistory(newHistory);
    setLoading(true);

    try {
      const systemDirective = t('chatbot.directive');
      
      const payload = {
        contents: newHistory,
        system_instruction: {
          parts: [{ text: systemDirective }]
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        setHistory([...newHistory, { role: 'model', parts: [{ text: aiText }] }]);
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      console.error(error);
      setHistory([...newHistory, { role: 'model', parts: [{ text: "I'm having trouble processing that right now. Please ensure you're asking about farming or the AgriPredict platform." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border border-white/10"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      ) : (
        <div className="w-[380px] h-[550px] bg-white rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] flex flex-col border border-slate-100 overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
          {/* Header */}
          <div className="bg-slate-900 p-5 flex justify-between items-center text-white relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-xs font-black shadow-lg shadow-green-900/20">AI</div>
              <div>
                <p className="font-bold text-sm tracking-tight">AgriPredict Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active Intelligence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Clear Chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {/* Initial Welcome */}
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium leading-relaxed">
                {t('chatbot.welcome')}
              </div>
            </div>

            {history.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.parts[0].text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-slate-100">
            <div className="relative flex items-center bg-slate-100/50 rounded-2xl border border-slate-200 pr-2 focus-within:border-green-500/50 focus-within:ring-4 focus-within:ring-green-500/5 transition-all">
              <input 
                type="text" 
                value={input}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 bg-transparent border-none outline-none py-4 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                  loading || !input.trim() 
                    ? 'bg-slate-200 text-slate-400' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-900/20'
                }`}
              >
                <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
              Powered by Gemini 1.5 Precision Engine
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
