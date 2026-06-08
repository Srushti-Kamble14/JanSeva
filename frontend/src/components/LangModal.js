"use client"

import { useApp } from '@/context/AppContext'
import { LANGUAGES } from '@/utils/data'
import { motion } from 'framer-motion'

export default function LangModal({ onClose }) {
  const { language, setLanguage } = useApp()

  const pick = (name) => {
    setLanguage(name)
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="w-full max-w-md bg-[#111111] border border-[rgba(212,160,23,0.22)] rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[rgba(212,160,23,0.1)]">
          <h3 className="font-serif text-xl font-bold text-[#D4A017]">Select Language</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(212,160,23,0.05)] text-[#A89060] hover:bg-[rgba(212,160,23,0.2)] hover:text-[#D4A017] transition-colors text-base cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 max-h-[350px] overflow-y-auto space-y-2">
          {LANGUAGES.map(l => (
            <div
              key={l.code}
              className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                language === l.name 
                  ? 'bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.45)] text-[#F2C94C]' 
                  : 'bg-white/[0.02] border border-transparent text-[#F0E6C8] hover:bg-[rgba(212,160,23,0.05)] hover:border-[rgba(212,160,23,0.2)]'
              }`}
              onClick={() => pick(l.name)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{l.flag}</span>
                <div>
                  <div className="font-medium text-sm font-sans">{l.name}</div>
                  <div className="text-xs text-[#A89060]">{l.native}</div>
                </div>
              </div>
              {language === l.name && <span className="text-[#D4A017] font-bold text-sm">✓</span>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
