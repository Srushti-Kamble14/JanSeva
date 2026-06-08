"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import LangModal from './LangModal'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { theme, toggleTheme, language, user, logout } = useApp()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }
  const closeMenu = () => setMenuOpen(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/schemes', label: 'Schemes' },
    { to: '/chat', label: 'AI Chat' },
    { to: '/voice', label: 'Voice' },
  ]

  const isActive = (path) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b backdrop-blur-md transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A]/80 border-[rgba(212,160,23,0.15)] text-[#F0E6C8]' 
          : 'bg-[#F8F4EC]/80 border-[rgba(139,105,20,0.15)] text-[#1A1208]'
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold cursor-pointer" onClick={closeMenu}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A017] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] font-serif text-lg">
            ज
          </div>
          <span className="font-sans text-lg font-semibold tracking-wide">
            JanSeva <span className="text-[#D4A017]">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link 
              key={l.to} 
              href={l.to}
              className={`text-sm font-medium transition-colors font-sans hover:text-[#D4A017] ${
                isActive(l.to) ? 'text-[#D4A017]' : 'text-[#A89060]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(212,160,23,0.3)] text-xs font-sans hover:bg-[rgba(212,160,23,0.1)] transition-colors cursor-pointer"
            onClick={() => setLangOpen(true)}
            title="Change language"
          >
            🌐 <span>{language}</span>
          </button>
          
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(212,160,23,0.3)] hover:bg-[rgba(212,160,23,0.1)] transition-colors text-sm cursor-pointer"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost !py-1.5 !px-4 text-xs font-sans">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-gold !py-1.5 !px-4 text-xs font-sans cursor-pointer">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-1.5 !px-4 text-xs font-sans">
                Log In
              </Link>
              <Link href="/signup" className="btn-gold !py-1.5 !px-4 text-xs font-sans">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Toggle */}
        <button 
          className="md:hidden w-8 h-8 flex items-center justify-center text-xl cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={`absolute top-16 left-0 right-0 border-b flex flex-col p-5 space-y-4 md:hidden shadow-xl z-50 overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-[#111111] border-[rgba(212,160,23,0.15)] text-[#F0E6C8]' 
                  : 'bg-[#FFFFFF] border-[rgba(139,105,20,0.15)] text-[#1A1208]'
              }`}
            >
              {links.map(l => (
                <Link 
                  key={l.to} 
                  href={l.to} 
                  className={`text-sm font-medium py-1 font-sans transition-colors ${
                    isActive(l.to) ? 'text-[#D4A017] font-semibold' : 'text-[#A89060]'
                  }`} 
                  onClick={closeMenu}
                >
                  {l.label}
                </Link>
              ))}
              
              <button 
                className="flex items-center gap-1.5 text-sm font-medium text-left font-sans py-1 cursor-pointer" 
                onClick={() => { setLangOpen(true); closeMenu() }}
              >
                🌐 Language: {language}
              </button>
              
              <button 
                className="text-sm font-medium text-left font-sans py-1 cursor-pointer" 
                onClick={() => { toggleTheme(); closeMenu() }}
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              
              <div className="border-t border-[rgba(212,160,23,0.1)] pt-3 flex flex-col gap-2" />
              
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium py-1 font-sans text-left" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); closeMenu() }} 
                    className="text-sm font-medium text-left text-red-400 py-1 font-sans cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium py-1 font-sans text-left" onClick={closeMenu}>
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="btn-gold !py-2 !w-full text-center text-xs font-sans font-medium" 
                    onClick={closeMenu}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {langOpen && <LangModal onClose={() => setLangOpen(false)} />}
    </>
  )
}
