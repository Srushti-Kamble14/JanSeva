"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { SCHEMES, CATEGORIES } from '@/utils/data'

export default function SchemesPage() {
  const { savedSchemes, toggleSave, theme } = useApp()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = SCHEMES.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'all' || s.tags.includes(activeFilter)
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-white">Government Schemes</h1>
        <p className="text-sm md:text-base text-[#A89060]">500+ schemes from Central and State governments — all in one place</p>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-xl mb-8 flex items-center">
        <span className="absolute left-4 text-lg pointer-events-none select-none text-[#A89060]">🔍</span>
        <input
          className="w-full bg-[#1A1A1A] border border-[rgba(212,160,23,0.18)] focus:border-[#8B6914] text-[#F0E6C8] pl-11 pr-10 py-3 rounded-xl text-sm font-sans outline-none transition-colors"
          type="text"
          placeholder="Search by scheme name, category, or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button 
            className="absolute right-4 text-[#A89060] hover:text-[#D4A017] transition-colors cursor-pointer" 
            onClick={() => setSearch('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Categories Filter Chips */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border font-sans transition-all duration-200 cursor-pointer ${
              activeFilter === c.id 
                ? 'bg-[rgba(212,160,23,0.15)] border-[#D4A017] text-[#F2C94C]' 
                : 'bg-[#111111]/40 border-[rgba(212,160,23,0.15)] text-[#A89060] hover:border-[rgba(212,160,23,0.3)] hover:text-[#F0E6C8]'
            }`}
            onClick={() => setActiveFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[rgba(212,160,23,0.15)] rounded-2xl bg-white/[0.01]">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-serif text-lg font-semibold text-white">No schemes found</h3>
          <p className="text-sm text-[#A89060] mt-1">Try a different search term or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => {
            const isSaved = savedSchemes.includes(s.id)
            return (
              <motion.div 
                key={s.id}
                whileHover={{ y: -4, borderColor: "rgba(212,160,23,0.45)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] shadow-md relative group cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-2xl">
                      {s.icon}
                    </div>
                    <button
                      className={`text-xl transition-transform duration-200 active:scale-95 cursor-pointer ${
                        isSaved ? 'text-[#D4A017]' : 'text-[#6B5A3A] hover:text-[#D4A017]'
                      }`}
                      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSave(s.id) }}
                      title={isSaved ? 'Remove from saved' : 'Save scheme'}
                    >
                      {isSaved ? '⭐' : '☆'}
                    </button>
                  </div>
                  
                  <div className="text-[10px] font-bold tracking-wider uppercase text-[#8B6914] mb-1.5">{s.category}</div>
                  <h3 className="font-serif text-base font-semibold text-[#F0E6C8] mb-2 leading-snug group-hover:text-[#F2C94C] transition-colors">{s.title}</h3>
                  <p className="text-xs text-[#A89060] leading-relaxed mb-6 truncate-3-lines">{s.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(212,160,23,0.08)] pt-4 mt-auto">
                  <span className="text-xs font-semibold text-[#6B5A3A]">👤 {s.eligibility}</span>
                  <Link href={`/schemes/${s.id}`} className="btn-apply text-[11px] font-sans font-medium py-1.5 px-4 rounded-lg">
                    View →
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
