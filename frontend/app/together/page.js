'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES } from '@/lib/data'
import { MamaHappy } from '@/components/mama/MamaVariants'
import NomsterLogo from '@/components/NomsterLogo'

export default function TogetherComingSoon() {
  const router = useRouter()
  const { weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const [notified, setNotified] = useState(false)

  return (
    <div style={{ minHeight:'100vh', background:'var(--navy)', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>

      {/* Background circles */}
      <div style={{ position:'absolute', top:-80, right:-80, width:280, height:280, borderRadius:'50%', background:'rgba(245,200,66,0.06)', border:'2px solid rgba(245,200,66,0.08)' }}/>
      <div style={{ position:'absolute', bottom:-100, left:-60, width:320, height:320, borderRadius:'50%', background:'rgba(126,216,164,0.05)', border:'2px solid rgba(126,216,164,0.07)' }}/>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1.5px solid rgba(255,255,255,0.1)', position:'relative' }}>
        <button onClick={() => router.push('/home')}
          style={{ padding:'8px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.2)', background:'transparent', color:'rgba(255,255,255,0.7)', fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          ← home
        </button>
        <NomsterLogo size="sm" dark animate={false}/>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 28px', textAlign:'center', position:'relative' }}>

        {/* Coming soon badge */}
        <div style={{ background:'rgba(245,200,66,0.15)', border:'2px solid var(--yellow)', borderRadius:20, padding:'5px 16px', marginBottom:20, display:'inline-block' }}>
          <span style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:900, color:'var(--yellow)', letterSpacing:2 }}>COMING SOON</span>
        </div>

        {/* Emoji illustration */}
        <div style={{ fontSize:72, marginBottom:10, animation:'mamaFloat 3s ease-in-out infinite' }}>👯</div>

        {/* Headline */}
        <h1 style={{ fontFamily:'Fraunces, serif', fontSize:32, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:10, letterSpacing:'-0.5px' }}>
          cook together
        </h1>

        <p style={{ fontFamily:'Nunito, sans-serif', fontSize:15, fontWeight:700, color:'rgba(245,200,66,0.85)', marginBottom:8 }}>
          shared meal plans for housemates
        </p>

        <p style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:32, lineHeight:1.65, maxWidth:280 }}>
          one plan, split grocery costs automatically, less effort — more variety for everyone in the house
        </p>

        {/* Feature preview cards */}
        <div style={{ width:'100%', maxWidth:320, display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
          {[
            ['👥', 'Invite ur housemates',          'share a link, they join instantly'],
            ['💰', 'Auto split grocery costs',      'mama calculates who pays what'],
            ['📅', 'One shared meal plan',           'each person cooks 1-2 meals'],
            ['🤝', 'Less waste, more variety',      'pool ingredients, save money'],
          ].map(([ico,title,sub]) => (
            <div key={title} style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'12px 14px', display:'flex', gap:12, alignItems:'center', textAlign:'left' }}>
              <div style={{ width:40, height:40, borderRadius:11, background:'rgba(245,200,66,0.15)', border:'1.5px solid rgba(245,200,66,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{ico}</div>
              <div>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'#fff', marginBottom:2 }}>{title}</div>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notify me button */}
        {!notified ? (
          <button onClick={() => setNotified(true)}
            style={{ width:'100%', maxWidth:320, padding:15, borderRadius:12, border:'2px solid var(--yellow)', background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', marginBottom:10 }}
            onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
            onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
            🔔 notify me when it's live
          </button>
        ) : (
          <div style={{ width:'100%', maxWidth:320, padding:15, borderRadius:12, border:'2px solid var(--mint)', background:'rgba(126,216,164,0.15)', marginBottom:10, textAlign:'center' }}>
            <MamaHappy size={48}/>
            <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--mint)', marginTop:6 }}>
              ✓ mama will let u know when it drops! 💕
            </div>
          </div>
        )}

        <button onClick={() => router.push('/home')}
          style={{ background:'transparent', border:'none', cursor:'pointer', fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.35)', padding:'8px 0' }}>
          back to home
        </button>

      </div>
    </div>
  )
}
