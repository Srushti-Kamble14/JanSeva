"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
const AppContext = createContext(null)


export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('English')
  const [user, setUser] = useState(null)
  const [savedSchemes, setSavedSchemes] = useState([1, 3])


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
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    setTheme(savedTheme)
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
    setSavedSchemes(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

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
