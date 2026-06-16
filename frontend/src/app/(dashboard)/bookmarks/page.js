"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { translations } from "@/utils/translations";

export default function SavedSchemesPage() {
  const { savedSchemes, toggleSave, language } = useApp();
  const t = translations[language] || translations.en;

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedSchemes();
  }, []);

  const fetchSavedSchemes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/schemes"
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-white">
          ⭐ {t.savedSchemes}
        </h1>

        <p className="text-[#A89060] mt-2">
          {t.bookmarkedSchemes}
        </p>
      </div>

      {schemes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-[rgba(212,160,23,0.2)]">
          <div className="text-5xl mb-4">⭐</div>

          <h3 className="text-xl font-semibold text-white">
            {t.noSavedSchemesYet}
          </h3>

          <p className="text-[#A89060] mt-2">
            {t.saveSchemesHint}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-2xl">
                    📋
                  </div>

                  <button
                    onClick={() => toggleSave(scheme.id)}
                    className="text-[#D4A017] text-xl"
                    title={t.removeFromSaved}
                  >
                    ⭐
                  </button>
                </div>

                <div className="text-[10px] font-bold tracking-wider uppercase text-[#8B6914] mb-2">
                  {scheme.fields.schemeCategory?.join(" • ")}
                </div>

                <h3 className="font-serif text-base font-semibold text-[#F0E6C8] mb-2">
                  {scheme.fields.schemeName}
                </h3>

                <p className="text-xs text-[#A89060] leading-relaxed mb-5">
                  {scheme.fields.briefDescription}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[rgba(212,160,23,0.08)] pt-4">
                <span className="text-xs text-[#6B5A3A]">
                  👤 {scheme.fields.level}
                </span>

                <a
                  href={`https://www.myscheme.gov.in/schemes/${scheme.fields.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-xs font-semibold hover:bg-[#F2C94C]"
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
