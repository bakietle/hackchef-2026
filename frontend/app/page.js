'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MamaIdle from '@/components/mama/MamaIdle'
import { usePlannerStore } from '@/lib/plannerStore'
import NomsterLogo from '@/components/NomsterLogo'

export default function WelcomePage() {
  const router = useRouter()
  const setUserName = usePlannerStore(s => s.setUserName)
  const [name, setName] = useState('')

  const go = () => { setUserName(name.trim() || 'Foodie'); router.push('/home') }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      <div style={{ height:5, background:'var(--yellow)', borderBottom:'2px solid var(--navy)' }}/>

      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 24px', borderBottom:'1.5px solid var(--border)' }}>
        <NomsterLogo size="md" animate/>
        <div style={{ background:'var(--navy)', color:'var(--yellow)', padding:'4px 12px', borderRadius:20, fontSize:10, fontWeight:800, letterSpacing:1, fontFamily:'Nunito, sans-serif' }}>UNIHACK 2026</div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 28px 32px', textAlign:'center' }}>

        <div className="mama-float" style={{ marginBottom:4 }}>
          <MamaIdle size={130}/>
        </div>

        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:'16px 16px 16px 4px', padding:'11px 16px', maxWidth:210, margin:'4px auto 24px', lineHeight:1.65, fontSize:12, fontWeight:700, color:'var(--navy)', boxShadow:'var(--shadow-sm)' }}>
          hi! i'm mama — let me sort out your meals for the week 🥄
        </div>

        <h1 style={{ fontFamily:'Fraunces, serif', fontSize:34, fontWeight:900, color:'var(--navy)', lineHeight:1.1, marginBottom:8, letterSpacing:'-0.5px' }}>
          Your AI<br/>
          <span style={{ color:'var(--yellow)', WebkitTextStroke:'1.5px var(--navy)' }}>meal mama</span>
        </h1>

        <p style={{ fontSize:13, color:'var(--muted)', fontWeight:600, marginBottom:24, lineHeight:1.5 }}>
          Plan your week · Save money · Eat well
        </p>

        <div style={{ display:'flex', gap:7, marginBottom:28, flexWrap:'wrap', justifyContent:'center' }}>
          {[['🧑‍🎓','Student friendly'],['🌏','Multicultural'],['⚡','AI-powered']].map(([ico,label]) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:5, background:'var(--yellow-l)', border:'1.5px solid var(--navy)', borderRadius:20, padding:'5px 12px', fontSize:11, fontWeight:700, color:'var(--navy)' }}>
              {ico} {label}
            </div>
          ))}
        </div>

        <div style={{ width:'100%', maxWidth:340, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:20, padding:'20px 18px', boxShadow:'var(--shadow-md)' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10, textAlign:'left' }}>
            What should mama call you?
          </div>
          <input
            style={{ width:'100%', background:'var(--paper)', border:'2px solid var(--border)', borderRadius:12, padding:'13px 14px', fontSize:15, fontFamily:'Nunito, sans-serif', outline:'none', fontWeight:700, color:'var(--navy)', marginBottom:12, transition:'border-color .2s' }}
            placeholder="e.g. Alex"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={e  => e.target.style.borderColor='var(--navy)'}
            onBlur={e   => e.target.style.borderColor='var(--border)'}
            onKeyDown={e => e.key==='Enter' && go()}
            autoFocus
          />
          <button onClick={go} className="retro-btn"
            style={{ width:'100%', padding:14, background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, boxShadow:'var(--shadow-md)' }}
            onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
            onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
            Let's get cooking 🍽️
          </button>
        </div>
      </div>

      <div style={{ textAlign:'center', padding:'12px 20px 20px', borderTop:'1.5px solid var(--border)', fontSize:11, color:'var(--muted)', fontWeight:600 }}>
        Made with 💛 - by LAWA 
      </div>
    </div>
  )
}
