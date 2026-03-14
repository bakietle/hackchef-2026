'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const n = localStorage.getItem('userName')
    if (!n) router.push('/')
    else setName(n)
  }, [router])

  return (
    <div style={{ minHeight:'100vh', background:'#FDFAF4', padding:'24px 20px', fontFamily:'sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:2, color:'#8A7A60' }}>GOOD EVENING</div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'#1C1812' }}>{name} ✦</h1>
        </div>
        <div style={{ fontSize:40 }}>🧑‍🍳</div>
      </div>

      <div style={{ background:'#F7EDD8', border:'1.5px solid #D4A96A', padding:16, marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
        <span style={{ fontSize:28 }}>🧑‍🍳</span>
        <p style={{ fontSize:12, color:'#1C1812', lineHeight:1.6 }}>
          plan ur meals for the week so mama doesn't worry about you!
        </p>
      </div>

      <button
        onClick={() => router.push('/input')}
        style={{ width:'100%', padding:14, background:'#1C1812', color:'#D4A96A', border:'none', fontSize:14, letterSpacing:2, cursor:'pointer' }}>
        + PLAN THIS WEEK ✦
      </button>
    </div>
  )
}