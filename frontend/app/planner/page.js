'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconClock } from '@/components/Icons'
import { MamaHappy, MamaMini } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'

const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DATES = ['Mar 14','Mar 15','Mar 16','Mar 17','Mar 18','Mar 19','Mar 20']
const SLOTS = [
  { id:'breakfast', label:'Breakfast', emoji:'☀️', time:'7 AM'  },
  { id:'lunch',     label:'Lunch',     emoji:'🌤️', time:'12 PM' },
  { id:'snack',     label:'Snack',     emoji:'🍎', time:'3 PM'  },
  { id:'dinner',    label:'Dinner',    emoji:'🌙', time:'6 PM'  },
]

function RecipeModal({ recipe, onClose, modeColor, saved, onToggleSave }) {
  const [fw, setFw] = useState(0)
  if (typeof window !== 'undefined' && fw === 0) setTimeout(() => setFw(recipe.fuel), 80)
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:100, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'22px 20px 36px', width:'100%', maxHeight:'85%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }} />
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
          <div style={{ width:58, height:58, background:`${modeColor}30`, border:'2px solid var(--navy)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, flexShrink:0 }}>{recipe.flag}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)' }}>{recipe.name}</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:2 }}>{recipe.cuisine} · {recipe.time}min · ${recipe.cost}</div>
          </div>
          <button onClick={onToggleSave} style={{ width:38, height:38, borderRadius:10, border:'2px solid var(--navy)', background:saved?'var(--coral-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IconHeart size={16} color={saved?'var(--coral)':'var(--border)'} />
          </button>
        </div>
        {/* Fun fact */}
        <div style={{ background:'var(--navy)', borderRadius:12, padding:'11px 13px', marginBottom:12 }}>
          <div style={{ fontSize:9, fontWeight:800, color:'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>✨ fun fact</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.65, fontWeight:500 }}>{recipe.funFact}</div>
        </div>
        {/* Fuel */}
        <div style={{ background:`${modeColor}20`, border:'2px solid var(--navy)', borderRadius:12, padding:12, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>power level</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>{recipe.fuel}</div>
          </div>
          <div style={{ height:8, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', background:modeColor, width:`${fw}%`, transition:'width .9s ease' }} />
          </div>
        </div>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:14 }}>
          {[['kcal',recipe.cal,'🔥'],['protein',recipe.pro,'🥩'],['carbs',recipe.carb,'🍞'],['fat',recipe.fat,'💧']].map(([k,v,i]) => (
            <div key={k} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:9, padding:'9px 5px', textAlign:'center' }}>
              <div>{i}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--navy)' }}>{v}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase' }}>{k}</div>
            </div>
          ))}
        </div>
        {/* Steps */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:9 }}>how to make it</div>
        {recipe.steps.map((s,i) => (
          <div key={i} style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:9 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:modeColor, border:'2px solid var(--navy)', color:'var(--navy)', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:13, color:'var(--navy)', lineHeight:1.65, paddingTop:2, fontWeight:500 }}>{s}</div>
          </div>
        ))}
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:10 }}>close</button>
      </div>
    </div>
  )
}

