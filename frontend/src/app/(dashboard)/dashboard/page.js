"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";


export default function DashboardPage() {
  const { user, savedSchemes } = useApp();
  const [profile, setProfile] = useState(null);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [notifications, setNotifications] = useState([]);
 const name =
  profile?.user?.fullName?.split(" ")[0] || "Citizen";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Token:", token);
        setProfile(res.data.profile);


        const schemesRes = await axios.get(
  "http://localhost:5000/api/schemes"
);

const allSchemes =
  schemesRes.data.data.data.hits.items;

setRecommendedSchemes(
  allSchemes.slice(0, 5)
);

setNotifications(
  allSchemes.slice(0, 4).map((scheme) => ({
    text: `${scheme.fields.schemeName} may be relevant to you`,
    time: "Just now",
    unread: true,
    slug: scheme.fields.slug,
  }))
);
      } catch (error) {
        console.error(error);
      }
    };



    fetchProfile();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="mb-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-1.5">
          Good morning, {name} ☀️
        </h2>
        <p className="text-sm text-[#A89060]">
          You have 3 new scheme recommendations based on your profile.
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Saved Schemes",
            value: savedSchemes.length,
            sub: "↑ 3 this week",
          },
          { label: "AI Chats", value: 47, sub: "Past 30 days" },
          { label: "Applied", value: 3, sub: "Awaiting response" },
          { label: "Matched", value: 28, sub: "Eligible schemes" },
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

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Schemes */}
        <div className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white">
              Recommended Schemes
            </h3>
            <Link
              href="/schemes"
              className="text-xs font-semibold text-[#D4A017] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
           {recommendedSchemes.map((scheme) => (
             <a
  key={scheme.id}
  href={`https://www.myscheme.gov.in/schemes/${scheme.fields.slug}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.01] border border-[rgba(212,160,23,0.06)] hover:bg-[rgba(212,160,23,0.03)] transition-colors cursor-pointer"
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
                <span className="px-2 py-0.5 rounded bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.15)] text-[9px] text-[#F2C94C] font-semibold">
                  Recommended
                </span>
             </a>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white">
              Notifications
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[rgba(212,160,23,0.1)] text-[#D4A017] text-[10px] font-bold">
             {notifications.length} new
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
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-[#D4A017]" : "bg-transparent"}`}
                />
                <div className="flex-1">
                  <div className="text-[#F0E6C8] font-medium">{n.text}</div>
                  <div className="text-[10px] text-[#6B5A3A] mt-0.5">
                    {n.time}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white">
              Recent AI Chats
            </h3>
            <Link
              href="/chat"
              className="text-xs font-semibold text-[#D4A017] hover:underline"
            >
              Open chat →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Scholarships for B.Tech students",
                when: "Today, 9:30 AM · 5 messages",
              },
              {
                q: "PM Kisan eligibility criteria",
                when: "Yesterday · 12 messages",
              },
              {
                q: "Women entrepreneurship schemes",
                when: "2 days ago · 8 messages",
              },
            ].map((c) => (
              <Link
                key={c.q}
                href="/chat"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.01] border border-[rgba(212,160,23,0.06)] hover:bg-[rgba(212,160,23,0.03)] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[rgba(212,160,23,0.05)] flex items-center justify-center text-base">
                  💬
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#F0E6C8] truncate">
                    {c.q}
                  </div>
                  <div className="text-[10px] text-[#A89060]">{c.when}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile summary card */}
        <div className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(212,160,23,0.08)]">
            <h3 className="font-serif text-lg font-semibold text-white">
              Profile Summary
            </h3>
            <Link
              href="/profile"
              className="text-xs font-semibold text-[#D4A017] hover:underline"
            >
              Edit →
            </Link>
          </div>
          <div className="space-y-2 mb-4">
            {[
              { k: "Name", v: profile?.user?.fullName || "-" },
              { k: "Email", v: profile?.user?.email || "-" },
              { k: "Language", v: profile?.preferredLanguage || "-" },
              { k: "Category", v: profile?.category || "-" },
              { k: "State", v: profile?.state || "-" },
              { k: "Saved Schemes", v: savedSchemes.length, gold: true },
            ].map((r) => (
              <div
                key={r.k}
                className="flex justify-between items-center text-xs leading-none py-1 border-b border-white/[0.02] last:border-0"
              >
                <span className="text-[#A89060]">{r.k}</span>
                <span
                  className={`font-semibold ${r.gold ? "text-[#F2C94C]" : "text-[#F0E6C8]"}`}
                >
                  {r.v}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(212,160,23,0.06)] pt-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-2">
              <span>Profile Completion</span>
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
