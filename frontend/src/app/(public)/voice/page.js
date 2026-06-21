"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { motion } from 'framer-motion'
import { translations } from '@/utils/translations'

const QUICK_KEYS = ['quickScholarships', 'quickFarmers', 'quickHealth', 'quickStartup']

export default function VoicePage() {
  const [state, setState] = useState('idle')
  const { language } = useApp()
  const t = translations[language] || translations.en
  const [transcript, setTranscript] = useState("")
  const router = useRouter()

  const toggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert(t.speechUnsupported)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.continuous = false
    recognition.interimResults = false

    setState("listening")

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      setState("processing")
      localStorage.setItem("voiceQuery", text)
      setTimeout(() => router.push("/chat"), 1000)
    }

    recognition.onerror = (event) => {
      console.log(event.error)
      setState("idle")
    }

    recognition.onend = () => setState("idle")
    recognition.start()
  }

  const handleQuick = (q) => {
    setState('processing')
    localStorage.setItem("voiceQuery", q.replace(/^[^\w]+/, "").trim())
    setTimeout(() => {
      setState('idle')
      router.push('/chat')
    }, 1200)
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-64px)] font-sans">
      <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2 text-white break-words">{t.voiceAssistant}</h1>
      <p className="text-sm text-[#A89060] mb-8 sm:mb-12 break-words">{t.voicePageSubtitle}</p>

      <div
        className="relative flex items-center justify-center mb-8 cursor-pointer"
        onClick={toggle}
        role="button"
        tabIndex={0}
        title={t.tapToSpeak}
        aria-label={t.tapToSpeak}
      >
        <motion.div
          animate={state === 'listening' ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all duration-300 border ${
            state === 'listening'
              ? 'bg-red-500/10 border-red-500/25 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
              : state === 'processing'
                ? 'bg-yellow-500/10 border-yellow-500/25 shadow-[0_0_25px_rgba(234,179,8,0.2)]'
                : 'bg-[rgba(212,160,23,0.05)] border-[rgba(212,160,23,0.18)] hover:bg-[rgba(212,160,23,0.1)]'
          }`}
        >
          <motion.div
            animate={state === 'listening' ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border transition-all duration-300 ${
              state === 'listening'
                ? 'bg-red-500/20 border-red-500/30'
                : state === 'processing'
                  ? 'bg-yellow-500/20 border-yellow-500/30'
                  : 'bg-[rgba(212,160,23,0.06)] border-[rgba(212,160,23,0.22)]'
            }`}
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-md transition-colors duration-300 ${
              state === 'listening'
                ? 'bg-red-500 text-white'
                : state === 'processing'
                  ? 'bg-yellow-500 text-[#0A0A0A]'
                  : 'bg-gradient-to-br from-[#D4A017] to-[#8B6914] text-[#0A0A0A]'
            }`}>
              {state === 'processing' ? '⏳' : '🎙️'}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className={`text-sm sm:text-base font-semibold tracking-wide mb-8 sm:mb-12 uppercase break-words ${
        state === 'listening' ? 'text-red-400 animate-pulse' : state === 'processing' ? 'text-yellow-400' : 'text-[#A89060]'
      }`}>
        {state === 'idle' && t.tapToSpeak}
        {state === 'listening' && t.listening}
        {state === 'processing' && t.processingAudio}
      </div>

      {transcript && (
        <div className="mt-4 text-[#F2C94C] text-sm break-words">
          {t.youSaid} &quot;{transcript}&quot;
        </div>
      )}

      <div className={`h-10 max-w-full flex items-center justify-center gap-1 mb-8 sm:mb-12 transition-opacity duration-300 ${state === 'listening' ? 'opacity-100' : 'opacity-0'}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="w-1 bg-red-500 rounded-full animate-pulse"
            style={{
              height: `${Math.max(8, Math.sin(i) * 32 + 20)}px`,
              animationDuration: `${0.4 + (i % 3) * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full">
        <p className="text-xs font-semibold text-[#A89060] uppercase tracking-wider mb-4">{t.quickQueryLabel}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          {QUICK_KEYS.map(key => (
            <button
              key={key}
              className="min-h-11 p-3 rounded-xl bg-[#111111] border border-[rgba(212,160,23,0.15)] hover:border-[rgba(212,160,23,0.35)] text-xs font-medium text-[#F0E6C8] hover:text-[#F2C94C] transition-all cursor-pointer shadow-sm text-center break-words"
              onClick={() => handleQuick(t[key])}
            >
              {t[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3">
        <p className="text-[10px] font-bold text-[#6B5A3A] uppercase tracking-wider">{t.supportsSpeech}</p>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
          {[t.english, t.hindi, t.marathi, t.tamil, t.telugu, t.bengali].map(l => (
            <span key={l} className="px-2.5 py-1 rounded-full bg-white/[0.02] border border-[rgba(212,160,23,0.08)] text-[10px] font-semibold text-[#A89060] break-words">{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
