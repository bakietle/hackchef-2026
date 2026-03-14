'use client'
import { useState, useEffect } from 'react'
import MamaShocked from './mama/MamaShocked'
 
const MESSAGES = [
  'are u eating instant noodles AGAIN 😤 mama is NOT okay with this',
  "it's dinner time bestie~ go cook something real pls 🍳",
  "ur lunch slot is empty... the fridge isn't gonna cook itself babes",
  'no cap eating cereal for every meal is NOT it. mama made u a plan 💅',
  'did u actually cook today or are we lying to ourselves rn 👀',
  "it's been 2 days. the veggies are literally crying in ur fridge",
  "gentle reminder~ ur meal plan is all set. don't let mama down! 💕",
  "it's 11pm and no dinner?? mama is concerned fr fr 🌙",
  'bestie ur protein intake today was ZERO. beast mode requires effort 💪',
  'mama tracked ur meals and ur literally surviving on vibes rn 😭',
]
 
export default function NotifBanner() {
  const [visible, setVisible] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
 
  const show = () => {
    setMsgIdx(i => (i + 1) % MESSAGES.length)
    setVisible(true)
    setTimeout(() => setVisible(false), 5000)
  }
 
  useEffect(() => {
    // Auto-trigger at intervals
    const timers = [8000, 25000, 50000].map(t => setTimeout(show, t))
    return () => timers.forEach(clearTimeout)
  }, [])
 
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(255,246,241,0.96)', backdropFilter: 'blur(16px)',
      borderRadius: '0 0 24px 24px',
      boxShadow: '0 8px 32px rgba(0,0,0,.1)',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.4s cubic-bezier(.34,1.1,.64,1)',
      display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 14px'
    }}>
      <MamaShocked size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--peach)',
          textTransform: 'uppercase', letterSpacing: '.5px' }}>HackChef 🍳</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)',
          lineHeight: 1.4, marginTop: 1 }}>
          {MESSAGES[msgIdx]}
        </div>
      </div>
      <button onClick={() => setVisible(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 16, color: 'var(--muted)' }}>✕</button>
    </div>
  )
}
