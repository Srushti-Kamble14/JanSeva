"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { translations } from '@/utils/translations'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const { language, fetchProfile } = useApp()
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const t = translations[language] || translations.en

  const loginSchema = z.object({
    email: z.string().min(1, t.emailRequired).email(t.invalidEmail),
    password: z.string().min(6, t.passwordMin6),
    rememberMe: z.boolean().optional(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        {
          email: data.email,
          password: data.password,
        }
      )

      localStorage.setItem("accessToken", res.data.accessToken)
      localStorage.setItem("refreshToken", res.data.refreshToken)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      await fetchProfile()
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      setErrorMsg(error?.response?.data?.message || t.invalidCredentials)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 font-sans">
      <div className="w-full max-w-md bg-[#111111] border border-[rgba(212,160,23,0.18)] rounded-2xl p-5 sm:p-8 shadow-xl">
        <Link href="/" className="inline-block text-xs font-semibold text-[#A89060] hover:text-[#D4A017] transition-colors mb-6">
          {t.backToHome}
        </Link>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 leading-tight break-words">{t.welcomeBack}</h2>
        <p className="text-xs text-[#A89060] mb-6 break-words">{t.loginSubtitle}</p>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 font-semibold mb-6">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">{t.emailAddress}</label>
            <input
              className={`input ${errors.email ? 'border-red-400' : ''}`}
              type="email"
              placeholder={t.emailPlaceholder}
              {...register('email')}
            />
            {errors.email && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">{t.password}</label>
            <div className="relative">
              <input
                className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder={t.enterPassword}
                title={showPw ? t.hidePassword : t.showPassword}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base select-none cursor-pointer text-[#A89060] hover:text-[#D4A017]"
                onClick={() => setShowPw(s => !s)}
                title={showPw ? t.hidePassword : t.showPassword}
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#A89060] pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-[rgba(212,160,23,0.3)] accent-[#D4A017] cursor-pointer"
                {...register('rememberMe')}
              />
              {t.rememberMe}
            </label>
            <span className="hover:text-[#D4A017] cursor-pointer">{t.forgotPassword}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold !w-full !py-3 text-sm font-semibold tracking-wide mt-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? t.signingIn : t.signIn}
          </button>
        </form>

        <div className="flex items-center justify-between gap-3 my-6">
          <span className="flex-1 h-[0.5px] bg-[rgba(212,160,23,0.1)]" />
          <p className="text-center text-[10px] uppercase tracking-wider text-[#6B5A3A] font-bold break-words">{t.orContinueWith}</p>
          <span className="flex-1 h-[0.5px] bg-[rgba(212,160,23,0.1)]" />
        </div>

        <button 
        onClick={() => {
    window.location.href =
      `${BACKEND_URL}/api/users/google`;
  }}
        className="w-full min-h-11 flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white/[0.02] border border-[rgba(212,160,23,0.15)] hover:bg-[rgba(212,160,23,0.06)] hover:border-[rgba(212,160,23,0.35)] rounded-xl text-xs font-semibold text-[#F0E6C8] transition-all cursor-pointer shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" className="flex-shrink-0">
            <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.79-.15-1.18z" fill="#4285F4"/>
            <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/>
            <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"/>
            <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"/>
          </svg>
          {t.continueWithGoogle}
        </button>

        <p className="text-xs text-[#A89060] text-center mt-6">
          {t.dontHaveAccount} <Link href="/signup" className="text-[#D4A017] hover:underline font-semibold">{t.signUpFree}</Link>
        </p>
      </div>
    </div>
  )
}
