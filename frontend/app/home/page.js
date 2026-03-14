'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES, FOOD_TIPS, SHOP_ITEMS } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconClock, IconCheck } from '@/components/Icons'
import { MamaMini, MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import NomsterLogo from '@/components/NomsterLogo'

const DAY_NAMES  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAY_SHORT  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const SLOTS      = ['breakfast','lunch','snack','dinner']

// Get Mon-indexed today (0=Mon … 6=Sun)
function getTodayIdx() {
  const d = new Date().getDay() // 0=Sun,1=Mon...6=Sat
  return d === 0 ? 6 : d - 1
}

// Generate the 7 real dates starting from this Monday
function getWeekDates() {
  const today    = new Date()
  const todayIdx = getTodayIdx()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - todayIdx + i)
    return d
  })
}

function fmtDate(d) {
  return d.getDate()
}

function fmtMonth(d) {
  return d.toLocaleString('en-AU', { month: 'short' })
}

// ── Recipe modal (day popup → recipe detail) ──────────────────
function RecipeModal({ recipe, onClose, mc, saved, onSave }) {
  const [fw, setFw] = useState(0)
  useEffect(() => { const t = setTimeout(() => setFw(recipe.fuel), 80); return () => clearTimeout(t) }, [recipe])
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:100, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'20px 20px 40px', width:'100%', maxHeight:'90%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:34, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }}/>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
          <div style={{ width:58, height:58, background:`${mc}30`, border:'2px solid var(--navy)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, flexShrink:0 }}>{recipe.flag}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)', marginBottom:1 }}>{recipe.name}</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginBottom:7 }}>{recipe.cuisine} · {recipe.time}min</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              <span style={{ background:'var(--yellow-l)', color:'var(--navy)', padding:'3px 9px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', gap:3 }}>
                <IconClock size={10} color="var(--navy)"/> {recipe.time}min
              </span>
              <span style={{ background:mc+'25', color:'var(--navy)', padding:'3px 9px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)' }}>
                {WEEK_MODES.find(m=>m.key===recipe.mode)?.emoji} {WEEK_MODES.find(m=>m.key===recipe.mode)?.name}
              </span>
            </div>
          </div>
          <button onClick={onSave} style={{ width:38, height:38, borderRadius:11, border:'2px solid var(--navy)', background:saved?'var(--coral-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IconHeart size={16} color={saved?'var(--coral)':'var(--border)'}/>
          </button>
        </div>
        {/* Fun fact */}
        <div style={{ background:'var(--navy)', borderRadius:12, padding:'11px 13px', marginBottom:11 }}>
          <div style={{ fontSize:9, fontWeight:800, color:'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>✨ fun fact</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.65, fontWeight:500 }}>{recipe.funFact}</div>
        </div>
        {/* Fuel */}
        <div style={{ background:`${mc}20`, border:'2px solid var(--navy)', borderRadius:12, padding:11, marginBottom:11 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>power level</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>{recipe.fuel}</div>
          </div>
          <div style={{ height:8, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', background:mc, width:`${fw}%`, transition:'width .9s ease' }}/>
          </div>
        </div>
        {/* Macros */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:13 }}>
          {[['kcal',recipe.cal,'🔥'],['protein',recipe.pro,'🥩'],['carbs',recipe.carb,'🍞'],['fat',recipe.fat,'💧']].map(([k,v,i]) => (
            <div key={k} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:9, padding:'8px 4px', textAlign:'center' }}>
              <div style={{ fontSize:13 }}>{i}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:12, fontWeight:900, color:'var(--navy)' }}>{v}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase' }}>{k}</div>
            </div>
          ))}
        </div>
        {/* Steps */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>how to make it 👩‍🍳</div>
        {recipe.steps.map((s,i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
            <div style={{ width:21, height:21, borderRadius:6, background:mc, border:'2px solid var(--navy)', color:'var(--navy)', fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.65, paddingTop:2, fontWeight:500 }}>{s}</div>
          </div>
        ))}
        {recipe.tips?.length > 0 && (
          <div style={{ background:'var(--mint-l)', border:'2px solid var(--navy)', borderRadius:11, padding:'10px 13px', marginBottom:11 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>💡 mama's tips</div>
            {recipe.tips.map((t,i) => (
              <div key={i} style={{ display:'flex', gap:7, marginBottom:i<recipe.tips.length-1?4:0 }}>
                <div style={{ width:15, height:15, borderRadius:4, background:'var(--navy)', color:'var(--mint)', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.6, fontWeight:500 }}>{t}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:11, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:6 }}>close</button>
      </div>
    </div>
  )
}

// ── Day popup (from week grid) ────────────────────────────────
function DayPopup({ day, meals, onClose, onOpenRecipe }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:90, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'18px 20px 32px', width:'100%', maxHeight:'65%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:32, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 14px' }}/>
        <div style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)', marginBottom:12 }}>{day}</div>
        {meals.length === 0
          ? (
            <div style={{ textAlign:'center', padding:'16px 0 8px' }}>
              <div style={{ fontSize:13, color:'var(--muted)', fontWeight:600, marginBottom:14 }}>nothing planned yet</div>
              <button onClick={onClose} className="retro-btn" style={{ padding:'10px 24px', background:'var(--yellow)', color:'var(--navy)', fontSize:13 }}>go to planner →</button>
            </div>
          ) : meals.map(({ slot, recipe }) => (
            <div key={slot} onClick={() => onOpenRecipe(recipe)}
              style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:13, padding:12, display:'flex', alignItems:'center', gap:10, marginBottom:8, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:44, height:44, background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{recipe.flag}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:1 }}>{slot}</div>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{recipe.name}</div>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{recipe.time}min</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          ))
        }
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:11, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:8 }}>close</button>
      </div>
    </div>
  )
}

