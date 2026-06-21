"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { translations } from "@/utils/translations";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SavedSchemesPage() {
  const { savedSchemes, toggleSave, language } = useApp();
  const t = translations[language] || translations.en;

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedSchemes();
  }, [savedSchemes, language]);

  const fetchSavedSchemes = async () => {
    try {
      const res = await axios.get(
  `${BACKEND_URL}/api/schemes?language=${language}`
);

      const allSchemes =
        res.data.data.data.hits.items;

      const filtered = allSchemes.filter(
        (scheme) => savedSchemes.includes(scheme.id)
      );

      setSchemes(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white">
        {t.loadingSavedSchemes}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-0 sm:px-2 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-white break-words">
          ⭐ {t.savedSchemes}
        </h1>

        <p className="text-sm text-[#A89060] mt-2 break-words">
          {t.bookmarkedSchemes}
        </p>
      </div>

      {schemes.length === 0 ? (
        <div className="text-center py-14 sm:py-20 px-4 rounded-2xl border border-dashed border-[rgba(212,160,23,0.2)]">
          <div className="text-5xl mb-4">⭐</div>

          <h3 className="text-lg sm:text-xl font-semibold text-white break-words">
            {t.noSavedSchemesYet}
          </h3>

          <p className="text-sm text-[#A89060] mt-2 break-words">
            {t.saveSchemesHint}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="min-w-0 flex flex-col justify-between p-4 sm:p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-2xl">
                    📋
                  </div>

                  <button
                    onClick={() => toggleSave(scheme.id)}
                    className="min-h-11 min-w-11 text-[#D4A017] text-xl"
                    title={t.removeFromSaved}
                  >
                    ⭐
                  </button>
                </div>

                <div className="text-[10px] font-bold tracking-wider uppercase text-[#8B6914] mb-2 break-words">
                  {scheme.fields.schemeCategory?.join(" • ")}
                </div>

                <h3 className="font-serif text-base font-semibold text-[#F0E6C8] mb-2 break-words">
                  {scheme.fields.schemeName}
                </h3>

                <p className="text-xs text-[#A89060] leading-relaxed mb-5 break-words">
                  {scheme.fields.briefDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(212,160,23,0.08)] pt-4">
                <span className="min-w-0 text-xs text-[#6B5A3A] break-words">
                  👤 {scheme.fields.level}
                </span>

                <a
                  href={`https://www.myscheme.gov.in/schemes/${scheme.fields.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-11 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-xs font-semibold hover:bg-[#F2C94C]"
                >
                  {t.view}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
