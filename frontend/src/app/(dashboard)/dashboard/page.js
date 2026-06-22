"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import axios from "axios";
import { useState, useEffect } from "react";
import { translations } from "@/utils/translations";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DashboardPage() {
  const { savedSchemes, language } = useApp();
  const t = translations[language] || translations.en;
  const [profile, setProfile] = useState(null);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const name = profile?.user?.fullName?.split(" ")[0] || t.guestUser;
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data.profile);

        const schemesRes = await axios.get(`${BACKEND_URL}/api/schemes`);
        const allSchemes = schemesRes.data.data.data.hits.items;

        setRecommendedSchemes(allSchemes.slice(0, 5));
        setNotifications(
          allSchemes.slice(0, 4).map((scheme) => ({
            text: `${scheme.fields.schemeName} ${t.relevantScheme}`,
            time: t.justNow,
            unread: true,
            slug: scheme.fields.slug,
          }))

          
        );

        const history = JSON.parse(
  localStorage.getItem("chatHistory") || "[]"
);

setChatCount(history.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [t.justNow, t.relevantScheme]);
const matchedCount = recommendedSchemes.length;
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8 font-sans">
      <div className="mb-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-1.5 break-words">
          {t.goodMorning}, {name}
        </h2>
        <p className="text-sm text-[#A89060] break-words">{t.dashboardSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
  label: t.savedSchemes,
  value: savedSchemes.length,
  sub: t.thisWeek
},
{
  label: t.aiChats,
  value: chatCount,
  sub: t.past30Days,
},
{
  label: t.applied,
  value: appliedSchemes.length,
  sub: t.awaitingResponse
},
{
  label: t.matched,
  value: matchedCount,
  sub: t.eligibleSchemes
}
        ].map((m) => (
          <div
            key={m.label}
            className="metric-card shadow-sm border border-[rgba(212,160,23,0.18)]"
          >
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white break-words">
              {t.recommendedSchemes}
            </h3>
            <Link href="/schemes" className="text-xs font-semibold text-[#D4A017] hover:underline">
              {t.viewAll}
            </Link>
          </div>
          <div className="space-y-3">
            {recommendedSchemes.map((scheme) => (
              <a
                key={scheme.id}
                href={`https://www.myscheme.gov.in/schemes/${scheme.fields.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-3.5 p-3 rounded-xl bg-white/[0.01] border border-[rgba(212,160,23,0.06)] hover:bg-[rgba(212,160,23,0.03)] transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(212,160,23,0.05)] flex items-center justify-center text-[20px]">
                  📋
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#F0E6C8] truncate">
                    {scheme.fields.schemeName}
                  </div>
                  <div className="text-[10px] text-[#A89060] truncate">
                    {scheme.fields.level}
                  </div>
                </div>
                <span className="hidden sm:inline-flex flex-shrink-0 px-2 py-0.5 rounded bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.15)] text-[9px] text-[#F2C94C] font-semibold">
                  {t.recommended}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white break-words">{t.notifications}</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[rgba(212,160,23,0.1)] text-[#D4A017] text-[10px] font-bold">
              {notifications.length} {t.newLabel}
            </span>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
            {notifications.map((n, i) => (
              <a
                key={i}
                href={`https://www.myscheme.gov.in/schemes/${n.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-xs leading-relaxed hover:bg-[rgba(212,160,23,0.03)] p-2 rounded-lg transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-[#D4A017]" : "bg-transparent"}`} />
                <div className="flex-1">
                  <div className="text-[#F0E6C8] font-medium break-words">{n.text}</div>
                  <div className="text-[10px] text-[#6B5A3A] mt-0.5">{n.time}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white break-words">{t.recentAiChats}</h3>
            <Link href="/chat" className="text-xs font-semibold text-[#D4A017] hover:underline">
              {t.openChat}
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { q: t.scholarshipsBtech, when: t.todayChat },
              { q: t.pmKisanEligibility, when: t.yesterdayChat },
              { q: t.womenEntrepreneurship, when: t.daysAgoChat },
            ].map((c) => (
              <Link
                key={c.q}
                href="/chat"
                className="flex min-w-0 items-center gap-3.5 p-3 rounded-xl bg-white/[0.01] border border-[rgba(212,160,23,0.06)] hover:bg-[rgba(212,160,23,0.03)] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[rgba(212,160,23,0.05)] flex items-center justify-center text-base">
                  💬
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#F0E6C8] truncate">{c.q}</div>
                  <div className="text-[10px] text-[#A89060]">{c.when}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white break-words">{t.profileSummary}</h3>
            <Link href="/profile" className="text-xs font-semibold text-[#D4A017] hover:underline">
              {t.edit}
            </Link>
          </div>
          <div className="space-y-2 mb-4">
            {[
              { k: t.name, v: profile?.user?.fullName || "-" },
              { k: t.email, v: profile?.user?.email || "-" },
              { k: t.languageLabel, v: profile?.preferredLanguage || "-" },
              { k: t.category, v: profile?.category || "-" },
              { k: t.stateLabel, v: profile?.state || "-" },
              { k: t.savedSchemes, v: savedSchemes.length, gold: true },
            ].map((r) => (
              <div
                key={r.k}
                className="flex flex-wrap justify-between gap-2 items-center text-xs leading-snug py-1 border-b border-white/[0.02] last:border-0"
              >
                <span className="text-[#A89060]">{r.k}</span>
                <span className={`font-semibold ${r.gold ? "text-[#F2C94C]" : "text-[#F0E6C8]"}`}>
                  {r.v}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(212,160,23,0.06)] pt-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-2">
              <span>{t.profileCompletion}</span>
              <span>80%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4A017] to-[#F2C94C] rounded-full"
                style={{ width: "80%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
