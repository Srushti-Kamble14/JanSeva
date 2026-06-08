"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'

const FEATURES = [
  { icon: '🤖', title: 'AI Chatbot', desc: 'Ask anything about government schemes in plain language. Get instant, accurate answers 24/7.' },
  { icon: '🎙️', title: 'Voice Assistant', desc: 'Speak your question — no typing needed. Perfect for rural users and seniors.' },
  { icon: '🌐', title: '10+ Languages', desc: 'Hindi, Marathi, Tamil, Telugu, Bengali and more. The portal speaks your language.' },
  { icon: '⭐', title: 'Smart Recommendations', desc: 'Our AI matches you to schemes you\'re eligible for based on your profile.' },
  { icon: '📋', title: 'Step-by-step Guidance', desc: 'Documents needed, application steps, deadlines — all explained simply.' },
  { icon: '🔔', title: 'Scheme Alerts', desc: 'Get notified when new schemes are added or when deadlines approach.' },
]

const CATEGORIES = [
  { icon: '🎓', label: 'Education', count: 87 },
  { icon: '🌾', label: 'Agriculture', count: 124 },
  { icon: '👩', label: 'Women', count: 63 },
  { icon: '🏥', label: 'Healthcare', count: 95 },
  { icon: '🚀', label: 'Startups', count: 42 },
  { icon: '🏠', label: 'Housing', count: 38 },
]

export default function Home() {
  const { theme } = useApp()

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
            🇮🇳 India's AI-powered Government Portal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-white mb-6">
            Every citizen deserves to<br />
            know their <span className="bg-gradient-to-r from-[#D4A017] to-[#F2C94C] bg-clip-text text-transparent">rights & schemes</span>
          </h1>
          
          <p className="text-base md:text-lg text-[#A89060] max-w-2xl leading-relaxed mb-8">
            Search 500+ government schemes in your language, get instant AI answers, and apply — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/signup" className="btn-gold !py-3 !px-8 text-sm font-semibold tracking-wide">
              Start for Free
            </Link>
            <Link href="/chat" className="btn-ghost !py-3 !px-8 text-sm font-semibold tracking-wide hover:!bg-[rgba(212,160,23,0.15)] hover:text-[#F2C94C]">
              Try AI Chat →
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
            { num: '500+', label: 'Government Schemes' },
            { num: '10+', label: 'Languages' },
            { num: '1.4M+', label: 'Citizens Helped' },
            { num: '28', label: 'States Covered' },
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
          <div className="section-label">Why JanSeva AI</div>
          <h2 className="section-title">Built for every Indian,<br />in every language</h2>
          <p className="section-sub">From a student in Tamil Nadu to a farmer in Punjab — everyone gets the information they need.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div 
              key={f.title} 
              className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.1)] hover:border-[rgba(212,160,23,0.3)] transition-all duration-300 shadow-lg flex flex-col gap-3"
            >
              <div className="w-11 h-11 rounded-lg bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-2xl">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#F0E6C8]">{f.title}</h3>
              <p className="text-sm text-[#A89060] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-6 bg-white/[0.01] border-t border-b border-[rgba(212,160,23,0.1)]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center flex flex-col items-center mb-12">
            <div className="section-label">Browse</div>
            <h2 className="section-title">Browse by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(c => (
              <Link 
                href="/schemes" 
                key={c.label} 
                className="group p-5 rounded-2xl bg-[#111111]/30 border border-[rgba(212,160,23,0.08)] hover:border-[rgba(212,160,23,0.35)] transition-all duration-300 flex flex-col items-center text-center cursor-pointer shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-[rgba(212,160,23,0.05)] group-hover:bg-[rgba(212,160,23,0.12)] transition-colors flex items-center justify-center text-2xl mb-3">
                  {c.icon}
                </div>
                <div className="font-sans text-sm font-semibold text-[#F0E6C8] group-hover:text-[#F2C94C] transition-colors">{c.label}</div>
                <div className="text-xs text-[#A89060] mt-1">{c.count} schemes</div>
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
              Helping every Indian citizen access government schemes — in their own language, at their own pace.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#F2C94C] font-semibold text-sm">Product</h4>
            <Link href="/schemes" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Schemes</Link>
            <Link href="/chat" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">AI Chat</Link>
            <Link href="/voice" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Voice</Link>
            <Link href="/dashboard" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Dashboard</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#F2C94C] font-semibold text-sm">Company</h4>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">About</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Blog</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Careers</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Contact</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#F2C94C] font-semibold text-sm">Legal</h4>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Privacy</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Terms</a>
            <a href="#" className="text-sm text-[#A89060] hover:text-[#D4A017] transition-colors">Disclaimer</a>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-[rgba(212,160,23,0.06)] pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#A89060] gap-4">
          <div>© 2026 JanSeva AI. Made with ❤️ for India.</div>
        </div>
      </footer>
    </div>
  )
}
