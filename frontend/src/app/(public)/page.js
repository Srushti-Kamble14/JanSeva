"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from "@/utils/translations";

const HOME_FEATURES = [
  { icon: '🤖', titleKey: 'featureAiChatbotTitle', descKey: 'featureAiChatbotDesc' },
  { icon: '🎙️', titleKey: 'featureVoiceAssistantTitle', descKey: 'featureVoiceAssistantDesc' },
  { icon: '🌐', titleKey: 'featureLanguagesTitle', descKey: 'featureLanguagesDesc' },
  { icon: '⭐', titleKey: 'featureRecommendationsTitle', descKey: 'featureRecommendationsDesc' },
  { icon: '📋', titleKey: 'featureGuidanceTitle', descKey: 'featureGuidanceDesc' },
  { icon: '🔔', titleKey: 'featureAlertsTitle', descKey: 'featureAlertsDesc' },
]

const HOME_CATEGORIES = [
  
  { icon: '🎓', labelKey: 'categoryEducation', count: 87 },
  { icon: '🌾', labelKey: 'categoryAgriculture', count: 124 },
  { icon: '👩', labelKey: 'categoryWomen', count: 63 },
  { icon: '🏥', labelKey: 'categoryHealthcare', count: 95 },
  { icon: '🚀', labelKey: 'categoryStartups', count: 42 },
  { icon: '🏠', labelKey: 'categoryHousing', count: 38 },
]

export default function Home() {
  const { language } = useApp();
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center text-center px-6 border-b border-[rgba(212,160,23,0.1)]">
        {/* Subtle premium background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(212,160,23,0.03)] to-transparent pointer-events-none" />
        
        {/* Animated Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.25)] text-xs font-semibold text-[#D4A017] mb-6 tracking-wide uppercase">
           {t.heroBadge}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-white mb-6">
            {t.heroTitle}
          </h1>
          
          <p className="text-base md:text-lg text-[#A89060] max-w-2xl leading-relaxed mb-8">
           {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/signup" className="btn-gold !py-3 !px-8 text-sm font-semibold tracking-wide">
              {t.startFree}
            </Link>
            <Link href="/chat" className="btn-ghost !py-3 !px-8 text-sm font-semibold tracking-wide hover:!bg-[rgba(212,160,23,0.15)] hover:text-[#F2C94C]">
              {t.tryAiChat}
            </Link>
          </div>
        </motion.div>

        {/* Animated Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/[0.01] border border-[rgba(212,160,23,0.1)] backdrop-blur-sm shadow-xl"
        >
          {[
            { num: '500+', label: t.governmentSchemes },
            { num: '10+', label: t.languages },
            { num: '1.4M+', label: t.citizensHelped },
            { num: '28', label: t.statesCovered },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center p-2">
              <div className="text-2xl md:text-3xl font-bold font-serif text-[#F2C94C]">{s.num}</div>
              <div className="text-xs md:text-sm text-[#A89060] mt-1 text-center font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center flex flex-col items-center mb-12">
          <div className="section-label">{t.whyJanseva}</div>
          <h2 className="section-title">{t.builtForEveryIndian}</h2>
          <p className="section-sub">{t.builtForEveryIndianDesc}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOME_FEATURES.map(f => (
            <div 
              key={f.titleKey} 
              className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.1)] hover:border-[rgba(212,160,23,0.3)] transition-all duration-300 shadow-lg flex flex-col gap-3"
            >
              <div className="w-11 h-11 rounded-lg bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-2xl">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#F0E6C8]">{t[f.titleKey]}</h3>
              <p className="text-sm text-[#A89060] leading-relaxed">{t[f.descKey]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-6 bg-white/[0.01] border-t border-b border-[rgba(212,160,23,0.1)]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center flex flex-col items-center mb-12">
            <div className="section-label">{t.browse}</div>
            <h2 className="section-title">{t.browseByCategory}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOME_CATEGORIES.map(c => (
              <Link 
                href="/schemes" 
                key={c.labelKey} 
                className="group p-5 rounded-2xl bg-[#111111]/30 border border-[rgba(212,160,23,0.08)] hover:border-[rgba(212,160,23,0.35)] transition-all duration-300 flex flex-col items-center text-center cursor-pointer shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-[rgba(212,160,23,0.05)] group-hover:bg-[rgba(212,160,23,0.12)] transition-colors flex items-center justify-center text-2xl mb-3">
                  {c.icon}
                </div>
                <div className="font-sans text-sm font-semibold text-[#F0E6C8] group-hover:text-[#F2C94C] transition-colors">{t[c.labelKey]}</div>
                <div className="text-xs text-[#A89060] mt-1">{c.count} {t.schemes}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A0A0A] border-t border-[rgba(212,160,23,0.1)] px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <div className="font-serif text-2xl font-bold text-white tracking-wide">
              JanSeva <span className="text-[#D4A017]">AI</span>
            </div>
            <p className="text-sm text-[#A89060] leading-relaxed">
              {t.footerTagline}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#F2C94C] font-semibold text-sm">{t.product}</h4>
            <Link href="/schemes" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.schemes}</Link>
            <Link href="/chat" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.aiChat}</Link>
            <Link href="/voice" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.voice}</Link>
            <Link href="/dashboard" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.dashboard}</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#F2C94C] font-semibold text-sm">{t.company}</h4>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.about}</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.blog}</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.careers}</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.contact}</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#F2C94C] font-semibold text-sm">{t.legal}</h4>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.privacy}</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.terms}</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">{t.disclaimer}</a>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-[rgba(212,160,23,0.06)] pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#A89060] gap-4">
          <div>{t.copyright}</div>
        </div>
      </footer>
    </div>
  )
}
