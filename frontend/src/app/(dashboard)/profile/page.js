"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useApp } from "@/context/AppContext"
import { SCHEMES, LANGUAGES } from "@/utils/data"

// Profile Form Validation Schema
const profileSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number').or(z.literal('')),
  dob: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  category: z.string().min(1, 'Category is required'),
  state: z.string().min(1, 'State is required'),
  income: z.string().min(1, 'Income is required'),
})

export default function ProfilePage() {
  const router = useRouter()
  const { user, savedSchemes, toggleSave, language, setLanguage } = useApp()
  const [savedStatus, setSavedStatus] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const initialName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || ""

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      email: user?.email || "",
      phone: user?.phone || "",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      category: user?.category || "Student",
      state: user?.state || "Maharashtra",
      income: user?.income || "Below 2.5L",
      language: user?.language || language,
    }
  })

  // Watch fields to detect form changes and mark as unsaved
  const formValues = watch()
  useEffect(() => {
    setSavedStatus(false)
  }, [formValues])

  // Hydrate form on mount from backend API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await axios.get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })

        const userData = res.data?.data?.user
        if (!userData) return

        const profileName = userData.name || [userData.firstName, userData.lastName].filter(Boolean).join(" ")
        
        reset({
          name: profileName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          dob: userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : "",
          category: userData.category || "Student",
          state: userData.state || "Maharashtra",
          income: userData.annualIncome || "Below 2.5L",
          language: userData.prefLang || userData.preferredLangauge || language,
        })
        setSavedStatus(true)
      } catch (error) {
        console.error("Failed to load profile:", error)
      }
    }

    fetchProfile()
  }, [reset, language])

  const savedList = SCHEMES.filter(s => savedSchemes.includes(s.id))

  const onSubmit = async (data) => {
    setErrorMsg('')
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please login first")
        router.push("/login")
        return
      }

      const payload = {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        prefLang: data.language,
        category: data.category,
        state: data.state,
        annualIncome: data.income,
      }

      await axios.put("http://localhost:3000/api/users/profile", payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Sync local preferences
      setLanguage(data.language)
      setSavedStatus(true)
      alert("Profile saved successfully!")
    } catch (error) {
      console.error(error)
      setErrorMsg(error?.response?.data?.message || "Profile update failed")
    }
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A017] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] font-bold text-xl flex-shrink-0 shadow-md">
            {(watch('name') || "A")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white mb-1.5">{watch('name') || "User"}</h2>
            <p className="text-xs text-[#A89060] mb-2">{watch('email')} · {watch('state')}</p>
            <span className="px-3 py-1 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.15)] text-[10px] uppercase font-bold text-[#F2C94C]">
              🎓 {watch('category')} · {watch('state')}
            </span>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          className={`btn-gold !py-2.5 !px-6 text-sm font-semibold cursor-pointer shadow-md ${
            savedStatus ? 'opacity-80' : ''
          }`}
        >
          {savedStatus ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 font-semibold mb-6">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Grid containing form input fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Forms column */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-white mb-2 pb-2 border-b border-[rgba(212,160,23,0.08)]">Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Full Name</label>
              <input
                className={`input ${errors.name ? 'border-red-400' : ''}`}
                type="text"
                {...register('name')}
              />
              {errors.name && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Email address</label>
              <input
                className={`input ${errors.email ? 'border-red-400' : ''}`}
                type="email"
                {...register('email')}
              />
              {errors.email && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Phone Number</label>
              <input
                className={`input ${errors.phone ? 'border-red-400' : ''}`}
                type="tel"
                placeholder="+91 XXXXXXXXXX"
                {...register('phone')}
              />
              {errors.phone && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Date of Birth</label>
              <input
                className="input"
                type="date"
                {...register('dob')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold !py-2.5 !px-6 text-sm font-semibold cursor-pointer shadow-md mt-6"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Right Preferences column */}
        <div className="p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-white mb-2 pb-2 border-b border-[rgba(212,160,23,0.08)]">Preferences</h3>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Preferred Language</label>
            <select
              className="input cursor-pointer"
              {...register('language')}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.name}>
                  {l.name} — {l.native}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Category</label>
            <select
              className="input cursor-pointer"
              {...register('category')}
            >
              <option>Student</option>
              <option>Farmer</option>
              <option>Women</option>
              <option>Senior citizen</option>
              <option>Startup founder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">State</label>
            <select
              className="input cursor-pointer"
              {...register('state')}
            >
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
              <option>Karnataka</option>
              <option>Punjab</option>
              <option>Gujarat</option>
              <option>Rajasthan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">Annual Income</label>
            <select
              className="input cursor-pointer"
              {...register('income')}
            >
              <option value="Below 2.5L">Below ₹2.5 Lakh</option>
              <option value="2.5L-5L">₹2.5L – ₹5L</option>
              <option value="5L-10L">₹5L – ₹10L</option>
              <option value="Above 10L">Above ₹10L</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saved Schemes Section */}
      <div className="p-6 rounded-2xl bg-[#111111]/30 border border-[rgba(212,160,23,0.12)] shadow-sm">
        <h3 className="font-serif text-lg font-bold text-white mb-6 pb-2 border-b border-[rgba(212,160,23,0.08)]">
          Saved Schemes <span className="ml-1 px-2 py-0.5 rounded-full bg-[rgba(212,160,23,0.06)] text-xs text-[#D4A017]">{savedList.length}</span>
        </h3>

        {savedList.length === 0 ? (
          <p className="text-sm text-[#A89060] py-4 text-center">No saved schemes yet. Browse schemes to save them.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedList.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-xl bg-[#111111] border border-[rgba(212,160,23,0.15)] flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(212,160,23,0.05)] flex items-center justify-center text-xl">
                      {s.icon}
                    </div>
                    <button
                      className="text-[#D4A017] text-lg active:scale-95 cursor-pointer"
                      onClick={() => toggleSave(s.id)}
                    >
                      ⭐
                    </button>
                  </div>
                  
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-1">{s.category}</div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-1.5 leading-snug">{s.title}</h4>
                  <p className="text-xs text-[#A89060] line-clamp-2 mb-4 leading-relaxed">{s.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                  <span className="text-[11px] text-[#6B5A3A]">👤 {s.eligibility}</span>
                  <Link href={`/schemes/${s.id}`} className="text-[11px] font-semibold text-[#D4A017] hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
