"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { motion } from 'framer-motion'

const QUICK = [
  '🎓 Scholarships for students',
  '🌾 Schemes for farmers',
  '🏥 Health insurance',
  '🚀 Startup funding',
]

export default function VoicePage() {
  const [state, setState] = useState('idle') // idle | listening | processing
  const { theme } = useApp()
  const router = useRouter()

  const toggle = () => {
    if (state === 'idle') {
      setState('listening')
      setTimeout(() => {
        setState('processing')
        setTimeout(() => {
          setState('idle')
          router.push('/chat')
        }, 1500)
      }, 3000)
    }
  }

  const handleQuick = (q) => {
    setState('processing')
    setTimeout(() => { 
      setState('idle')
      router.push('/chat') 
    }, 1200)
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-64px)] font-sans">
      <h1 className="text-3xl font-bold font-serif mb-2 text-white">Voice Assistant</h1>
      <p className="text-sm text-[#A89060] mb-12">Speak your question about any government scheme in your language</p>

      {/* Pulsing microphone trigger */}
      <div className="relative flex items-center justify-center mb-8 cursor-pointer" onClick={toggle}>
        {/* Outer Ring */}
        <motion.div 
          animate={state === 'listening' ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 border ${
            state === 'listening' 
              ? 'bg-red-500/10 border-red-500/25 shadow-[0_0_25px_rgba(239,68,68,0.2)]' 
              : state === 'processing'
                ? 'bg-yellow-500/10 border-yellow-500/25 shadow-[0_0_25px_rgba(234,179,8,0.2)]'
                : 'bg-[rgba(212,160,23,0.05)] border-[rgba(212,160,23,0.18)] hover:bg-[rgba(212,160,23,0.1)]'
          }`}
        >
          {/* Middle Ring */}
          <motion.div 
            animate={state === 'listening' ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-28 h-28 rounded-full flex items-center justify-center border transition-all duration-300 ${
              state === 'listening' 
                ? 'bg-red-500/20 border-red-500/30' 
                : state === 'processing'
                  ? 'bg-yellow-500/20 border-yellow-500/30'
                  : 'bg-[rgba(212,160,23,0.06)] border-[rgba(212,160,23,0.22)]'
            }`}
          >
            {/* Inner Ring */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-md transition-colors duration-300 ${
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

      {/* Dynamic Status Text */}
      <div className={`text-base font-semibold tracking-wide mb-12 uppercase ${
        state === 'listening' ? 'text-red-400 animate-pulse' : state === 'processing' ? 'text-yellow-400' : 'text-[#A89060]'
      }`}>
        {state === 'idle' && 'Tap to speak'}
        {state === 'listening' && 'Listening...'}
        {state === 'processing' && 'Processing audio...'}
      </div>

      {/* Audio Wave Visualizer */}
      <div className={`h-10 flex items-center justify-center gap-1 mb-12 transition-opacity duration-300 ${state === 'listening' ? 'opacity-100' : 'opacity-0'}`}>
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

      {/* Suggested Quick Queries */}
      <div className="w-full">
        <p className="text-xs font-semibold text-[#A89060] uppercase tracking-wider mb-4">Or select a quick query:</p>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {QUICK.map(q => (
            <button 
              key={q} 
              className="p-3 rounded-xl bg-[#111111] border border-[rgba(212,160,23,0.15)] hover:border-[rgba(212,160,23,0.35)] text-xs font-medium text-[#F0E6C8] hover:text-[#F2C94C] transition-all cursor-pointer shadow-sm text-center"
              onClick={() => handleQuick(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Language chips footer */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <p className="text-[10px] font-bold text-[#6B5A3A] uppercase tracking-wider">Supports Multilingual speech:</p>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
          {['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali'].map(l => (
            <span key={l} className="px-2.5 py-1 rounded-full bg-white/[0.02] border border-[rgba(212,160,23,0.08)] text-[10px] font-semibold text-[#A89060]">{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
