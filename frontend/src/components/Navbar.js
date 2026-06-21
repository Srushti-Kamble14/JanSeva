"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useApp } from "@/context/AppContext"
import LangModal from "./LangModal"
import { SUPPORTED_LANGUAGES, translations } from "@/utils/translations"

export default function Navbar() {
  const { theme, toggleTheme, language, user, logout } = useApp()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const t = translations[language] || translations.en
  const currentLanguage = SUPPORTED_LANGUAGES.find((item) => item.code === language) || SUPPORTED_LANGUAGES[0]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const closeMenu = () => setMenuOpen(false)

  const links = [
    { to: "/", label: t.home },
    { to: "/schemes", label: t.schemes },
    { to: "/chat", label: t.aiChat },
    { to: "/voice", label: t.voice },
  ]

  const mobileMainLinks = [
    { to: "/dashboard", icon: "🏠", label: t.dashboard },
    { to: "/chat", icon: "💬", label: t.aiAssistant },
    { to: "/schemes", icon: "📋", label: t.allSchemes },
    { to: "/voice", icon: "🎙️", label: t.voiceAssistant },
    { to: "/bookmarks", icon: "⭐", label: t.savedSchemes },
  ]

  const mobileAccountLinks = [
    { to: "/profile", icon: "👤", label: t.profile },
  ]

  const isActive = (path) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between gap-3 px-4 sm:px-6 border-b backdrop-blur-md transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#0A0A0A]/80 border-[rgba(212,160,23,0.15)] text-[#F0E6C8]"
            : "bg-[#F8F4EC]/80 border-[rgba(139,105,20,0.15)] text-[#1A1208]"
        }`}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-bold cursor-pointer" onClick={closeMenu}>
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#D4A017] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] font-serif text-lg">
            ज
          </div>
          <span className="truncate font-sans text-base sm:text-lg font-semibold tracking-wide">
            JanSeva <span className="text-[#D4A017]">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`text-sm font-medium transition-colors font-sans hover:text-[#D4A017] ${
                isActive(link.to) ? "text-[#D4A017]" : "text-[#A89060]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(212,160,23,0.3)] text-xs font-sans hover:bg-[rgba(212,160,23,0.1)] transition-colors cursor-pointer"
            onClick={() => setLangOpen(true)}
            title={t.changeLanguage}
            type="button"
          >
            <span aria-hidden="true">🌐</span>
            <span>{currentLanguage.native}</span>
          </button>

          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(212,160,23,0.3)] hover:bg-[rgba(212,160,23,0.1)] transition-colors text-sm cursor-pointer"
            onClick={toggleTheme}
            title={t.toggleTheme}
            type="button"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost !py-1.5 !px-4 text-xs font-sans">
                {t.dashboard}
              </Link>
              <button onClick={handleLogout} className="btn-gold !py-1.5 !px-4 text-xs font-sans cursor-pointer" type="button">
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-1.5 !px-4 text-xs font-sans">
                {t.login}
              </Link>
              <Link href="/signup" className="btn-gold !py-1.5 !px-4 text-xs font-sans">
                {t.getStarted}
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden w-11 h-11 flex flex-shrink-0 items-center justify-center text-xl cursor-pointer"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t.menu}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 z-50 md:hidden"
            onClick={closeMenu}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`relative flex h-full w-[min(20rem,85vw)] flex-col overflow-y-auto border-r p-5 shadow-2xl font-sans ${
                theme === "dark"
                  ? "bg-[#0A0A0A] border-[rgba(212,160,23,0.15)] text-[#F0E6C8]"
                  : "bg-[#F8F4EC] border-[rgba(139,105,20,0.15)] text-[#1A1208]"
              }`}
              onClick={(event) => event.stopPropagation()}
              aria-label={t.menu}
            >
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-[rgba(212,160,23,0.08)] mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A017] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] font-bold text-base flex-shrink-0">
                    {(user?.fullName || user?.name || t.guestUser || "A")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <div className="text-sm font-semibold truncate leading-tight">
                      {user?.fullName || user?.name || t.guestUser}
                    </div>
                    <div className="text-xs text-[#A89060] truncate">
                      {user?.email || t.profile}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-bold tracking-wider uppercase text-[#A89060] mb-2 px-2.5">
                {t.main}
              </div>
              <div className="space-y-1 mb-6">
                {mobileMainLinks.map((link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-[rgba(212,160,23,0.06)] hover:text-[#D4A017] ${
                      isActive(link.to)
                        ? "bg-[rgba(212,160,23,0.1)] text-[#F2C94C] font-medium border-l-2 border-[#D4A017] pl-2.5"
                        : "text-[#A89060]"
                    }`}
                    onClick={closeMenu}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="flex-1 min-w-0 break-words">{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="text-[11px] font-bold tracking-wider uppercase text-[#A89060] mb-2 px-2.5">
                {t.account}
              </div>
              <div className="space-y-1 mb-6">
                {mobileAccountLinks.map((link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-[rgba(212,160,23,0.06)] hover:text-[#D4A017] ${
                      isActive(link.to)
                        ? "bg-[rgba(212,160,23,0.1)] text-[#F2C94C] font-medium border-l-2 border-[#D4A017] pl-2.5"
                        : "text-[#A89060]"
                    }`}
                    onClick={closeMenu}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="min-w-0 break-words">{link.label}</span>
                  </Link>
                ))}

                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A89060] hover:bg-[rgba(212,160,23,0.06)] hover:text-[#D4A017] transition-colors w-full text-left font-sans cursor-pointer"
                  onClick={() => {
                    setLangOpen(true)
                    closeMenu()
                  }}
                  type="button"
                >
                  <span className="text-base">🌐</span>
                  <span className="min-w-0 break-words">{currentLanguage.native}</span>
                </button>

                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A89060] hover:bg-[rgba(212,160,23,0.06)] hover:text-[#D4A017] transition-colors w-full text-left font-sans cursor-pointer"
                  onClick={() => {
                    toggleTheme()
                    closeMenu()
                  }}
                  type="button"
                >
                  <span className="text-base">{theme === "dark" ? "☀️" : "🌙"}</span>
                  <span className="min-w-0 break-words">{theme === "dark" ? t.lightMode : t.darkMode}</span>
                </button>
              </div>

              <div className="flex-1" />

              <button
                onClick={() => {
                  handleLogout()
                  closeMenu()
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A89060] hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left font-sans cursor-pointer"
                type="button"
              >
                <span className="text-base">🚪</span>
                <span>{t.logout}</span>
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {langOpen && <LangModal onClose={() => setLangOpen(false)} />}
    </>
  )
}
