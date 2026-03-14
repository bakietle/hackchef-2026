'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES, FOOD_TIPS, SHOP_ITEMS } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconClock, IconCheck } from '@/components/Icons'
import { MamaMini, MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'

const DAYS       = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DATES      = ['Mar 14','Mar 15','Mar 16','Mar 17','Mar 18','Mar 19','Mar 20']
const SLOTS      = ['breakfast','lunch','snack','dinner']

// ── Shared RecipeModal ──────────────────────────────────────────
function RecipeModal({ recipe, onClose, modeColor, saved, onToggleSave }) {
  const [fw, setFw] = useState(0)
  useEffect(() => { setTimeout(() => setFw(recipe.fuel), 80) }, [recipe])
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:100, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'22px 20px 40px', width:'100%', maxHeight:'88%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 18px' }} />
        {/* Header */}
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
          <div style={{ width:64, height:64, background:`${modeColor}30`, border:'2px solid var(--navy)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, flexShrink:0, boxShadow:'var(--shadow-sm)' }}>
            {recipe.flag}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', marginBottom:2 }}>{recipe.name}</div>
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:8, fontWeight:600 }}>{recipe.cuisine}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              <span style={{ background:'var(--yellow-l)', color:'var(--navy)', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', gap:4 }}>
                <IconClock size={11} color="var(--navy)" /> {recipe.time}min
              </span>
              <span style={{ background:'var(--mint-l)', color:'var(--navy)', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)' }}>${recipe.cost}</span>
            </div>
          </div>
          <button onClick={onToggleSave} style={{ width:40, height:40, borderRadius:12, border:'2px solid var(--navy)', background:saved?'var(--coral-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IconHeart size={18} color={saved?'var(--coral)':'var(--border)'} />
          </button>
        </div>

        {/* Fun fact */}
        <div style={{ background:'var(--navy)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>✨ fun fact</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.65, fontWeight:500 }}>{recipe.funFact}</div>
        </div>

        {/* Fuel */}
        <div style={{ background:`${modeColor}20`, border:'2px solid var(--navy)', borderRadius:14, padding:14, marginBottom:14, boxShadow:'var(--shadow-sm)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>power level</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)' }}>{recipe.fuel}</div>
          </div>
          <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:5, overflow:'hidden' }}>
            <div style={{ height:'100%', background:modeColor, width:`${fw}%`, transition:'width .9s ease' }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
          {[['kcal',recipe.cal,'🔥'],['protein',recipe.pro,'🥩'],['carbs',recipe.carb,'🍞'],['fat',recipe.fat,'💧']].map(([k,v,ico]) => (
            <div key={k} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:10, padding:'10px 6px', textAlign:'center', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ fontSize:14 }}>{ico}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)' }}>{v}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase', marginTop:1 }}>{k}</div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>how to make it 👩‍🍳</div>
        {recipe.steps.map((step, i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
            <div style={{ width:24, height:24, borderRadius:7, background:modeColor, border:'2px solid var(--navy)', color:'var(--navy)', fontSize:12, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:13, color:'var(--navy)', lineHeight:1.65, paddingTop:3, fontWeight:500 }}>{step}</div>
          </div>
        ))}

        {/* Tips */}
        {recipe.tips?.length > 0 && (
          <div style={{ background:'var(--mint-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'12px 14px', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>💡 mama's tips</div>
            {recipe.tips.map((t,i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom: i < recipe.tips.length-1 ? 6 : 0 }}>
                <div style={{ width:16, height:16, borderRadius:4, background:'var(--navy)', color:'var(--mint)', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.6, fontWeight:500 }}>{t}</div>
              </div>
            ))}
          </div>
        )}

        {/* Missing */}
        {recipe.miss?.length > 0 && (
          <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'12px 14px', marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--navy)', marginBottom:5 }}>🛒 still need to buy</div>
            <div style={{ fontSize:13, color:'var(--navy)', fontWeight:500 }}>{recipe.miss.join(', ')}</div>
          </div>
        )}

        <div style={{ textAlign:'center', margin:'14px 0 4px' }}><MamaHappy size={70} /></div>
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:13, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:6 }}>close</button>
      </div>
    </div>
  )
}

// ── Day popup ───────────────────────────────────────────────────
function DayPopup({ day, meals, onClose, onOpenRecipe }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:90, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'20px 20px 36px', width:'100%', maxHeight:'70%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }} />
        <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', marginBottom:14 }}>{day}'s meals</div>
        {meals.length === 0 ? (
          <div style={{ textAlign:'center', padding:'24px 0', color:'var(--muted)', fontSize:13, fontWeight:600 }}>no meals planned for this day yet</div>
        ) : (
          meals.map(({ slot, recipe }) => (
            <div key={slot} onClick={() => onOpenRecipe(recipe)}
              style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:14, display:'flex', alignItems:'center', gap:12, marginBottom:8, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:48, height:48, background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
                {recipe.flag}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>{slot}</div>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)' }}>{recipe.name}</div>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{recipe.time}min · ${recipe.cost}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))
        )}
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:8 }}>close</button>
      </div>
    </div>
  )
}

