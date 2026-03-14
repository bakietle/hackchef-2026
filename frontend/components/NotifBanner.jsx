'use client'
import { useState, useEffect, useRef } from 'react'
import { MamaShocked } from './mama/MamaVariants'
import { NOTIF_MSGS } from '@/lib/data'

export default function NotifBanner() {
  const [visible, setVisible] = useState(false)
  const [idx, setIdx] = useState(0)
  const ref = useRef(null)

  const show = (i) => {
    setIdx(i % NOTIF_MSGS.length); setVisible(true)
    clearTimeout(ref.current); ref.current = setTimeout(() => setVisible(false), 5000)
  }
  useEffect(() => {
    const ts = [9000,32000,65000].map((t,i) => setTimeout(() => show(i), t))
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, zIndex:300,
      background:'rgba(254,249,238,0.97)', backdropFilter:'blur(12px)',
      borderBottom:'2px solid var(--navy)',
      transform:visible ? 'translateY(0)' : 'translateY(-110%)',
      transition:'transform .38s cubic-bezier(.34,1.1,.64,1)',
      display:'flex', alignItems:'center', gap:10, padding:'14px 16px 12px',
    }}>
      <MamaShocked size={36} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'var(--yellow2)', textTransform:'uppercase', letterSpacing:1 }}>HackChef Alert</div>
        <div style={{ fontSize:12, fontWeight:600, color:'var(--navy)', lineHeight:1.4, marginTop:1 }}>{NOTIF_MSGS[idx]}</div>
      </div>
      <button onClick={() => setVisible(false)} style={{ background:'var(--navy)', border:'none', cursor:'pointer', width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
    </div>
  )
}
