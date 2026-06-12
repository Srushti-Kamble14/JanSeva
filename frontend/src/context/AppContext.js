"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
const AppContext = createContext(null)


export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('English')
  const [user, setUser] = useState(null)
  const [savedSchemes, setSavedSchemes] = useState([])


  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const res = await axios.get(
      "http://localhost:5000/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUser({
      fullName: res.data.profile.user.fullName,
      email: res.data.profile.user.email,
    });

  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
  const saved = localStorage.getItem("savedSchemes");

if (saved) {
  const parsed = JSON.parse(saved);

  const cleaned = parsed.filter(
    id => typeof id === "string"
  );

  setSavedSchemes(cleaned);

  localStorage.setItem(
    "savedSchemes",
    JSON.stringify(cleaned)
  );
}

  fetchProfile()
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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  console.log("savedSchemes:", savedSchemes);
console.log("count:", savedSchemes.length);
  return (
  <AppContext.Provider value={{
  theme,
  toggleTheme,
  language,
  setLanguage,
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