// ── Main Homepage ────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const { userName, weekMode, assigned, savedRecipes, toggleSaved, shopItems, toggleShopItem } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  const [dayPopup,    setDayPopup]    = useState(null) // { day, meals }
  const [recipePopup, setRecipePopup] = useState(null)
  const [tipIdx,      setTipIdx]      = useState(0)

  // Rotate food tip every 8s
  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i+1) % FOOD_TIPS.length), 8000)
    return () => clearInterval(iv)
  }, [])

  const hasPlan  = Object.keys(assigned).length > 0
  const shopList = shopItems.length > 0 ? shopItems : SHOP_ITEMS.map(i => ({...i}))
  const pendingShop = shopList.filter(i => !i.done).length
  const allShopDone = pendingShop === 0 && shopList.length > 0

  const openDay = (dayName) => {
    const dayData = assigned[dayName] || {}
    const meals   = SLOTS
      .map(slot => dayData[slot] ? { slot, recipe: dayData[slot] } : null)
      .filter(Boolean)
    setDayPopup({ day: dayName, meals })
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'good morning'
    if (h < 17) return 'good afternoon'
    if (h < 21) return 'good evening'
    return 'good night'
  }

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { icon:<IconHome size={22} color="var(--navy)" />,     label:'home',    path:'/home',    active:true  },
        { icon:<IconCalendar size={22} color="var(--muted)" />,label:'planner', path:'/planner', active:false },
        { icon:<IconCart size={22} color="var(--muted)" />,    label:'grocery', path:'/grocery', active:false },
        { icon:<IconHeart size={22} color="var(--muted)" />,   label:'saved',   path:'/saved',   active:false },
        { icon:<IconProfile size={22} color="var(--muted)" />, label:'profile', path:'/profile', active:false },
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

      {/* Mode accent strip */}
      <div style={{ height:4, background:mode.color }} />

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>{greeting()}</div>
            <h1 style={{ fontFamily:'Fraunces, serif', fontSize:26, fontWeight:900, color:'var(--navy)', lineHeight:1.1 }}>
              {hasPlan ? `some fun this week,` : `let's plan,`}<br/>
              <span style={{ color:mode.color }}>{userName || 'Foodie'}</span>
              <span style={{ fontSize:20 }}> {mode.emoji}</span>
            </h1>
          </div>
          <button onClick={() => router.push('/profile')}
            style={{ width:44, height:44, borderRadius:14, background:'var(--white)', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'var(--shadow-sm)', flexShrink:0 }}>
            <IconProfile size={22} color="var(--navy)" />
          </button>
        </div>

        {/* ── MODE SELECTOR ── */}
        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'12px 14px', marginBottom:14, boxShadow:'var(--shadow-sm)', cursor:'pointer' }}
          onClick={() => router.push('/profile')}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>mode this week</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:mode.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{mode.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)' }}>{mode.name}</div>
              <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{mode.desc}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity:.4 }}><path d="M6 9L12 15L18 9" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* ── MAMA MESSAGE ── */}
        <div style={{ background:hasPlan ? `${mode.color}20` : 'var(--navy)', border:'2px solid var(--navy)', borderRadius:16, padding:'12px 14px', marginBottom:16, display:'flex', gap:10, alignItems:'center', cursor:'pointer' }}
          onClick={() => router.push('/input')}>
          <MamaMini size={42} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:800, color:hasPlan?'var(--muted)':'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>mama says</div>
            <div style={{ fontSize:12, fontWeight:700, color:hasPlan?'var(--navy)':'rgba(255,255,255,0.9)', lineHeight:1.6 }}>
              {hasPlan
                ? `u planned this week's meals already 💕 tap to plan a new week`
                : `tap "plan this week" and mama sorts u out 🍳`}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity:.4, flexShrink:0 }}><path d="M9 6L15 12L9 18" stroke={hasPlan?'var(--navy)':'#fff'} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>

        {/* ── THIS WEEK GRID ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>this week</div>
          <button onClick={() => router.push('/planner')}
            style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>
            planner →
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:16 }}>
          {DAYS_SHORT.map((d, i) => {
            const dayMeals = Object.values(assigned[DAYS[i]] || {}).filter(Boolean)
            const isToday  = i === 0
            return (
              <div key={d} onClick={() => openDay(DAYS[i])}
                style={{
                  background: isToday ? mode.color : 'var(--white)',
                  border: `2px solid ${dayMeals.length > 0 ? 'var(--navy)' : 'var(--border)'}`,
                  borderRadius:12, padding:'6px 3px', textAlign:'center',
                  cursor:'pointer', minHeight:68,
                  boxShadow: isToday ? 'var(--shadow-sm)' : 'none',
                  transition:'transform .15s',
                }}>
                <div style={{ fontSize:9, fontWeight:800, color:isToday?'var(--navy)':'var(--muted)', marginBottom:2 }}>{d}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:12, fontWeight:900, color:isToday?'var(--navy)':'var(--muted)', marginBottom:3 }}>{14+i}</div>
                {dayMeals.length > 0
                  ? dayMeals.slice(0,3).map((r,j) => (
                      <div key={j} style={{ fontSize:12, lineHeight:1.2 }}>{r.flag}</div>
                    ))
                  : <div style={{ fontSize:10, color:'var(--border)' }}>·</div>
                }
              </div>
            )
          })}
        </div>

        {/* ── SHOPPING LIST PREVIEW ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>shopping list</div>
            {pendingShop > 0 && (
              <div style={{ background:'var(--coral)', color:'#fff', width:18, height:18, borderRadius:'50%', fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--navy)' }}>
                {pendingShop}
              </div>
            )}
          </div>
          <button onClick={() => router.push('/grocery')}
            style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>
            see all →
          </button>
        </div>

        {allShopDone ? (
          <div style={{ background:'var(--mint-l)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:14, display:'flex', gap:10, alignItems:'center', boxShadow:'var(--shadow-sm)' }}>
            <MamaHappy size={36} />
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', lineHeight:1.6 }}>all groceries done! mama is proud 💕</div>
          </div>
        ) : (
          <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'10px 0', marginBottom:14, boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
            {shopList.slice(0,4).map((item, i) => (
              <div key={item.id}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', cursor:'pointer', opacity:item.done?.6:1 }}
                onClick={() => toggleShopItem?.(item.id)}>
                <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${item.done?'var(--mint)':'var(--border)'}`, background:item.done?'var(--mint)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {item.done && <IconCheck size={11} color="#fff" />}
                </div>
                <div style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--navy)', textDecoration:item.done?'line-through':'none' }}>{item.e} {item.n}</div>
                <div style={{ fontSize:12, fontWeight:900, color:'var(--navy)', fontFamily:'Fraunces, serif' }}>${item.p.toFixed(2)}</div>
              </div>
            ))}
            {shopList.length > 4 && (
              <button onClick={() => router.push('/grocery')}
                style={{ width:'100%', padding:'10px 14px', background:'var(--paper)', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:'var(--muted)', fontFamily:'Nunito, sans-serif', textAlign:'center' }}>
                + {shopList.length - 4} more items
              </button>
            )}
          </div>
        )}

        {/* ── FOOD TIP ── */}
        <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:16, boxShadow:'var(--shadow-sm)' }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>💡 food tip</div>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{FOOD_TIPS[tipIdx].emoji}</span>
            <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.65, fontWeight:600 }}>{FOOD_TIPS[tipIdx].tip}</div>
          </div>
          <div style={{ display:'flex', gap:4, marginTop:8 }}>
            {FOOD_TIPS.map((_,i) => (
              <div key={i} onClick={() => setTipIdx(i)} style={{ width: i===tipIdx?20:6, height:4, borderRadius:2, background:i===tipIdx?'var(--navy)':'var(--border)', cursor:'pointer', transition:'all .3s' }} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <button onClick={() => router.push('/input')} className="retro-btn glow-btn"
          style={{ width:'100%', padding:15, background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, boxShadow:'var(--shadow-md)', marginBottom:8 }}
          onMouseDown={e => { e.currentTarget.style.transform='translate(2px,3px)'; e.currentTarget.style.boxShadow='0 0 0 var(--navy)' }}
          onMouseUp={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow-md)' }}>
          + plan this week ✨
        </button>

        <div style={{ height:20 }} />
      </div>

      {/* ── POPUPS ── */}
      {dayPopup && !recipePopup && (
        <DayPopup
          day={dayPopup.day}
          meals={dayPopup.meals}
          onClose={() => setDayPopup(null)}
          onOpenRecipe={r => setRecipePopup(r)}
        />
      )}
      {recipePopup && (
        <RecipeModal
          recipe={recipePopup}
          onClose={() => setRecipePopup(null)}
          modeColor={WEEK_MODES.find(m=>m.key===recipePopup.mode)?.color || mode.color}
          saved={savedRecipes.includes(recipePopup.id)}
          onToggleSave={() => toggleSaved(recipePopup.id)}
        />
      )}

      <NavBar />
    </div>
  )
}
