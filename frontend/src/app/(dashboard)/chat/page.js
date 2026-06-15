"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/hooks/useChat'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import axios from "axios";

const SUGGESTED = [
  '🎓 Scholarships for students',
  '🌾 Schemes for farmers',
  '👩 Women empowerment schemes',
  '🚀 Startup funding schemes',
  '🏥 Health insurance schemes',
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
  const { theme } = useApp()
  const [input, setInput] = useState('')
  const [micActive, setMicActive] = useState(false)
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null)
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
      }
    );

    addAssistantMessage(
      res.data.reply,
      res.data.schemes
    );
  } catch (error) {
    console.log(error);

    addAssistantMessage(
      "Something went wrong while fetching AI response."
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
      "What scholarships are available for engineering students?"
    );
  }, 2500);
};

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-112px)] font-sans">
      {/* Suggestions and History Sidebar */}
      <div className={`w-full lg:w-72 flex flex-col p-5 border rounded-2xl ${
        theme === 'dark'
          ? 'bg-[#111111]/40 border-[rgba(212,160,23,0.15)] text-[#F0E6C8]'
          : 'bg-[#FFFFFF]/60 border-[rgba(139,105,20,0.15)] text-[#1A1208]'
      }`}>
        <h3 className="font-serif text-lg font-bold text-[#F2C94C] mb-4">AI Assistant</h3>
        <button 
          className="btn-gold !py-2.5 !w-full text-xs font-semibold mb-6 shadow-md cursor-pointer"
         onClick={() => {
  clear();
  setHistory([]);
  localStorage.removeItem("chatHistory");
}}
        >
          + New Chat
        </button>

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-2">History</div>
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
    Previous Search
  </span>
</div>
          ))}
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-2">Quick Questions</div>
        <div className="space-y-1.5 overflow-y-auto max-h-[160px] lg:max-h-none">
          {SUGGESTED.map(s => (
            <button 
              key={s} 
              className="w-full text-left p-2.5 rounded-lg text-xs font-medium bg-white/[0.02] border border-transparent hover:border-[rgba(212,160,23,0.15)] hover:text-[#D4A017] transition-all cursor-pointer truncate"
              onClick={() => handleSuggested(s)}
            >
              {s}
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
              <div className="text-[10px] text-green-400 font-medium">🟢 Online — Replies instantly</div>
            </div>
          </div>
          <button 
            className="btn-ghost !py-1.5 !px-3.5 text-xs font-semibold hover:!bg-[rgba(212,160,23,0.08)] cursor-pointer"
            onClick={() => router.push('/voice')}
          >
            🎙️ Voice Mode
          </button>
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
          View Scheme →
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
              placeholder="Ask about any government scheme..."
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
                title="Speak question"
              >
                🎙️
              </button>
              <button 
                className="w-9 h-9 rounded-full bg-[#D4A017] hover:bg-[#8B6914] text-[#0A0A0A] flex items-center justify-center text-sm transition-all active:scale-90 cursor-pointer shadow-sm"
                onClick={handleSend}
              >
                ➤
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#A89060] mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  )
}
