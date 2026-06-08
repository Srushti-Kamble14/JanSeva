import { useState, useRef } from 'react'

const BOT_RESPONSES = [
  {
    text: 'I found several schemes that match your query! Here\'s the most relevant one:',
    card: { title: 'PM Scholarship Scheme 2025', desc: '₹2,500–₹3,000/month for eligible students. Apply before June 30, 2026.', link: 'View on ksb.gov.in' }
  },
  {
    text: 'Great question! Based on your profile, here are the best matching schemes:',
    card: { title: 'PM Kisan Samman Nidhi', desc: '₹6,000 per year directly to farmers. All farmers with cultivable land are eligible.', link: 'View details' }
  },
  {
    text: 'Here\'s what I found for you. There are 8 schemes matching your query:',
    card: { title: 'Ayushman Bharat PM-JAY', desc: '₹5 lakh/year health insurance for BPL families. Free hospitalization at 25,000+ hospitals.', link: 'Check eligibility' }
  },
]

export function useChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Namaste! 🙏 I\'m JanSeva AI, your personal guide to government schemes. I can help you find scholarships, farmer schemes, healthcare benefits, startup funding and much more.\n\nWhat are you looking for today?' }
  ])
  const [typing, setTyping] = useState(false)
  const idRef = useRef(2)

  const send = (text) => {
    const userMsg = { id: idRef.current++, role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    setTimeout(() => {
      const r = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)]
      const botMsg = { id: idRef.current++, role: 'bot', text: r.text, card: r.card }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
    }, 1400)
  }

  const clear = () => {
    setMessages([{ id: 1, role: 'bot', text: 'Namaste! 🙏 How can I help you today?' }])
  }

  return { messages, typing, send, clear }
}
