'use client'
import NomsterLogo from '@/components/NomsterLogo'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES, BADGES, RECIPES } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconCheck } from '@/components/Icons'
import { MamaIdle, MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import MamaIdleFull from '@/components/mama/MamaIdle'

const DIETARY_OPTIONS = ['No restrictions','Vegetarian','Vegan','Halal','Gluten-free','Dairy-free','Nut-free']

export default function ProfilePage() {
  const router = useRouter()
  const {
    userName, weekMode, setWeekMode,
    savedRecipes, assigned, stats,
    dietary, setDietary,
    clearWeek,
  } = usePlannerStore()

  const mode            = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const totalMeals      = Object.values(assigned).reduce((a,d) => a + Object.keys(d||{}).length, 0)
  const weeksPlanned    = stats?.weeksPlanned || 0
  const cuisinesTried   = [...new Set(
    Object.values(assigned).flatMap(d =>
      Object.values(d||{}).map(r => r?.cuisine).filter(Boolean)
    )
  )]
  const totalSaved      = savedRecipes.length
  const [editName,      setEditName]      = useState(false)
  const [nameInput,     setNameInput]     = useState(userName || '')
  const [confirmClear,  setConfirmClear]  = useState(false)
  const { setUserName } = usePlannerStore()

  const toggleDietary = (d) => {
    if (d === 'No restrictions') { setDietary(['No restrictions']); return }
    const without = (dietary||[]).filter(x => x !== 'No restrictions')
    setDietary(without.includes(d) ? without.filter(x=>x!==d) : [...without, d])
  }

  const earnedBadges = BADGES.filter(b => {
    if (b.id==='protein-hero')  return totalMeals >= 3
    if (b.id==='veggie-queen')  return cuisinesTried.length >= 2
    if (b.id==='meal-planner')  return Object.keys(assigned).length >= 7
    if (b.id==='early-bird')    return Object.values(assigned).filter(d=>d?.breakfast).length >= 3
    if (b.id==='budget-king')   return totalMeals >= 5
    if (b.id==='world-tour')    return cuisinesTried.length >= 5
    return false
  })

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { icon:<IconHome size={22} />,     label:'home',    path:'/home'    },
        { icon:<IconCalendar size={22} />, label:'planner', path:'/planner' },
        { icon:<IconCart size={22} />,     label:'grocery', path:'/grocery' },
        { icon:<IconHeart size={22} />,    label:'saved',   path:'/saved'   },
        { icon:<IconProfile size={22} />,  label:'profile', path:'/profile', active:true },
      ].map(nav => (
        <button key={nav.label} onClick={() => router.push(nav.path)}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:nav.active?'var(--navy)':'var(--muted)', padding:'0 8px', opacity:nav.active?1:0.45 }}>
          {nav.icon}{nav.label}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <NotifBanner />
      <div style={{ height:4, background:mode.color }} />

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* Logo row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>my profile</h2>
          <NomsterLogo size="sm" animate/>
        </div>

        {/* ── PROFILE HEADER ── */}
        <div style={{ background:'var(--navy)', border:'2px solid var(--navy)', borderRadius:20, padding:20, marginBottom:14, boxShadow:'var(--shadow-md)', display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ flexShrink:0 }}>
            <MamaIdleFull size={72} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            {editName ? (
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <input value={nameInput} onChange={e=>setNameInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'){setUserName(nameInput.trim()||userName);setEditName(false)} }}
                  style={{ flex:1, background:'rgba(255,255,255,.1)', border:'2px solid var(--yellow)', borderRadius:8, padding:'6px 10px', fontSize:14, fontFamily:'Nunito, sans-serif', fontWeight:700, color:'#fff', outline:'none' }}
                  autoFocus
                />
                <button onClick={() => { setUserName(nameInput.trim()||userName); setEditName(false) }}
                  style={{ padding:'6px 10px', borderRadius:8, border:'none', background:'var(--yellow)', color:'var(--navy)', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>save</button>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'#fff' }}>{userName || 'Foodie'}</div>
                <button onClick={() => setEditName(true)} style={{ background:'rgba(255,255,255,.1)', border:'1.5px solid rgba(255,255,255,.2)', borderRadius:6, padding:'3px 8px', color:'rgba(255,255,255,.6)', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>edit</button>
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:14, height:14, borderRadius:4, background:mode.color, border:'1.5px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8 }}>{mode.emoji}</div>
              <span style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:600 }}>{mode.name} mode</span>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            ['🍽️', totalMeals,         'meals planned'],
            ['🌏', cuisinesTried.length,'cuisines tried'],
            ['💛', totalSaved,          'saved recipes'],
            ['📅', Object.keys(assigned).filter(d=>Object.keys(assigned[d]||{}).length>0).length, 'days planned'],
          ].map(([emoji, val, label]) => (
            <div key={label} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'14px 12px', textAlign:'center', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{emoji}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:26, fontWeight:900, color:'var(--navy)' }}>{val}</div>
              <div style={{ fontSize:10, color:'var(--muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── WEEK MODE ── */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>week mode</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {WEEK_MODES.map(m => (
              <button key={m.key} onClick={() => setWeekMode(m.key)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:weekMode===m.key?`${m.color}25`:'var(--white)', border:`2px solid ${weekMode===m.key?'var(--navy)':'var(--border)'}`, borderRadius:14, cursor:'pointer', transition:'all .15s', boxShadow:weekMode===m.key?'var(--shadow-sm)':'none', textAlign:'left' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:m.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{m.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)' }}>{m.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{m.desc}</div>
                </div>
                {weekMode===m.key && (
                  <div style={{ width:22, height:22, borderRadius:'50%', background:m.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <IconCheck size={11} color="var(--navy)" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── DIETARY ── */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>dietary preferences</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {DIETARY_OPTIONS.map(d => {
              const active = (dietary||[]).includes(d) || ((!dietary||dietary.length===0) && d==='No restrictions')
              return (
                <button key={d} onClick={() => toggleDietary(d)} style={{
                  padding:'7px 13px', borderRadius:20, fontSize:12, fontWeight:700,
                  fontFamily:'Nunito, sans-serif', cursor:'pointer',
                  border:`2px solid ${active?'var(--navy)':'var(--border)'}`,
                  background:active?'var(--mint-l)':'var(--white)',
                  color:active?'var(--navy)':'var(--muted)',
                  boxShadow:active?'var(--shadow-sm)':'none',
                }}>{d}</button>
              )
            })}
          </div>
        </div>

        {/* ── BADGES ── */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>
            weekly badges <span style={{ color:'var(--yellow)' }}>({earnedBadges.length}/{BADGES.length})</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {BADGES.map(b => {
              const earned = earnedBadges.find(e => e.id===b.id)
              return (
                <div key={b.id} style={{ background: earned ? `${b.color}20` : 'var(--white)', border:`2px solid ${earned?'var(--navy)':'var(--border)'}`, borderRadius:14, padding:'12px 10px', display:'flex', gap:10, alignItems:'center', opacity:earned?1:0.45, transition:'all .15s' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:earned?b.color:'var(--paper)', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, filter:earned?'none':'grayscale(1)' }}>{b.icon}</div>
                  <div>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:800, color:'var(--navy)' }}>{b.name}</div>
                    <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{b.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── DANGER ZONE ── */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>settings</div>
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)}
              style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--coral)', background:'var(--coral-l)', color:'var(--coral)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
              🗑️ clear this week's plan
            </button>
          ) : (
            <div style={{ background:'var(--coral-l)', border:'2px solid var(--coral)', borderRadius:12, padding:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:10 }}>are u sure? this can't be undone 😬</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { clearWeek(); setConfirmClear(false) }}
                  style={{ flex:1, padding:11, borderRadius:10, border:'2px solid var(--coral)', background:'var(--coral)', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
                  yes, clear it
                </button>
                <button onClick={() => setConfirmClear(false)}
                  style={{ flex:1, padding:11, borderRadius:10, border:'2px solid var(--navy)', background:'var(--white)', color:'var(--navy)', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
                  never mind
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mama */}
        <div style={{ textAlign:'center', padding:'8px 0 4px' }}>
          <MamaHappy size={64} />
          <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--navy)', marginTop:6 }}>
            keep it up! mama believes in u 💕
          </div>
        </div>

        <div style={{ height:20 }} />
      </div>

      <NavBar />
    </div>
  )
}
