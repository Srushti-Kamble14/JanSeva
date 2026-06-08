"use client"

import { useState } from 'react'
import { SCHEMES } from '@/utils/data'

export default function AdminPage() {
  const [schemes, setSchemes] = useState(SCHEMES)

  const remove = (id) => {
    if (confirm("Are you sure you want to delete this scheme?")) {
      setSchemes(s => s.filter(x => x.id !== id))
    }
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white mb-1">Admin Panel</h1>
          <p className="text-sm text-[#A89060]">Manage government schemes and view system-wide analytics</p>
        </div>
        <button className="btn-gold !py-2.5 !px-5 text-xs font-semibold shadow-md cursor-pointer">
          + Add Scheme
        </button>
      </div>

      {/* Analytics Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Schemes', value: '527' },
          { label: 'Active', value: '489' },
          { label: 'Total Users', value: '1.4M' },
          { label: 'Applications', value: '89K' },
        ].map(m => (
          <div key={m.label} className="metric-card border border-[rgba(212,160,23,0.18)] shadow-sm">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Schemes Data Table Card */}
      <div className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-md overflow-hidden">
        <h3 className="font-serif text-lg font-bold text-white mb-6 pb-2 border-b border-[rgba(212,160,23,0.08)]">Manage Schemes</h3>
        
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[rgba(212,160,23,0.12)] text-[10px] uppercase tracking-wider text-[#A89060] font-bold">
                <th className="px-6 py-4 font-bold">Scheme Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Benefit</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02] text-xs text-[#F0E6C8]">
              {schemes.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <span className="text-xl w-8 h-8 rounded-lg bg-[rgba(212,160,23,0.05)] flex items-center justify-center">{s.icon}</span>
                    <span className="truncate max-w-[220px]">{s.title}</span>
                  </td>
                  <td className="px-6 py-4 text-[#A89060] font-medium">
                    {s.category.split('•')[0].trim()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#F2C94C]">
                    {s.benefit}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      s.status === 'active' 
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                        : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-[rgba(212,160,23,0.25)] text-[#A89060] hover:bg-[rgba(212,160,23,0.05)] hover:text-[#D4A017] transition-all cursor-pointer">
                        Edit
                      </button>
                      <button 
                        onClick={() => remove(s.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
