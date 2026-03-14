'use client'
import { useRouter } from 'next/navigation'

export default function InputPage() {
  const router = useRouter()
  return (
    <div style={{ minHeight:'100vh', background:'#FDFAF4', padding:'24px 20px', fontFamily:'sans-serif' }}>
      <button onClick={() => router.push('/home')} style={{ marginBottom:20, padding:'8px 16px', background:'transparent', border:'1.5px solid #D8D0C0', cursor:'pointer', fontSize:12, letterSpacing:1 }}>← BACK</button>
      <h2 style={{ fontSize:22, fontWeight:900, letterSpacing:2, marginBottom:20 }}>TELL MAMA WHAT U GOT</h2>
      <p style={{ color:'#8A7A60', marginBottom:24 }}>Input screen — coming soon!</p>
      <button onClick={() => router.push('/waiting')} style={{ width:'100%', padding:14, background:'#1C1812', color:'#D4A96A', border:'none', fontSize:14, letterSpacing:2, cursor:'pointer' }}>
        COOK SOMETHING UP →
      </button>
    </div>
  )
}