// ── NavBar ─────────────────────────────────────────────────────
function NavBar() {
  const router = useRouter()
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { label:'home',    path:'/home',    Icon:IconHome,     active:true  },
        { label:'planner', path:'/planner', Icon:IconCalendar, active:false },
        { label:'grocery', path:'/grocery', Icon:IconCart,     active:false },
        { label:'saved',   path:'/saved',   Icon:IconHeart,    active:false },
        { label:'profile', path:'/profile', Icon:IconProfile,  active:false },
      ].map(({ label, path, Icon, active }) => (
        <button key={label} onClick={() => router.push(path)}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:active?'var(--navy)':'var(--muted)', padding:'0 8px', opacity:active?1:0.45 }}>
          <Icon size={22} color={active?'var(--navy)':'var(--muted)'}/>
          {label}
        </button>
      ))}
    </div>
  )
}

// ── MAIN ───────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const {
    userName, weekMode, setWeekMode,
    assigned, savedRecipes, toggleSaved,
    shopItems, toggleShopItem,
  } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]

  const [dayPopup,     setDayPopup]     = useState(null)
  const [recipePopup,  setRecipePopup]  = useState(null)
  const [tipIdx,       setTipIdx]       = useState(0)
  const [modeOpen,     setModeOpen]     = useState(false)

  // Rotate tips
  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i + 1) % FOOD_TIPS.length), 8000)
    return () => clearInterval(iv)
  }, [])

  // Close mode dropdown on outside click
  useEffect(() => {
    if (!modeOpen) return
    const close = () => setModeOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [modeOpen])

  // Dates
  const todayIdx  = getTodayIdx()
  const weekDates = getWeekDates()
  const hasPlan   = Object.keys(assigned).length > 0

  // Shopping
  const shopList    = shopItems?.length > 0 ? shopItems : SHOP_ITEMS.map(i => ({...i}))
  const pendingShop = shopList.filter(i => !i.done).length

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'good morning'
    if (h < 17) return 'good afternoon'
    if (h < 21) return 'good evening'
    return 'good night'
  }

  const openDay = (dayName) => {
    const meals = SLOTS
      .map(s => assigned[dayName]?.[s] ? { slot:s, recipe:assigned[dayName][s] } : null)
      .filter(Boolean)
    setDayPopup({ day: dayName, meals })
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <NotifBanner/>
      <div style={{ height:4, background:mode.color }}/>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:700, marginBottom:2 }}>{greeting()}</div>
            <h1 style={{ fontFamily:'Fraunces, serif', fontSize:24, fontWeight:900, color:'var(--navy)', lineHeight:1.1 }}>
              {hasPlan ? 'this week,' : "let's plan,"}<br/>
              <span style={{ color:mode.color }}>{userName || 'Foodie'}</span>
              <span style={{ fontSize:20 }}> {mode.emoji}</span>
            </h1>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:7 }}>
            <NomsterLogo size="sm" animate/>
            <button onClick={() => router.push('/profile')}
              style={{ width:33, height:33, borderRadius:9, background:'var(--white)', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <IconProfile size={17} color="var(--navy)"/>
            </button>
          </div>
        </div>

        {/* ── MODE CARD (inline dropdown, no redirect) ── */}
        <div style={{ position:'relative', marginBottom:12 }} onClick={e => e.stopPropagation()}>
          <div onClick={() => setModeOpen(o => !o)}
            style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'10px 13px', boxShadow:'var(--shadow-sm)', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:mode.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{mode.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>week mode</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--navy)' }}>{mode.name} — {mode.desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity:.3, transition:'transform .2s', transform:modeOpen?'rotate(180deg)':'none' }}>
              <path d="M6 9L12 15L18 9" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {modeOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:13, zIndex:30, boxShadow:'var(--shadow-md)', overflow:'hidden', animation:'bounceIn .2s' }}>
              {WEEK_MODES.map((m, i) => (
                <div key={m.key}
                  onClick={() => { setWeekMode(m.key); setModeOpen(false) }}
                  style={{
                    display:'flex', alignItems:'center', gap:10, padding:'10px 13px',
                    cursor:'pointer', background:m.key===weekMode ? `${m.color}25` : 'transparent',
                    borderBottom: i < WEEK_MODES.length-1 ? '1px solid var(--border)' : 'none',
                    transition:'background .12s',
                  }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:m.color, border:`2px solid ${m.key===weekMode?'var(--navy)':'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{m.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{m.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{m.desc}</div>
                  </div>
                  {m.key === weekMode && <div style={{ width:18, height:18, borderRadius:'50%', background:m.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}><IconCheck size={9} color="var(--navy)"/></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── MAMA BANNER ── */}
        <div style={{ background:hasPlan?`${mode.color}18`:'var(--navy)', border:'2px solid var(--navy)', borderRadius:16, padding:'11px 13px', marginBottom:10, display:'flex', gap:10, alignItems:'center' }}>
          <MamaMini size={40}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:800, color:hasPlan?'var(--muted)':'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>mama says</div>
            <div style={{ fontSize:12, fontWeight:700, color:hasPlan?'var(--navy)':'rgba(255,255,255,0.9)', lineHeight:1.65 }}>
              {hasPlan
                ? `looking good this week 💕 tap any day to see ur meals`
                : `no plan yet! tap "plan this week" and mama sorts it all out 🍳`}
            </div>
          </div>
        </div>

        {/* ── FOOD TIP (right under mama) ── */}
        <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:13, padding:'10px 13px', marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:800, color:'var(--navy)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>💡 food tip</div>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{FOOD_TIPS[tipIdx].emoji}</span>
            <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.65, fontWeight:600 }}>{FOOD_TIPS[tipIdx].tip}</div>
          </div>
          <div style={{ display:'flex', gap:3, marginTop:6 }}>
            {FOOD_TIPS.map((_, i) => (
              <div key={i} onClick={() => setTipIdx(i)}
                style={{ width:i===tipIdx?16:5, height:3, borderRadius:2, background:i===tipIdx?'var(--navy)':'var(--border)', cursor:'pointer', transition:'all .3s' }}/>
            ))}
          </div>
        </div>

        {/* ── THIS WEEK GRID (real dates) ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>
            this week
            <span style={{ marginLeft:6, fontWeight:600, textTransform:'none', letterSpacing:0, color:'var(--muted)', opacity:.7 }}>
              {fmtMonth(weekDates[0])} {fmtDate(weekDates[0])} – {fmtMonth(weekDates[6])} {fmtDate(weekDates[6])}
            </span>
          </div>
          <button onClick={() => router.push('/planner')}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>
            planner →
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:14 }}>
          {DAY_SHORT.map((d, i) => {
            const date     = weekDates[i]
            const dayMeals = Object.values(assigned[DAY_NAMES[i]] || {}).filter(Boolean)
            const isToday  = i === todayIdx
            return (
              <div key={d} onClick={() => openDay(DAY_NAMES[i])}
                style={{
                  background: isToday ? mode.color : 'var(--white)',
                  border: `2px solid ${dayMeals.length ? 'var(--navy)' : isToday ? 'var(--navy)' : 'var(--border)'}`,
                  borderRadius: 11, padding: '5px 2px', textAlign: 'center',
                  cursor: 'pointer', minHeight: 66,
                  boxShadow: isToday ? 'var(--shadow-sm)' : 'none',
                }}>
                <div style={{ fontSize:9, fontWeight:800, color:isToday?'var(--navy)':'var(--muted)', marginBottom:1 }}>{d}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:12, fontWeight:900, color:isToday?'var(--navy)':'var(--muted)', marginBottom:2, lineHeight:1 }}>
                  {fmtDate(date)}
                </div>
                {dayMeals.length > 0
                  ? dayMeals.slice(0,3).map((r, j) => <div key={j} style={{ fontSize:12, lineHeight:1.1 }}>{r.flag}</div>)
                  : <div style={{ fontSize:9, color:'var(--border)' }}>·</div>
                }
              </div>
            )
          })}
        </div>

        {/* ── SHOPPING LIST PREVIEW (no prices) ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>shopping list</div>
            {pendingShop > 0 && (
              <div style={{ background:'var(--coral)', color:'#fff', width:17, height:17, borderRadius:'50%', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--navy)' }}>
                {pendingShop}
              </div>
            )}
          </div>
          <button onClick={() => router.push('/grocery')}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>
            see all →
          </button>
        </div>

        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:13, overflow:'hidden', marginBottom:14, boxShadow:'var(--shadow-sm)' }}>
          {shopList.slice(0, 4).map((item, i) => (
            <div key={item.id}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 13px', borderBottom:i<3?'1px solid var(--border)':'none', opacity:item.done?.6:1 }}>
              <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${item.done?'var(--mint)':'var(--border)'}`, background:item.done?'var(--mint)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {item.done && <IconCheck size={10} color="#fff"/>}
              </div>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.e}</span>
              <div style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--navy)', textDecoration:item.done?'line-through':'none' }}>{item.n}</div>
            </div>
          ))}
          <button onClick={() => router.push('/grocery')}
            style={{ width:'100%', padding:'9px 13px', background:'var(--paper)', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:'var(--muted)', fontFamily:'Nunito, sans-serif', textAlign:'center' }}>
            + {shopList.length - 4} more items
          </button>
        </div>

        {/* ── CTAs ── */}
        <button onClick={() => router.push('/input')} className="retro-btn glow-btn"
          style={{ width:'100%', padding:14, background:'var(--yellow)', color:'var(--navy)', fontSize:14, fontWeight:900, boxShadow:'var(--shadow-md)', marginBottom:9 }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          + plan this week ✨
        </button>

        {/* Cook Together — coming soon */}
        <button onClick={() => router.push('/together')}
          style={{ width:'100%', padding:12, borderRadius:12, border:'2px solid var(--border)', background:'var(--white)', color:'var(--muted)', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7, position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', top:8, right:10, background:'var(--navy)', color:'var(--yellow)', fontSize:8, fontWeight:900, padding:'2px 7px', borderRadius:5, letterSpacing:1 }}>SOON</span>
          👯 cook together with housemates
        </button>

        <div style={{ height:16 }}/>
      </div>

      {/* ── POPUPS ── */}
      {dayPopup && !recipePopup && (
        <DayPopup
          day={dayPopup.day} meals={dayPopup.meals}
          onClose={() => setDayPopup(null)}
          onOpenRecipe={r => setRecipePopup(r)}
        />
      )}
      {recipePopup && (
        <RecipeModal
          recipe={recipePopup}
          onClose={() => setRecipePopup(null)}
          mc={WEEK_MODES.find(m => m.key === recipePopup.mode)?.color || mode.color}
          saved={savedRecipes.includes(recipePopup.id)}
          onSave={() => toggleSaved(recipePopup.id)}
        />
      )}

      <NavBar/>
    </div>
  )
}
