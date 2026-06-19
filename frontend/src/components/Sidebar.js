"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { translations } from "@/utils/translations";


export default function Sidebar() {
  const { logout, savedSchemes, user, theme,language } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const t = translations[language] || translations.en;

  const NAV = [
  { to: '/dashboard', icon: '🏠', label: t.dashboard },
  { to: '/chat', icon: '💬', label: t.aiAssistant },
  { to: '/schemes', icon: '📋', label: t.allSchemes },
  { to: '/voice', icon: '🎙️', label: t.voiceAssistant },
  { to: '/saved', icon: '⭐', label: t.savedSchemes },
];

const ACCOUNT = [
  { to: '/profile', icon: '👤', label: t.profile },
  { to: '/admin', icon: '⚙️', label: t.adminPanel },
];

  const displayName = user?.fullName || user?.name || t.guestUser;
  const displayEmail = user?.email || "";
 

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <aside
      className={`w-64 h-[calc(100vh-64px)] fixed top-16 left-0 hidden md:flex flex-col p-5 border-r font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0A0A0A]/40 border-[rgba(212,160,23,0.15)] text-[#F0E6C8]"
          : "bg-[#F8F4EC]/40 border-[rgba(139,105,20,0.15)] text-[#1A1208]"
      }`}
    >
      {/* User Section */}
      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-[rgba(212,160,23,0.08)] mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A017] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] font-bold text-base flex-shrink-0">
            {(displayName || "A")[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold truncate leading-tight">
              {displayName}
            </div>
            <div className="text-xs text-[#A89060] truncate">
              {displayEmail || t.profile}
            </div>
          </div>
        </div>

       
      </div>

      {/* Main Items */}
      <div className="text-[11px] font-bold tracking-wider uppercase text-[#A89060] mb-2 px-2.5">
       {t.main}
      </div>
      <div className="space-y-1 mb-6">
        {NAV.map((l) => (
          <Link
            key={l.to}
            href={l.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-[rgba(212,160,23,0.06)] hover:text-[#D4A017] ${
              isActive(l.to)
                ? "bg-[rgba(212,160,23,0.1)] text-[#F2C94C] font-medium border-l-2 border-[#D4A017] pl-2.5"
                : "text-[#A89060]"
            }`}
          >
            <span className="text-base">{l.icon}</span>
            <span className="flex-1">{l.label}</span>
            {l.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#D4A017] text-[#0A0A0A] text-[10px] font-bold">
                {l.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Account Items */}
      <div className="text-[11px] font-bold tracking-wider uppercase text-[#A89060] mb-2 px-2.5">
       {t.account}
      </div>
      <div className="space-y-1 mb-6">
        {ACCOUNT.map((l) => (
          <Link
            key={l.to}
            href={l.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-[rgba(212,160,23,0.06)] hover:text-[#D4A017] ${
              isActive(l.to)
                ? "bg-[rgba(212,160,23,0.1)] text-[#F2C94C] font-medium border-l-2 border-[#D4A017] pl-2.5"
                : "text-[#A89060]"
            }`}
          >
            <span className="text-base">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>

      {/* Saved Metrics */}
      <div className="text-[11px] font-bold tracking-wider uppercase text-[#A89060] mb-2 px-2.5">
        {t.saved}
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#A89060]">
        <span className="text-base">⭐</span>
        <span>{savedSchemes.length} {t.savedSchemes}</span>
      </div>

      <div className="flex-1" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A89060] hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left font-sans cursor-pointer"
      >
        <span className="text-base">🚪</span>
        <span>{t.logout}</span>
      </button>
    </aside>
  );
}
