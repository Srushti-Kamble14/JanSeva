"use client"

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useApp } from '@/context/AppContext'
import { SCHEMES } from '@/utils/data'

// Zod Validation Schema for Scheme Application
const applySchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  state: z.string().min(1, 'Please select your state of residence'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number'),
  income: z.string().min(1, 'Please select your annual income group'),
  agree: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to verify your details' })
  })
})

export default function SchemeDetailPage({ params }) {
  const resolvedParams = use(params)
  const id = Number(resolvedParams.id)
  const { savedSchemes, toggleSave, user } = useApp()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  const scheme = SCHEMES.find(s => s.id === id)

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      state: user?.state || 'Maharashtra',
      aadhaar: '',
      income: user?.income || 'Below 2.5L',
      agree: false
    }
  })

  if (!scheme) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center font-sans">
        <h2 className="font-serif text-2xl font-bold mb-4 text-white">Scheme not found</h2>
        <Link href="/schemes" className="text-[#D4A017] hover:underline">
          ← Back to Schemes
        </Link>
      </div>
    )
  }

  const isSaved = savedSchemes.includes(scheme.id)

  const onSubmitForm = async (data) => {
    // Simulate API application submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Application submitted successfully:', data)
    setSuccessMsg(true)
    setTimeout(() => {
      setSuccessMsg(false)
      setModalOpen(false)
      reset()
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans">
      <button 
        className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-[#A89060] hover:text-[#D4A017] transition-colors cursor-pointer"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      {/* Header Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] mb-8 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(212,160,23,0.06)] flex items-center justify-center text-4xl flex-shrink-0">
          {scheme.icon}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2 leading-tight">{scheme.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {scheme.category.split('•').map(t => (
              <span key={t} className="px-2.5 py-1 rounded-md bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.12)] text-[10px] uppercase tracking-wider font-semibold text-[#A89060]">
                {t.trim()}
              </span>
            ))}
            <span className="px-2.5 py-1 rounded-md bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.12)] text-[10px] uppercase tracking-wider font-semibold text-[#A89060]">
              Deadline: {scheme.deadline}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/25 text-[10px] uppercase tracking-wider font-semibold text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-10 border-b border-[rgba(212,160,23,0.1)] pb-6">
        <button 
          onClick={() => setModalOpen(true)}
          className="btn-gold !py-2.5 !px-6 text-sm font-semibold cursor-pointer shadow-md"
        >
          Apply Now →
        </button>
        
        <button 
          onClick={() => toggleSave(scheme.id)}
          className={`btn-ghost !py-2.5 !px-5 text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
            isSaved ? 'text-[#F2C94C] border-[#D4A017] bg-[rgba(212,160,23,0.06)]' : ''
          }`}
        >
          {isSaved ? '⭐ Saved' : '☆ Save'}
        </button>
        
        <button className="btn-ghost !py-2.5 !px-5 text-sm font-medium cursor-pointer">
          🔗 Share
        </button>
        
        <Link href="/voice" className="btn-ghost !py-2.5 !px-5 text-sm font-medium">
          🔊 Listen
        </Link>
      </div>

      {/* Detailed Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-white border-b border-[rgba(212,160,23,0.08)] pb-2 mb-3">📋 Overview</h3>
            <p className="text-sm md:text-base text-[#A89060] leading-relaxed">{scheme.overview}</p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-white border-b border-[rgba(212,160,23,0.08)] pb-2 mb-3">✅ Eligibility Details</h3>
            <ul className="space-y-2.5">
              {scheme.eligibilityDetails.map((e, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#A89060] leading-relaxed">
                  <span className="text-[#D4A017] mt-0.5">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-white border-b border-[rgba(212,160,23,0.08)] pb-2 mb-3">📄 Required Documents</h3>
            <ul className="space-y-2.5">
              {scheme.documents.map((d, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#A89060] leading-relaxed">
                  <span className="text-[#D4A017] mt-0.5">▪</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-white border-b border-[rgba(212,160,23,0.08)] pb-2 mb-3">📝 Application Process</h3>
            <ol className="space-y-3">
              {scheme.process.map((p, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-[#A89060] leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.2)] flex items-center justify-center text-[10px] font-bold text-[#D4A017] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[rgba(212,160,23,0.15)] shadow-md">
            <h4 className="text-xs uppercase tracking-widest text-[#D4A017] font-semibold mb-2">Benefit</h4>
            <div className="font-serif text-2xl md:text-3xl font-bold text-[#F2C94C] leading-none mb-4">{scheme.benefit}</div>
            <p className="text-xs text-[#A89060] leading-relaxed border-t border-[rgba(212,160,23,0.06)] pt-3">
              Direct benefit transfer (DBT) to the Aadhaar-seeded bank account of verified candidates.
            </p>
          </div>
        </div>
      </div>

      {/* ── APPLICATION FORM DIALOG MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#111111] border border-[rgba(212,160,23,0.22)] rounded-2xl overflow-hidden shadow-2xl relative my-8">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(212,160,23,0.1)] bg-black/30">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Apply for Scheme</h3>
                <p className="text-xs text-[#A89060] truncate max-w-[320px]">{scheme.title}</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(212,160,23,0.05)] text-[#A89060] hover:bg-[rgba(212,160,23,0.2)] hover:text-[#D4A017] transition-colors text-base cursor-pointer"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center text-3xl text-green-400 mb-4 animate-bounce">
                  ✓
                </div>
                <h4 className="font-serif text-xl font-bold text-white mb-2">Application Submitted!</h4>
                <p className="text-sm text-[#A89060]">Your application reference ID has been generated. Tracking details sent to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      className={`input !py-2.5 ${errors.fullName ? 'border-red-400' : ''}`}
                      placeholder="Enter full name"
                      {...register('fullName')}
                    />
                    {errors.fullName && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Email address</label>
                    <input 
                      type="email" 
                      className={`input !py-2.5 ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="you@example.com"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Mobile Number</label>
                    <input 
                      type="text" 
                      className={`input !py-2.5 ${errors.phone ? 'border-red-400' : ''}`}
                      placeholder="9876543210"
                      {...register('phone')}
                    />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A89060] mb-1.5">State</label>
                    <select 
                      className={`input !py-2.5 ${errors.state ? 'border-red-400' : ''}`}
                      {...register('state')}
                    >
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                      <option>Karnataka</option>
                      <option>Punjab</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                    </select>
                    {errors.state && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Aadhaar Card Number</label>
                    <input 
                      type="text" 
                      className={`input !py-2.5 ${errors.aadhaar ? 'border-red-400' : ''}`}
                      placeholder="12-digit number"
                      {...register('aadhaar')}
                    />
                    {errors.aadhaar && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.aadhaar.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Annual Income Group</label>
                    <select 
                      className={`input !py-2.5 ${errors.income ? 'border-red-400' : ''}`}
                      {...register('income')}
                    >
                      <option value="Below 2.5L">Below ₹2.5 Lakh</option>
                      <option value="2.5L-5L">₹2.5L – ₹5L</option>
                      <option value="5L-10L">₹5L – ₹10L</option>
                      <option value="Above 10L">Above ₹10L</option>
                    </select>
                    {errors.income && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.income.message}</p>}
                  </div>
                </div>

                <div className="border-t border-[rgba(212,160,23,0.08)] pt-4 mt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#A89060] leading-relaxed">
                    <input 
                      type="checkbox" 
                      className="mt-0.5 rounded border-[rgba(212,160,23,0.3)] bg-black/40 accent-[#D4A017] cursor-pointer"
                      {...register('agree')}
                    />
                    <span>I declare that all information given above is true and correct to the best of my knowledge and I agree to retrieve verify records from government databases.</span>
                  </label>
                  {errors.agree && <p className="text-red-400 text-[10px] mt-1.5 font-medium">{errors.agree.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-gold !w-full !py-3 text-sm font-semibold tracking-wide mt-6 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying details...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
