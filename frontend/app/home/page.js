'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { MamaMini } from '@/components/mama/MamaVariants'
import { MamaHappy } from '@/components/mama/MamaVariants'
import { IconHome, IconCalendar, IconCart, IconProfile, IconBell, IconPlus } from '@/components/Icons'
import NotifBanner from '@/components/NotifBanner'
import { DAYS, SHORT_DAYS, SLOTS, WEEK_MODES, BADGES } from '@/lib/data'

const GREETINGS = [
  (n,m) => `Time to cook up some fun this week, ${n}! 🍳`,
  (n,m) => `Let's plan a tasty week, ${n}!`,
  (n,m) => `What are we eating this week, ${n}? 🤔`,
  (n,m) => `Mama's ready to plan some bangers, ${n}!`,
]
const MOODS = ['😩','😐','🙂','😄','🔥']

export default function HomePage() {
  const router = useRouter()
  const { userName, assigned, planDone, weekMode, setWeekMode, moodLog, setMood } = usePlannerStore()
  const [greeting, setGreeting] = useState('')
  const [toast, setToast] = useState({ msg:'', visible:false })
  const [dayPopup, setDayPopup] = useState(null)
  const [showModeSelect, setShowModeSelect] = useState(false)

  const mode = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]
  const today = DAYS[0]
  const todayIdx = 0

  useEffect(() => {
    const idx = new Date().getDay() % GREETINGS.length
    setGreeting(GREETINGS[idx](userName || 'Foodie', mode.name))
  }, [userName, weekMode])

  const showToast = (msg) => {
    setToast({ msg, visible:true })
    setTimeout(() => setToast(t => ({ ...t, visible:false })), 2200)
  }

  const totalMeals = Object.values(assigned).reduce(
    (s, d) => s + Object.values(d||{}).filter(Boolean).length, 0
  )

  const handleDayClick = (di) => {
    const meals = Object.entries(assigned[DAYS[di]]||{}).filter(([,v])=>v)
    if (!meals.length) { showToast(`${DAYS[di]} has no meals yet`); return }
    setDayPopup({ day:DAYS[di], meals, idx:di })
  }

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)' }}>
      {[
        { icon:<IconHome size={22} color="var(--navy)" />,    label:'home',     path:'/home',    active:true  },
        { icon:<IconCalendar size={22} color="var(--muted)" />,label:'planner', path:'/planner', active:false },
        { icon:<IconCart size={22} color="var(--muted)" />,   label:'grocery',  path:'/grocery', active:false },
        { icon:<IconProfile size={22} color="var(--muted)" />,label:'profile',  path:'/home',    active:false },
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
      <NotifBanner />

      {/* Toast */}
      <div style={{ position:'fixed', bottom:90, left:'50%', transform:toast.visible ? 'translateX(-50%) translateY(-4px)':'translateX(-50%)', background:'var(--navy)', borderRadius:10, padding:'9px 18px', fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap', opacity:toast.visible ? 1:0, transition:'all .3s', pointerEvents:'none', zIndex:199 }}>{toast.msg}</div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 0' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600, marginBottom:2 }}>
              {new Date().toLocaleDateString('en-AU', { weekday:'long', month:'short', day:'numeric' })}
            </div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)', lineHeight:1.2, maxWidth:230 }}>
              {greeting}
            </div>
          </div>
          <button onClick={() => showToast('notifications on!')} style={{ width:44, height:44, borderRadius:12, border:'2px solid var(--navy)', background:'var(--yellow)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-sm)', flexShrink:0, marginLeft:10 }}>
            <IconBell size={20} color="var(--navy)" />
          </button>
        </div>

        {/* ── WEEK MODE BADGE ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>mode this week</div>
          <button onClick={() => setShowModeSelect(!showModeSelect)} style={{
            display:'flex', alignItems:'center', gap:10,
            background:'var(--navy)', border:'2px solid var(--navy)',
            borderRadius:16, padding:'12px 16px', width:'100%',
            cursor:'pointer', boxShadow:'var(--shadow-md)',
            transition:'transform .1s',
          }}
            onMouseDown={e => e.currentTarget.style.transform='translate(2px,2px)'}
            onMouseUp={e => e.currentTarget.style.transform=''}
          >
            <div style={{ width:38, height:38, borderRadius:10, background:mode.color, border:'2px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
              {mode.emoji}
            </div>
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontSize:13, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>{mode.name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:500 }}>{mode.desc}</div>
            </div>
            <div style={{ fontSize:18, color:'rgba(255,255,255,0.4)' }}>{showModeSelect ? '▲' : '▼'}</div>
          </button>

          {/* Mode selector dropdown */}
          {showModeSelect && (
            <div className="bounce-in" style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, marginTop:6, overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
              {WEEK_MODES.map(m => (
                <button key={m.key} onClick={() => { setWeekMode(m.key); setShowModeSelect(false); showToast(`Mode set to ${m.name}!`) }} style={{ width:'100%', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, border:'none', borderBottom:'1px solid var(--border)', background:weekMode===m.key ? m.light : 'transparent', cursor:'pointer', textAlign:'left' }}>
                  <span style={{ fontSize:18 }}>{m.emoji}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:'var(--navy)', fontFamily:'Nunito, sans-serif' }}>{m.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{m.desc}</div>
                  </div>
                  {weekMode===m.key && <div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:m.color }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── MAMA BANNER ── */}
        <div onClick={() => router.push('/input')} style={{
          background:mode.light, border:`2px solid var(--navy)`,
          borderRadius:18, padding:16, display:'flex', gap:12,
          alignItems:'center', marginBottom:20,
          boxShadow:'var(--shadow-sm)', cursor:'pointer',
        }}>
          <MamaMini size={50} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:800, color:mode.color === '#F5C842' ? '#B8960A' : mode.color, textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>mama says</div>
            <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.55, fontWeight:600 }}>
              {planDone ? `ur week is all set! mama is proud 💕`
                : totalMeals > 0 ? `nice! ${totalMeals} meal${totalMeals > 1 ? 's':''} planned — keep going!`
                : `tap here to plan ur meals for the week`}
            </div>
          </div>
          <div style={{ fontSize:12, color:'var(--muted)', fontWeight:700 }}>→</div>
        </div>

        {/* ── MOOD TRACKER ── */}
        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'14px 16px', marginBottom:20, boxShadow:'var(--shadow-sm)' }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>today's vibe</div>
          <div style={{ display:'flex', gap:8, justifyContent:'space-between' }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => { setMood(today, i); showToast('mood logged!') }} style={{
                flex:1, padding:'8px 0', borderRadius:10, border:`2px solid ${moodLog[today]===i ? 'var(--navy)':'var(--border)'}`,
                background:moodLog[today]===i ? 'var(--yellow-l)' : 'transparent',
                cursor:'pointer', fontSize:20, lineHeight:1,
                boxShadow:moodLog[today]===i ? 'var(--shadow-sm)':'none',
                transition:'all .15s',
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* ── WEEK GRID ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>this week</div>
          <button onClick={() => router.push('/planner')} style={{ padding:'5px 12px', borderRadius:8, border:'2px solid var(--navy)', background:'var(--white)', cursor:'pointer', fontSize:11, fontWeight:800, boxShadow:'var(--shadow-sm)', fontFamily:'Nunito, sans-serif' }}>open planner</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:22 }}>
          {SHORT_DAYS.map((d, i) => {
            const meals = Object.values(assigned[DAYS[i]]||{}).filter(Boolean)
            const isToday = i === 0
            const mood = moodLog[DAYS[i]]
            return (
              <div key={d} onClick={() => handleDayClick(i)} style={{
                background:isToday ? 'var(--navy)' : meals.length ? mode.light : 'var(--white)',
                border:`2px solid ${isToday ? 'var(--navy)' : meals.length ? 'var(--navy)' : 'var(--border)'}`,
                borderRadius:12, padding:'6px 2px', textAlign:'center',
                cursor:'pointer', minHeight:76,
                boxShadow:isToday ? 'var(--shadow-sm)' : meals.length ? '2px 3px 0 var(--navy)':'none',
                transition:'all .15s', position:'relative',
              }}>
                {mood !== undefined && <div style={{ position:'absolute', top:2, right:2, fontSize:8 }}>{MOODS[mood]}</div>}
                <div style={{ fontSize:8, fontWeight:700, textTransform:'uppercase', marginBottom:2, color:isToday ? 'rgba(255,255,255,0.6)':'var(--muted)' }}>{d}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, marginBottom:3, color:isToday ? 'var(--yellow)':'var(--navy)' }}>{14+i}</div>
                {meals.slice(0,2).map((m,mi) => <div key={mi} style={{ fontSize:13, lineHeight:1.3 }}>{m.flag}</div>)}
                {!meals.length && <div style={{ width:5, height:5, borderRadius:'50%', background:isToday ? 'rgba(255,255,255,0.3)':'var(--border)', margin:'2px auto 0' }} />}
              </div>
            )
          })}
        </div>

        {/* ── BADGES ── */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>weekly badges</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:22 }}>
          {BADGES.map(b => (
            <div key={b.id} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:b.earned ? 'var(--shadow-sm)':'none', opacity:b.earned ? 1:0.5 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:b.earned ? 'var(--yellow-l)':'var(--paper)', border:'2px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{b.emoji}</div>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'var(--navy)', fontFamily:'Nunito, sans-serif' }}>{b.name}</div>
                <div style={{ fontSize:10, color:'var(--muted)' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <button onClick={() => router.push('/input')} style={{
          width:'100%', padding:'15px 20px', borderRadius:14,
          border:'2px solid var(--navy)', background:'var(--yellow)',
          color:'var(--navy)', fontSize:15, fontWeight:900,
          cursor:'pointer', fontFamily:'Nunito, sans-serif',
          boxShadow:'var(--shadow-md)', marginBottom:10,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          transition:'transform .1s, box-shadow .1s',
        }}
          onMouseDown={e => { e.currentTarget.style.transform='translate(2px,3px)'; e.currentTarget.style.boxShadow='0 0 0 var(--navy)' }}
          onMouseUp={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow-md)' }}
        >
          <IconPlus size={18} color="var(--navy)" />
          plan this week
        </button>

        {planDone && <div style={{ textAlign:'center', paddingTop:12 }}><MamaHappy size={72} /></div>}
        <div style={{ height:16 }} />
      </div>

      <NavBar />

      {/* Day popup */}
      {dayPopup && (
        <div onClick={e => e.target===e.currentTarget && setDayPopup(null)} style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.55)', zIndex:90, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
          <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', padding:'22px 20px 32px', width:'100%', border:'2px solid var(--navy)', borderBottom:'none', animation:'slideUp .3s' }}>
            <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 18px' }} />
            <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, marginBottom:14, color:'var(--navy)' }}>{dayPopup.day}'s meals</div>
            {dayPopup.meals.map(([slotId, recipe]) => {
              const slot = SLOTS.find(s=>s.id===slotId)
              return (
                <div key={slotId} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:14, display:'flex', alignItems:'center', gap:12, marginBottom:8, boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ width:46, height:46, background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{recipe.flag}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{recipe.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{slot?.emoji} {slot?.label} · {recipe.time}min</div>
                  </div>
                </div>
              )
            })}
            <button onClick={() => setDayPopup(null)} className="retro-btn" style={{ width:'100%', padding:13, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:8 }}>close</button>
          </div>
        </div>
      )}
    </div>
  )
}
