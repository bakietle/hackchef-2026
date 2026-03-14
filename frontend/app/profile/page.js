'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES, BADGES } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconProfile } from '@/components/Icons'
import NomsterLogo from '@/components/NomsterLogo'
import { MamaHappy } from '@/components/mama/MamaVariants'

export default function ProfilePage() {
  const router = useRouter()
  const { userName, weekMode, planDone, assigned, savedRecipes, reset, setUserName, setWeekMode } = usePlannerStore()
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const mode = (WEEK_MODES && WEEK_MODES.find(m => m.key === weekMode)) || WEEK_MODES[0]
  const totalMeals = mounted
    ? Object.values(assigned).reduce((s, d) => s + Object.values(d || {}).filter(Boolean).length, 0)
    : 0
  const totalDays = mounted
    ? Object.keys(assigned).filter(d => Object.values(assigned[d] || {}).some(Boolean)).length
    : 0

  const handleLogout = () => {
    reset()
    setUserName('')
    router.push('/')
  }

  if (!mounted) return <div style={{ minHeight:'100vh', background:'var(--cream)' }} />

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)' }}>
      {[
        { icon:<IconHome    size={22} color="var(--muted)" />, label:'home',    path:'/home',    active:false },
        { icon:<IconCalendar size={22} color="var(--muted)" />, label:'planner', path:'/planner', active:false },
        { icon:<IconCart    size={22} color="var(--muted)" />, label:'grocery', path:'/grocery', active:false },
        { icon:<IconProfile size={22} color="var(--navy)"  />, label:'profile', path:'/profile', active:true  },
      ].map(nav => (
        <button key={nav.label} onClick={() => router.push(nav.path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:nav.active ? 'var(--navy)':'var(--muted)', padding:'0 10px', opacity:nav.active ? 1:0.5 }}>
          {nav.icon}{nav.label}
          {nav.active && <div style={{ width:4, height:4, borderRadius:'50%', background:'var(--yellow)', marginTop:1 }} />}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <div style={{ height:5, background:'var(--yellow)', borderBottom:'2px solid var(--navy)' }} />

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <NomsterLogo size="sm" />
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>profile</div>
        </div>

        {/* Avatar + name */}
        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--yellow)', border:'3px solid var(--navy)', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Fraunces, serif', fontSize:28, fontWeight:900, color:'var(--navy)', boxShadow:'var(--shadow-md)' }}>
            {(userName || 'F')[0].toUpperCase()}
          </div>
          <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)', marginBottom:6 }}>
            {userName || 'Foodie'}
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--navy)', borderRadius:20, padding:'5px 14px' }}>
            <span style={{ fontSize:14 }}>{mode.emoji}</span>
            <span style={{ fontSize:11, fontWeight:800, color:mode.color }}>{mode.name} week</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:22 }}>
          {[
            { val:totalMeals, label:'meals\nplanned' },
            { val:totalDays,  label:'days\ncovered'  },
            { val:savedRecipes?.length || 0, label:'recipes\nsaved' },
          ].map(({ val, label }) => (
            <div key={label} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'14px 8px', textAlign:'center', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:24, fontWeight:900, color:'var(--navy)' }}>{val}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, whiteSpace:'pre-line', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Week mode */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>week mode</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:22 }}>
          {WEEK_MODES.map(m => (
            <button key={m.key} onClick={() => setWeekMode(m.key)} style={{ padding:'12px 14px', borderRadius:14, textAlign:'left', fontFamily:'Nunito, sans-serif', cursor:'pointer', border:`2px solid ${weekMode===m.key ? 'var(--navy)':'var(--border)'}`, background:weekMode===m.key ? m.light:'var(--white)', boxShadow:weekMode===m.key ? 'var(--shadow-sm)':'none', transition:'all .12s' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:18 }}>{m.emoji}</span>
                {weekMode===m.key && <div style={{ width:8, height:8, borderRadius:'50%', background:m.color, border:'1.5px solid var(--navy)' }} />}
              </div>
              <div style={{ fontSize:12, fontWeight:800, color:'var(--navy)' }}>{m.name}</div>
              <div style={{ fontSize:10, color:'var(--muted)', marginTop:1 }}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Badges */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>badges</div>
        <div style={{ display:'flex', gap:8, marginBottom:22, overflowX:'auto', paddingBottom:4 }}>
          {BADGES.map(b => (
            <div key={b.id} style={{ flexShrink:0, background:b.earned ? 'var(--yellow-l)':'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', textAlign:'center', minWidth:76, opacity:b.earned ? 1:0.4, boxShadow:b.earned ? 'var(--shadow-sm)':'none' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{b.emoji}</div>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', lineHeight:1.3 }}>{b.name}</div>
            </div>
          ))}
        </div>

        {planDone && (
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <MamaHappy size={60} />
            <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, marginTop:4 }}>week fully planned! 🎉</div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height:1, background:'var(--border)', marginBottom:20 }} />

        {/* Logout */}
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} style={{ width:'100%', padding:14, borderRadius:12, border:'2px solid var(--navy)', background:'var(--white)', color:'var(--navy)', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .15s' }}
            onMouseDown={e=>{ e.currentTarget.style.transform='translate(2px,3px)'; e.currentTarget.style.boxShadow='0 0 0 var(--navy)' }}
            onMouseUp={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H9" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            log out
          </button>
        ) : (
          <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'18px 16px', boxShadow:'var(--shadow-md)' }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:16, fontWeight:900, color:'var(--navy)', marginBottom:6 }}>log out?</div>
            <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, marginBottom:16, lineHeight:1.5 }}>
              ur meal plan will be cleared. mama will miss u 🥺
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex:1, padding:12, borderRadius:10, border:'2px solid var(--navy)', background:'var(--white)', color:'var(--navy)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)' }}>
                stay 💛
              </button>
              <button onClick={handleLogout} style={{ flex:1, padding:12, borderRadius:10, border:'2px solid var(--navy)', background:'var(--navy)', color:'var(--yellow)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)' }}>
                log out
              </button>
            </div>
          </div>
        )}

        <div style={{ height:16 }} />
      </div>

      <NavBar />
    </div>
  )
}