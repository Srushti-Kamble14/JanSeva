"use client"

import { createContext, useCallback, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { SUPPORTED_LANGUAGES } from '@/utils/translations'
const AppContext = createContext(null)
const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((item) => item.code)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL


export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')
  const [user, setUser] = useState(null)
  const [savedSchemes, setSavedSchemes] = useState([])



  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const res = await axios.get(
      `${BACKEND_URL}/api/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const profile = res.data.profile;

    setUser({
      ...profile,
      ...profile.user,
      fullName: profile.user?.fullName || "",
      email: profile.user?.email || "",
      phone: profile.phone || "",
      dob: profile.dob || "",
      preferredLanguage: profile.preferredLanguage || "",
      category: profile.category || "",
      state: profile.state || "",
      annualIncome: profile.annualIncome || "",
    });

  } catch (error) {
    console.log(error);
  }
};

const changeLanguage = useCallback((nextLanguage) => {
  const languageCode = SUPPORTED_LANGUAGE_CODES.includes(nextLanguage)
    ? nextLanguage
    : "en";

  setLanguage(languageCode);
  localStorage.setItem("language", languageCode);
}, []);

useEffect(() => {
  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage && SUPPORTED_LANGUAGE_CODES.includes(savedLanguage)) {
    queueMicrotask(() => setLanguage(savedLanguage));
  }
}, []);

  useEffect(() => {
  const saved = localStorage.getItem("savedSchemes");

if (saved) {
  const parsed = JSON.parse(saved);

  const cleaned = parsed.filter(
    id => typeof id === "string"
  );

  queueMicrotask(() => setSavedSchemes(cleaned));

  localStorage.setItem(
    "savedSchemes",
    JSON.stringify(cleaned)
  );
}

  queueMicrotask(() => fetchProfile())
}, [])

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

 const toggleSave = (id) => {
  const updated = savedSchemes.includes(id)
    ? savedSchemes.filter(s => s !== id)
    : [...savedSchemes, id];

  setSavedSchemes(updated);

  localStorage.setItem(
    "savedSchemes",
    JSON.stringify(updated)
  );
};

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
  <AppContext.Provider value={{
  theme,
  toggleTheme,
  language,
  setLanguage: changeLanguage,
  user,
  setUser,
  fetchProfile,
  login,
  logout,
  savedSchemes,
  toggleSave,
}}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
