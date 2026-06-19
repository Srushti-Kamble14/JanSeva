"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/hooks/useChat'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import axios from "axios";
import { translations } from "@/utils/translations";

const SUGGESTED_KEYS = [
  'quickScholarships',
  'quickFarmers',
  'quickWomen',
  'quickStartupSchemes',
  'quickHealthSchemes',
]

export default function ChatPage() {
 const {
  messages,
  typing,
  setTyping,
  addUserMessage,
  addAssistantMessage,
  clear,
} = useChat();
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const [input, setInput] = useState('')
  const [micActive, setMicActive] = useState(false)
  const [history, setHistory] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null);
  const router = useRouter()
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
  const savedHistory = localStorage.getItem("chatHistory");

  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
  }
}, []);

useEffect(() => {
  const voiceQuery =
    localStorage.getItem("voiceQuery");

  if (voiceQuery) {
    handleSend(voiceQuery);

    localStorage.removeItem("voiceQuery");
  }
}, []);

 const handleSend = async (customText = null) => {

 

  const text = customText || input.trim();

  if (!text) return;

  addUserMessage(text);

  const updatedHistory = [
  text,
  ...history.filter((h) => h !== text),
].slice(0, 10);

setHistory(updatedHistory);

localStorage.setItem(
  "chatHistory",
  JSON.stringify(updatedHistory)
);
  

  if (!customText) {
    setInput("");
  }

  setTyping(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/ai/chat",
      {
        message: text,
          language,
      }
    );

    addAssistantMessage(
  res.data.reply,
  res.data.schemes
);

if (voiceEnabled) {
  try {
    const ttsRes = await axios.post(
      "http://localhost:5000/api/tts/speak",
      {
        text: res.data.reply,
        language,
      }
    );

  if (audioRef.current) {
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
}

const audio = new Audio(
  `http://localhost:5000${ttsRes.data.audioUrl}`
);

audioRef.current = audio;

audio.play().catch((err) => {
  console.log("Audio Error:", err);
});

  } catch (err) {
    console.log("TTS Error:", err);
  }
}

} catch (error) {
  console.log(error);

  addAssistantMessage(
    t.aiError
  );
} finally {
  setTyping(false);
}
};
  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault()
      handleSend() 
    }
  }
const handleSuggested = (s) => {
  const text = s.replace(/^[^\w]+/, "").trim();
  handleSend(text);
};

 const toggleMic = () => {
  setMicActive(true);

  setTimeout(() => {
    setMicActive(false);

    handleSend(
      t.sampleScholarshipQuestion
    );
  }, 2500);
};



