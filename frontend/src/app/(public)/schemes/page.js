"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import axios from "axios";

export default function SchemesPage() {
  const { savedSchemes, toggleSave } = useApp();
  const [search, setSearch] = useState("");

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schemes");

      setSchemes(res.data.data.data.hits.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
 const filtered = schemes.filter((s) => {
  const name = s.fields.schemeName || "";
  const description = s.fields.briefDescription || "";
  const category = s.fields.schemeCategory?.join(" ") || "";

  return (
    name.toLowerCase().includes(search.toLowerCase()) ||
    description.toLowerCase().includes(search.toLowerCase()) ||
    category.toLowerCase().includes(search.toLowerCase())
  );
});

  useEffect(() => {
    fetchSchemes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white">
        Loading schemes...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-white">
          Government Schemes
        </h1>
        <p className="text-sm md:text-base text-[#A89060]">
          500+ schemes from Central and State governments — all in one place
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-xl mb-8 flex items-center">
        <span className="absolute left-4 text-lg pointer-events-none select-none text-[#A89060]">
          🔍
        </span>
        <input
          className="w-full bg-[#1A1A1A] border border-[rgba(212,160,23,0.18)] focus:border-[#8B6914] text-[#F0E6C8] pl-11 pr-10 py-3 rounded-xl text-sm font-sans outline-none transition-colors"
          type="text"
          placeholder="Search by scheme name, category, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="absolute right-4 text-[#A89060] hover:text-[#D4A017] transition-colors cursor-pointer"
            onClick={() => setSearch("")}
          >
            ✕
          </button>
        )}
      </div>

     

      {/* Schemes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[rgba(212,160,23,0.15)] rounded-2xl bg-white/[0.01]">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-serif text-lg font-semibold text-white">
            No schemes found
          </h3>
          <p className="text-sm text-[#A89060] mt-1">
            Try a different search term or category filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => {
            const isSaved = savedSchemes.includes(s.id);
            return (
              <motion.div
                key={s.id}
                whileHover={{ y: -4, borderColor: "rgba(212,160,23,0.45)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] shadow-md relative group cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-1.5xl">
                      🏛️
                    </div>
                    <button
                      className={`text-xl transition-transform duration-200 active:scale-95 cursor-pointer ${
                        isSaved
                          ? "text-[#D4A017]"
                          : "text-[#6B5A3A] hover:text-[#D4A017]"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSave(s.id);
                      }}
                      title={isSaved ? "Remove from saved" : "Save scheme"}
                    >
                      {isSaved ? "⭐" : "☆"}
                    </button>
                  </div>

                  <div className="text-[10px] font-bold tracking-wider uppercase text-[#8B6914] mb-1.5">
                    {s.fields.schemeCategory?.join(" • ")}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#F0E6C8] mb-2 leading-snug group-hover:text-[#F2C94C] transition-colors">
                    {s.fields.schemeName}
                  </h3>
                  <p className="text-xs text-[#A89060] leading-relaxed mb-6 truncate-3-lines">
                    {s.fields.briefDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(212,160,23,0.08)] pt-4 mt-auto">
                  <span className="text-xs font-semibold text-[#6B5A3A]">
                    👤 {s.fields.level}
                  </span>
                  <a
                    href={`https://www.myscheme.gov.in/schemes/${s.fields.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-apply text-[11px] font-sans font-medium py-1.5 px-4 rounded-lg"
                  >
                    View →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