export default function PlannerPage() {
  const router  = useRouter()
  const { weekMode, assigned, assignMeal, removeMeal, savedRecipes, toggleSaved, recipes } = usePlannerStore()
  const mode    = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  const [dayIdx,      setDayIdx]      = useState(0)
  const [activeSlot,  setActiveSlot]  = useState('breakfast')
  const [poppedSlot,  setPoppedSlot]  = useState(null)
  const [recipePopup, setRecipePopup] = useState(null)
  const [toast,       setToast]       = useState({ msg:'', on:false })

  const cardRef    = useRef(null)
  const startXY    = useRef({ x:0, y:0 })
  const offsetXY   = useRef({ x:0, y:0 })
  const isDragging = useRef(false)

  const allRecipes    = recipes.length ? recipes : RECIPES
  const [cardIdx, setCardIdx] = useState(0)
  const currRecipe = allRecipes[cardIdx % allRecipes.length]

  const dayName = DAYS[dayIdx]
  const dayData = assigned[dayName] || {}

  const showToast = (msg) => {
    setToast({ msg, on:true })
    setTimeout(() => setToast(t => ({...t, on:false})), 2000)
  }

  const getPos = e => e.touches ? {x:e.touches[0].clientX, y:e.touches[0].clientY} : {x:e.clientX, y:e.clientY}

  const onDragStart = useCallback(e => {
    isDragging.current = true
    startXY.current    = getPos(e)
    offsetXY.current   = {x:0, y:0}
  }, [])

  const onDragMove = useCallback(e => {
    if (!isDragging.current || !cardRef.current) return
    if (e.cancelable) e.preventDefault()
    const off = { x: getPos(e).x - startXY.current.x, y: getPos(e).y - startXY.current.y }
    offsetXY.current = off
    cardRef.current.style.transform = `translate(${off.x}px,${off.y}px) rotate(${off.x*.025}deg)`
    cardRef.current.style.boxShadow = `0 ${12+Math.abs(off.y)*.1}px 28px rgba(27,43,75,.15)`
  }, [])

  const onDragEnd = useCallback(() => {
    if (!isDragging.current || !cardRef.current) return
    isDragging.current = false
    const { y } = offsetXY.current
    cardRef.current.style.transform = ''
    cardRef.current.style.boxShadow = ''
    if (y < -55) {
      assignMeal(dayName, activeSlot, currRecipe)
      setPoppedSlot(activeSlot)
      setTimeout(() => setPoppedSlot(null), 500)
      setCardIdx(i => i + 1)
      const slot = SLOTS.find(s => s.id === activeSlot)
      showToast(`${currRecipe.flag} added to ${slot?.label}!`)
    }
    offsetXY.current = {x:0, y:0}
  }, [dayName, activeSlot, currRecipe, assignMeal])

  const totalAssigned = Object.values(assigned).reduce((acc, day) => acc + Object.keys(day||{}).length, 0)

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { icon:<IconHome size={22} />,     label:'home',    path:'/home'    },
        { icon:<IconCalendar size={22} />, label:'planner', path:'/planner', active:true },
        { icon:<IconCart size={22} />,     label:'grocery', path:'/grocery' },
        { icon:<IconHeart size={22} />,    label:'saved',   path:'/saved'   },
        { icon:<IconProfile size={22} />,  label:'profile', path:'/profile' },
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

      {/* Toast */}
      <div style={{ position:'fixed', top:60, left:'50%', transform:toast.on?'translateX(-50%) translateY(0)':'translateX(-50%) translateY(-60px)', background:'var(--navy)', borderRadius:12, padding:'9px 18px', fontSize:12, fontWeight:700, color:'var(--white)', whiteSpace:'nowrap', opacity:toast.on?1:0, transition:'all .3s', pointerEvents:'none', zIndex:200 }}>
        {toast.msg}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <button onClick={() => router.push('/home')} className="retro-btn"
            style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12L15 18" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"/></svg> home
          </button>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>build ur week 📅</h2>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>
              {totalAssigned} meal{totalAssigned !== 1 ? 's':''}  planned this week
            </div>
          </div>
        </div>

        {/* ── DAY NAVIGATOR ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'12px 14px', marginBottom:14, boxShadow:'var(--shadow-sm)' }}>
          <button onClick={() => setDayIdx(d => (d+6)%7)}
            style={{ width:36, height:36, borderRadius:10, border:'2px solid var(--navy)', background:'var(--white)', cursor:'pointer', fontSize:16, fontWeight:700 }}>←</button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)' }}>{dayName}</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{DATES[dayIdx]}</div>
          </div>
          <button onClick={() => setDayIdx(d => (d+1)%7)}
            style={{ width:36, height:36, borderRadius:10, border:'2px solid var(--navy)', background:'var(--white)', cursor:'pointer', fontSize:16, fontWeight:700 }}>→</button>
        </div>

        {/* ── SLOT GRID 2x2 ── */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>
          tap a slot to select, then drag card ↑ to assign
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {SLOTS.map(slot => {
            const meal     = dayData[slot.id]
            const isActive = slot.id === activeSlot
            const isPopped = slot.id === poppedSlot
            return (
              <div key={slot.id} onClick={() => { setActiveSlot(slot.id) }}
                className={isPopped ? 'slot-pop' : ''}
                style={{
                  background: meal ? 'var(--mint-l)' : isActive ? `${mode.color}25` : 'var(--white)',
                  border: `2px solid ${meal ? 'var(--navy)' : isActive ? mode.color : 'var(--border)'}`,
                  borderRadius:14, padding:12, minHeight:88, cursor:'pointer',
                  outline: isActive ? `3px solid ${mode.color}` : 'none',
                  outlineOffset:2,
                  transition:'all .15s',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                }}>
                <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{slot.time}</div>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--navy)', marginBottom:meal?5:4 }}>{slot.emoji} {slot.label}</div>
                {meal ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ fontSize:11, color:'var(--navy)', fontWeight:700 }}>{meal.flag} {meal.name.split(' ').slice(0,2).join(' ')}...</div>
                    <button onClick={e => { e.stopPropagation(); removeMeal(dayName, slot.id) }}
                      style={{ width:18, height:18, borderRadius:5, border:'1.5px solid var(--navy)', background:'var(--coral-l)', cursor:'pointer', fontSize:9, fontWeight:900, color:'var(--coral)', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                  </div>
                ) : (
                  <div style={{ fontSize:10, color: isActive ? mode.color : 'var(--muted-light, #ccc)', fontWeight:isActive?800:500 }}>
                    {isActive ? '← active slot' : 'tap to select'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── DRAG HINTS ── */}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'0 4px', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--muted)', fontWeight:700 }}>
            <div style={{ width:26, height:26, background:'#FFE8E5', border:'1.5px solid var(--coral)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>←</div>
            skip
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--muted)', fontWeight:700 }}>
            drag ↑ to assign to {SLOTS.find(s=>s.id===activeSlot)?.label}
            <div style={{ width:26, height:26, background:'var(--mint-l)', border:'1.5px solid var(--navy)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>↑</div>
          </div>
        </div>

        {/* ── RECIPE CARD STACK ── */}
        <div style={{ position:'relative', height:230, marginBottom:14 }}>
          {/* Back card */}
          <div className="retro-card" style={{ position:'absolute', width:'100%', padding:14, zIndex:1, transform:'translateY(10px) scale(.96)', opacity:.65 }}>
            {allRecipes[(cardIdx+1) % allRecipes.length] && (
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ fontSize:24, width:44, height:44, background:'var(--paper)', border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {allRecipes[(cardIdx+1)%allRecipes.length].flag}
                </div>
                <div style={{ height:10, background:'var(--border)', flex:1, borderRadius:4 }} />
              </div>
            )}
          </div>

          {/* Front draggable card */}
          {currRecipe && (
            <div ref={cardRef} className="retro-card"
              style={{ position:'absolute', width:'100%', padding:16, zIndex:3, cursor:'grab', userSelect:'none', touchAction:'none' }}
              onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
              onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}>
              <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:10 }}>
                <div style={{ width:54, height:54, background:`${mode.color}25`, border:'2px solid var(--navy)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {currRecipe.flag}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)' }}>{currRecipe.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{currRecipe.cuisine} · {currRecipe.time}min · ${currRecipe.cost}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); setRecipePopup(currRecipe) }}
                  style={{ width:32, height:32, borderRadius:9, border:'2px solid var(--navy)', background:'var(--white)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  👁
                </button>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ fontSize:10, fontWeight:800, color:'var(--navy)' }}>⚡ {currRecipe.fuel}</span>
                <div style={{ flex:1, height:7, background:'var(--paper)', border:'1.5px solid var(--border)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:mode.color, width:`${currRecipe.fuel}%` }} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
                {[['kcal',currRecipe.cal],['prot',currRecipe.pro],['carb',currRecipe.carb],['fat',currRecipe.fat]].map(([k,v]) => (
                  <div key={k} style={{ background:'var(--paper)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 4px', textAlign:'center' }}>
                    <div style={{ fontFamily:'Fraunces, serif', fontSize:12, fontWeight:900, color:'var(--navy)' }}>{v}</div>
                    <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase' }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skip button */}
        <button onClick={() => setCardIdx(i => i+1)}
          className="retro-btn"
          style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13, marginBottom:14 }}>
          not feeling it — skip →
        </button>

        {/* ── WEEK OVERVIEW ── */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>week overview</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:16 }}>
          {DAYS.map((day, i) => {
            const meals    = Object.values(assigned[day] || {}).filter(Boolean)
            const isCurDay = i === dayIdx
            return (
              <div key={day} onClick={() => setDayIdx(i)}
                style={{ background:isCurDay?mode.color:'var(--white)', border:`2px solid ${meals.length?'var(--navy)':'var(--border)'}`, borderRadius:10, padding:'5px 2px', textAlign:'center', cursor:'pointer', minHeight:60, transition:'all .15s' }}>
                <div style={{ fontSize:8, fontWeight:800, color:isCurDay?'var(--navy)':'var(--muted)', textTransform:'uppercase' }}>{day.slice(0,2)}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:11, fontWeight:900, color:isCurDay?'var(--navy)':'var(--muted)', marginBottom:2 }}>{14+i}</div>
                {meals.slice(0,2).map((r,j) => <div key={j} style={{ fontSize:11, lineHeight:1.1 }}>{r.flag}</div>)}
                {!meals.length && <div style={{ fontSize:9, color:'var(--border)' }}>·</div>}
              </div>
            )
          })}
        </div>

        {/* ── DONE → HOME ── */}
        <button onClick={() => router.push('/home')}
          style={{ width:'100%', padding:15, borderRadius:12, border:'2px solid var(--navy)', background:mode.color, color:'var(--navy)', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', marginBottom:8 }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          ✓ done — back to home
        </button>

        <div style={{ height:16 }} />
      </div>

      {recipePopup && (
        <RecipeModal recipe={recipePopup} onClose={() => setRecipePopup(null)} modeColor={WEEK_MODES.find(m=>m.key===recipePopup.mode)?.color||mode.color} saved={savedRecipes.includes(recipePopup.id)} onToggleSave={() => toggleSaved(recipePopup.id)} />
      )}

      <NavBar />
    </div>
  )
}