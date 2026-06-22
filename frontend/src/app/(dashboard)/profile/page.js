"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { translations } from "@/utils/translations";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function ProfilePage() {
  const router = useRouter();
  const { user, savedSchemes, toggleSave, language, setLanguage, fetchProfile: refreshProfile } = useApp();
  const t = translations[language] || translations.en;
  const [savedStatus, setSavedStatus] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const profileSchema = z.object({
    name: z.string().min(3, t.fullNameMin),
    email: z.string().email(t.validEmailPrompt),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, t.validPhonePrompt)
      .or(z.literal("")),
    dob: z.string().optional(),
    language: z.string().min(1, t.languageRequired),
    category: z.string().min(1, t.categoryRequired),
    state: z.string().min(1, t.stateRequired),
    income: z.string().min(1, t.incomeRequired),
  });

  const fetchSavedSchemes = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/schemes`
    );

    const allSchemes =
      res.data.data.data.hits.items;

    const filtered = allSchemes.filter(
      (scheme) => savedSchemes.includes(scheme.id)
    );

    setSavedList(filtered);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchSavedSchemes();
}, [savedSchemes]);

  const initialName =
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "";

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
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
    },
  });

  const formValues = watch();
  useEffect(() => {
    if (!isSaving) {
      setSavedStatus(false);
    }
  }, [formValues]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(`${BACKEND_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = res.data.profile;

      reset({
        name: profile.user.fullName || "",
        email: profile.user.email || "",
        phone: profile.phone || "",
        dob: profile.dob
          ? new Date(profile.dob).toISOString().split("T")[0]
          : "",
        language: profile.preferredLanguage || "ENGLISH",
        category: profile.category || "STUDENT",
        state: profile.state || "MAHARASHTRA",
        income: profile.annualIncome || "",
      });

      setSavedStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Watch fields to detect form changes and mark as unsaved

  // Hydrate form on mount from backend API
  useEffect(() => {
    fetchProfile();
  }, []);

  

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      setErrorMsg("");

      const token = localStorage.getItem("accessToken");

      const incomeMap = {
        "Below 2.5L": 1,
        "2.5L-5L": 2,
        "5L-10L": 3,
        "Above 10L": 4,
      };

      const payload = {
        phone: data.phone,
        dob: data.dob,
        preferredLanguage: data.language.toUpperCase(),
        category: data.category.toUpperCase().replace(/\s+/g, "_"),
        state: data.state.toUpperCase().replace(/\s+/g, "_"),
       annualIncome: Number(data.income),
      };

      await axios.post(`${BACKEND_URL}/api/users/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshProfile();
      setSavedStatus(true);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || t.failedSaveProfile);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8 font-sans max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 sm:p-6 rounded-2xl bg-[#111111] border border-[rgba(212,160,23,0.18)] shadow-md">
        <div className="flex min-w-0 flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A017] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] font-bold text-xl flex-shrink-0 shadow-md">
            {(watch("name") || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white mb-1.5 break-words">
              {watch("name") || t.guestUser}
            </h2>
            <p className="text-xs text-[#A89060] mb-2 break-words">
              {watch("email")} · {watch("state")}
            </p>
            <span className="inline-flex max-w-full flex-wrap justify-center gap-1 px-3 py-1 rounded-full bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.15)] text-[10px] uppercase font-bold text-[#F2C94C] break-words">
              🎓 {watch("category")} · {watch("state")}
            </span>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          className={`btn-gold !min-h-11 !w-full sm:!w-auto !py-2.5 !px-6 text-sm font-semibold cursor-pointer shadow-md ${
            savedStatus ? "opacity-80" : ""
          }`}

          
        >
          {/* {savedStatus ? "Saved ✓" : "Save Changes"} */}
          {isSaving ? t.saving : savedStatus ? t.savedDone : t.saveChanges}
         
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-0 lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-sm space-y-4"
        >
          <h3 className="font-serif text-lg font-bold text-white mb-2 pb-2 border-b border-[rgba(212,160,23,0.08)] break-words">
            {t.personalInformation}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
                {t.fullName}
              </label>
              <input
                className={`input ${errors.name ? "border-red-400" : ""}`}
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-400 text-[10px] mt-1 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
                {t.emailAddress}
              </label>
              <input
                className={`input ${errors.email ? "border-red-400" : ""}`}
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-[10px] mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
                {t.phoneNumber}*
              </label>
              <input
                className={`input ${errors.phone ? "border-red-400" : ""}`}
                type="tel"
                placeholder={t.phonePlaceholder}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-400 text-[10px] mt-1 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
                {t.dateOfBirth}
              </label>
              <input className="input" type="date" {...register("dob")} />
            </div>
          </div>
        </form>

        {/* Right {t.preferences} column */}
        <div className="min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111111]/40 border border-[rgba(212,160,23,0.18)] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-white mb-2 pb-2 border-b border-[rgba(212,160,23,0.08)] break-words">
            {t.preferences}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
              {t.preferredLanguage}
            </label>
            <select className="input cursor-pointer" {...register("language")}>
              <option value="ENGLISH">{t.english}</option>
              <option value="HINDI">{t.hindi}</option>
              <option value="MARATHI">{t.marathi}</option>
              <option value="TAMIL">{t.tamil}</option>
              <option value="TELUGU">{t.telugu}</option>
              <option value="BENGALI">{t.bengali}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
              {t.category}
            </label>
            <select className="input cursor-pointer" {...register("category")}>
              <option value="STUDENT">{t.student}</option>
              <option value="FARMER">{t.farmer}</option>
              <option value="WOMEN">{t.categoryWomen}</option>
              <option value="SENIOR_CITIZEN">{t.seniorCitizen}</option>
              <option value="STARTUP_FOUNDER">{t.startupFounder}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
              {t.stateLabel}
            </label>
            <select className="input cursor-pointer" {...register("state")}>
              <option value="MAHARASHTRA">{t.maharashtra}</option>
              <option value="TAMIL_NADU">{t.tamilNadu}</option>
              <option value="KARNATAKA">{t.karnataka}</option>
              <option value="PUNJAB">{t.punjab}</option>
              <option value="GUJARAT">{t.gujarat}</option>
              <option value="RAJASTHAN">{t.rajasthan}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A89060] mb-1.5">
              {t.annualIncome}
            </label>
            <select className="input cursor-pointer" {...register("income")}>
              <option value="1">{t.incomeBelow}</option>
              <option value="2">{t.incomeMiddleLow}</option>
              <option value="3">{t.incomeMiddle}</option>
              <option value="4">{t.incomeAbove}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saved Schemes Section */}
      <div className="min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111111]/30 border border-[rgba(212,160,23,0.12)] shadow-sm">
        <h3 className="font-serif text-lg font-bold text-white mb-6 pb-2 border-b border-[rgba(212,160,23,0.08)] break-words">
          {t.savedSchemes}{" "}
          <span className="ml-1 px-2 py-0.5 rounded-full bg-[rgba(212,160,23,0.06)] text-xs text-[#D4A017]">
            {savedList.length}
          </span>
        </h3>

        {savedList.length === 0 ? (
          <p className="text-sm text-[#A89060] py-4 text-center">
            {t.noSavedSchemesProfile}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedList.map((s) => (
              <div
                key={s.id}
                className="min-w-0 p-4 sm:p-5 rounded-xl bg-[#111111] border border-[rgba(212,160,23,0.15)] flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(212,160,23,0.05)] flex items-center justify-center text-xl">
                     🛡️
                    </div>
                    <button
                      className="min-h-11 min-w-11 text-[#D4A017] text-lg active:scale-95 cursor-pointer"
                      onClick={() => toggleSave(s.id)}
                    >
                      ⭐
                    </button>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89060] mb-1 break-words">
                    {s.fields.level}
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-1.5 leading-snug break-words">
                    {s.fields.schemeName
}
                  </h4>
                  <p className="text-xs text-[#A89060] line-clamp-2 mb-4 leading-relaxed break-words">
                    {s.fields.briefDescription}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.03] pt-3">
                  <span className="min-w-0 text-[11px] text-[#6B5A3A] break-words">
                    👤 {s.eligibility}
                  </span>
                  <a
  href={`https://www.myscheme.gov.in/schemes/${s.fields.slug}`}
  target="_blank"
  rel="noopener noreferrer"
>
                    {t.viewDetails}</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
