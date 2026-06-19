"use client"

import { motion } from "framer-motion"
import { useApp } from "@/context/AppContext"
import { SUPPORTED_LANGUAGES, translations } from "@/utils/translations"

export default function LangModal({ onClose }) {
  const { language, setLanguage } = useApp()
  const t = translations[language] || translations.en

  const pick = (lang) => {
    setLanguage(lang.code)
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
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[rgba(212,160,23,0.1)]">
          <h3 className="font-serif text-xl font-bold text-[#D4A017]">{t.selectLanguage}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(212,160,23,0.05)] text-[#A89060] hover:bg-[rgba(212,160,23,0.2)] hover:text-[#D4A017] transition-colors text-base cursor-pointer"
            type="button"
            aria-label={t.close}
          >
            ×
          </button>
        </div>

        <div className="p-4 max-h-[350px] overflow-y-auto space-y-2">
          {SUPPORTED_LANGUAGES.map((item) => (
            <button
              key={item.code}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                language === item.code
                  ? "bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.45)] text-[#F2C94C]"
                  : "bg-white/[0.02] border border-transparent text-[#F0E6C8] hover:bg-[rgba(212,160,23,0.05)] hover:border-[rgba(212,160,23,0.2)]"
              }`}
              onClick={() => pick(item)}
              type="button"
            >
              <span className="flex items-center gap-3 text-left">
                <span className="text-2xl" aria-hidden="true">🇮🇳</span>
                <span>
                  <span className="block font-medium text-sm font-sans">{item.name}</span>
                  <span className="block text-xs text-[#A89060]">{item.native}</span>
                </span>
              </span>
              {language === item.code && <span className="text-[#D4A017] font-bold text-sm">✓</span>}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