const toggleVoice = () => {
  if (voiceEnabled && audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }

  setVoiceEnabled((prev) => !prev);
};

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-112px)] font-sans">
      {/* Suggestions and History Sidebar */}
      <div className={`w-full lg:w-72 flex flex-col p-5 border rounded-2xl ${
        theme === 'dark'
          ? 'bg-[#111111]/40 border-[rgba(212,160,23,0.15)] text-[#F0E6C8]'
          : 'bg-[#FFFFFF]/60 border-[rgba(139,105,20,0.15)] text-[#1A1208]'
      }`}>
        <h3 className="font-serif text-lg font-bold text-[#F2C94C] mb-4">{t.aiAssistant}</h3>
        <button 
          className="btn-gold !py-2.5 !w-full text-xs font-semibold mb-6 shadow-md cursor-pointer"
         onClick={() => {
  clear();
  setHistory([]);
  localStorage.removeItem("chatHistory");
}}
        >
          {t.newChat}
        </button>

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-2">{t.history}</div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-6 max-h-[160px] lg:max-h-none">
         {history.map((h, i) => (
           <div
  key={i}
  onClick={() => handleSend(h)}
  className="p-2.5 rounded-lg bg-white/[0.02] border border-[rgba(212,160,23,0.06)] hover:bg-[rgba(212,160,23,0.04)] cursor-pointer transition-colors"
>
  <p className="text-xs font-semibold truncate text-[#F0E6C8]">
    {h}
  </p>

  <span className="text-[9px] text-[#A89060]">
    {t.previousSearch}
  </span>
</div>
          ))}
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-2">{t.quickQuestions}</div>
        <div className="space-y-1.5 overflow-y-auto max-h-[160px] lg:max-h-none">
          {SUGGESTED_KEYS.map(key => (
            <button 
              key={key} 
              className="w-full text-left p-2.5 rounded-lg text-xs font-medium bg-white/[0.02] border border-transparent hover:border-[rgba(212,160,23,0.15)] hover:text-[#D4A017] transition-all cursor-pointer truncate"
              onClick={() => handleSuggested(t[key])}
            >
              {t[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat section */}
      <div className={`flex-1 flex flex-col border rounded-2xl overflow-hidden shadow-lg ${
        theme === 'dark'
          ? 'bg-[#111111]/30 border-[rgba(212,160,23,0.15)] text-[#F0E6C8]'
          : 'bg-[#FFFFFF]/40 border-[rgba(139,105,20,0.15)] text-[#1A1208]'
      }`}>
        {/* Top active chatbot indicator bar */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(212,160,23,0.12)] bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.12)] flex items-center justify-center text-xl shadow-sm">
              🤖
            </div>
            <div>
              <div className="text-sm font-semibold">JanSeva AI</div>
              <div className="text-[10px] text-green-400 font-medium">{t.onlineInstant}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">


   <button
  onClick={toggleVoice}
  className="btn-ghost !py-1.5 !px-3 text-xs font-semibold cursor-pointer"
>
  {voiceEnabled ? t.voiceOn : t.voiceOff}
</button>

  <button
    className="btn-ghost !py-1.5 !px-3.5 text-xs font-semibold cursor-pointer"
    onClick={() => router.push('/voice')}
  >
    {t.voiceMode}
  </button>
</div>
        </div>

        {/* Message logs */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(m => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className="w-8 h-8 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.15)] flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                  {m.role === 'user' ? '👤' : '🤖'}
                </div>
                <div>
                  <div className={`p-3.5 rounded-2xl text-xs md:text-sm font-medium leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#D4A017] to-[#8B6914] text-[#0A0A0A] rounded-tr-none'
                      : 'bg-[#1A1A1A] border border-[rgba(212,160,23,0.1)] text-[#F0E6C8] rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-line">{m.text}</div>

                    {m.schemes?.length > 0 && (
  <div className="mt-3 space-y-2">
    {m.schemes.map((scheme) => (
      <div
        key={scheme.id}
        className="p-3 rounded-xl bg-black/40 border border-[rgba(212,160,23,0.15)]"
      >
        <div className="text-xs font-bold text-[#F2C94C]">
          {scheme.name}
        </div>

        <div className="text-[11px] text-[#A89060] mt-1">
          {scheme.description}
        </div>

        <a
          href={`https://www.myscheme.gov.in/schemes/${scheme.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[11px] font-semibold text-[#D4A017]"
        >
          {t.viewScheme}
        </a>
      </div>
    ))}
  </div>
)}
                    
                    {m.card && (
                      <div className="mt-3 p-3 rounded-xl bg-black/40 border border-[rgba(212,160,23,0.18)] flex flex-col gap-2">
                        <div className="text-xs font-bold text-[#F2C94C]">{m.card.title}</div>
                        <div className="text-[11px] text-[#A89060] leading-snug">{m.card.desc}</div>
                        <span className="text-[10px] font-bold text-[#D4A017] hover:underline cursor-pointer">{m.card.link}</span>
                      </div>
                    )}
                  </div>
                  <div className={`text-[9px] text-[#A89060] mt-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                   {m.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing simulation dots */}
          {typing && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.15)] flex items-center justify-center text-sm flex-shrink-0">
                🤖
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1A1A1A] border border-[rgba(212,160,23,0.1)] rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Area & Mic buttons */}
        <div className="p-4 border-t border-[rgba(212,160,23,0.12)] bg-black/10">
          <div className="relative flex items-center bg-[#1A1A1A] border border-[rgba(212,160,23,0.18)] focus-within:border-[#D4A017] rounded-xl overflow-hidden px-3 py-1">
            <textarea
              className="flex-1 bg-transparent text-[#F0E6C8] py-2.5 max-h-24 min-h-[40px] text-sm outline-none resize-none font-sans"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t.chatPlaceholder}
              rows={1}
            />
            <div className="flex items-center gap-1 border-l border-[rgba(212,160,23,0.08)] pl-2">
              <button
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 active:scale-90 cursor-pointer ${
                  micActive 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-[rgba(212,160,23,0.06)] hover:bg-[rgba(212,160,23,0.15)] text-[#D4A017]'
                }`}
                onClick={toggleMic}
                title={t.speakQuestion}
              >
                🎙️
              </button>
              <button 
                className="w-9 h-9 rounded-full bg-[#D4A017] hover:bg-[#8B6914] text-[#0A0A0A] flex items-center justify-center text-sm transition-all active:scale-90 cursor-pointer shadow-sm"
                onClick={handleSend}
                title={t.sendMessage}
                aria-label={t.sendMessage}
              >
                ➤
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#A89060] mt-1.5 text-center">{t.enterToSend}</p>
        </div>
      </div>
    </div>
  )
}
