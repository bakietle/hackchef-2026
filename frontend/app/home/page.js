'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES, FOOD_TIPS, SHOP_ITEMS } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconClock, IconCheck } from '@/components/Icons'
import { MamaMini, MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import NomsterLogo from '@/components/NomsterLogo'

const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DSHRT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const SLOTS = ['breakfast','lunch','snack','dinner']

function RecipeModal({ recipe, onClose, mc, saved, onSave }) {
  const [fw, setFw] = useState(0)
  useEffect(() => { const t = setTimeout(() => setFw(recipe.fuel), 80); return () => clearTimeout(t) }, [recipe])
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:100, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'22px 20px 40px', width:'100%', maxHeight:'90%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }}/>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
          <div style={{ width:62, height:62, background:`${mc}30`, border:'2px solid var(--navy)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>{recipe.flag}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', marginBottom:2 }}>{recipe.name}</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginBottom:8 }}>{recipe.cuisine}</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              <span style={{ background:'var(--yellow-l)', color:'var(--navy)', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', gap:4 }}><IconClock size={11} color="var(--navy)"/> {recipe.time}min</span>
              <span style={{ background:'var(--mint-l)', color:'var(--navy)', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)' }}>${recipe.cost}</span>
            </div>
          </div>
          <button onClick={onSave} style={{ width:40, height:40, borderRadius:12, border:'2px solid var(--navy)', background:saved?'var(--coral-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IconHeart size={18} color={saved?'var(--coral)':'var(--border)'}/>
          </button>
        </div>
        <div style={{ background:'var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>✨ fun fact</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.65, fontWeight:500 }}>{recipe.funFact}</div>
        </div>
        <div style={{ background:`${mc}20`, border:'2px solid var(--navy)', borderRadius:12, padding:12, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>power level</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>{recipe.fuel}</div>
          </div>
          <div style={{ height:9, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:5, overflow:'hidden' }}>
            <div style={{ height:'100%', background:mc, width:`${fw}%`, transition:'width .9s ease' }}/>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
          {[['kcal',recipe.cal,'🔥'],['protein',recipe.pro,'🥩'],['carbs',recipe.carb,'🍞'],['fat',recipe.fat,'💧']].map(([k,v,i]) => (
            <div key={k} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:10, padding:'9px 5px', textAlign:'center' }}>
              <div>{i}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--navy)' }}>{v}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase' }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:9 }}>how to make it 👩‍🍳</div>
        {recipe.steps.map((s,i) => (
          <div key={i} style={{ display:'flex', gap:9, marginBottom:9 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:mc, border:'2px solid var(--navy)', color:'var(--navy)', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:13, color:'var(--navy)', lineHeight:1.65, paddingTop:2, fontWeight:500 }}>{s}</div>
          </div>
        ))}
        {recipe.tips?.length > 0 && (
          <div style={{ background:'var(--mint-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'11px 13px', marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', textTransform:'uppercase', letterSpacing:1, marginBottom:7 }}>💡 mama's tips</div>
            {recipe.tips.map((t,i) => (
              <div key={i} style={{ display:'flex', gap:7, marginBottom: i<recipe.tips.length-1?5:0 }}>
                <div style={{ width:16, height:16, borderRadius:4, background:'var(--navy)', color:'var(--mint)', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.6, fontWeight:500 }}>{t}</div>
              </div>
            ))}
          </div>
        )}
        {recipe.miss?.length > 0 && (
          <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'11px 13px', marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--navy)', marginBottom:4 }}>🛒 still need to buy</div>
            <div style={{ fontSize:13, color:'var(--navy)', fontWeight:500 }}>{recipe.miss.join(', ')}</div>
          </div>
        )}
        <div style={{ textAlign:'center', margin:'10px 0 4px' }}><MamaHappy size={64}/></div>
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:4 }}>close</button>
      </div>
    </div>
  )
}

function DayPopup({ day, meals, onClose, onOpenRecipe }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:90, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'20px 20px 36px', width:'100%', maxHeight:'65%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }}/>
        <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', marginBottom:14 }}>{day}'s meals</div>
        {meals.length === 0
          ? <div style={{ textAlign:'center', padding:'20px 0', color:'var(--muted)', fontSize:13, fontWeight:600 }}>no meals planned yet — go to the planner!</div>
          : meals.map(({ slot, recipe }) => (
              <div key={slot} onClick={() => onOpenRecipe(recipe)}
                style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:12, display:'flex', alignItems:'center', gap:11, marginBottom:8, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ width:46, height:46, background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{recipe.flag}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:1 }}>{slot}</div>
                  <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{recipe.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{recipe.time}min · ${recipe.cost}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            ))
        }
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:11, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:8 }}>close</button>
      </div>
    </div>
  )
}

function NavBar({ active }) {
  const router = useRouter()
  const tabs = [
    { label:'home',    path:'/home',    Icon:IconHome    },
    { label:'planner', path:'/planner', Icon:IconCalendar },
    { label:'grocery', path:'/grocery', Icon:IconCart    },
    { label:'saved',   path:'/saved',   Icon:IconHeart   },
    { label:'profile', path:'/profile', Icon:IconProfile },
  ]
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {tabs.map(({ label, path, Icon }) => {
        const isActive = label === active
        return (
          <button key={label} onClick={() => router.push(path)}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:isActive?'var(--navy)':'var(--muted)', padding:'0 8px', opacity:isActive?1:0.45 }}>
            <Icon size={22} color={isActive?'var(--navy)':'var(--muted)'}/>
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { userName, weekMode, assigned, savedRecipes, toggleSaved, shopItems, toggleShopItem } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  const [dayPopup,    setDayPopup]    = useState(null)
  const [recipePopup, setRecipePopup] = useState(null)
  const [tipIdx,      setTipIdx]      = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i+1) % FOOD_TIPS.length), 8000)
    return () => clearInterval(iv)
  }, [])

  const shopList    = shopItems?.length > 0 ? shopItems : SHOP_ITEMS.map(i=>({...i}))
  const pendingShop = shopList.filter(i=>!i.done).length
  const hasPlan     = Object.keys(assigned).length > 0

  const openDay = (dayName) => {
    const meals = SLOTS.map(s => assigned[dayName]?.[s] ? { slot:s, recipe:assigned[dayName][s] } : null).filter(Boolean)
    setDayPopup({ day:dayName, meals })
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'good morning'
    if (h < 17) return 'good afternoon'
    if (h < 21) return 'good evening'
    return 'good night'
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <NotifBanner/>
      <div style={{ height:4, background:mode.color }}/>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>{greeting()}</div>
            <h1 style={{ fontFamily:'Fraunces, serif', fontSize:24, fontWeight:900, color:'var(--navy)', lineHeight:1.1 }}>
              {hasPlan?'some fun this week,': "let's plan,"}<br/>
              <span style={{ color:mode.color }}>{userName||'Foodie'}</span> {mode.emoji}
            </h1>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
            <NomsterLogo size="sm" animate/>
            <button onClick={() => router.push('/profile')} style={{ width:34, height:34, borderRadius:10, background:'var(--white)', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <IconProfile size={18} color="var(--navy)"/>
            </button>
          </div>
        </div>

        {/* Mode card */}
        <div onClick={() => router.push('/profile')}
          style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'11px 13px', marginBottom:12, boxShadow:'var(--shadow-sm)', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:mode.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{mode.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>week mode</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)' }}>{mode.name} — {mode.desc}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity:.3 }}><path d="M6 9L12 15L18 9" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>

        {/* Mama banner */}
        <div onClick={() => router.push('/input')}
          style={{ background:hasPlan?`${mode.color}20`:'var(--navy)', border:'2px solid var(--navy)', borderRadius:16, padding:'11px 13px', marginBottom:14, display:'flex', gap:10, alignItems:'center', cursor:'pointer' }}>
          <MamaMini size={40}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:800, color:hasPlan?'var(--muted)':'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>mama says</div>
            <div style={{ fontSize:12, fontWeight:700, color:hasPlan?'var(--navy)':'rgba(255,255,255,0.9)', lineHeight:1.6 }}>
              {hasPlan ? `ur week is planned 💕 tap to start a new one` : `tap here and mama sorts ur whole week out 🍳`}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity:.35, flexShrink:0 }}><path d="M9 6L15 12L9 18" stroke={hasPlan?'var(--navy)':'#fff'} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>

        {/* Week grid */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:9 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>this week</div>
          <button onClick={() => router.push('/planner')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>planner →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:14 }}>
          {DSHRT.map((d,i) => {
            const dayMeals = Object.values(assigned[DAYS[i]]||{}).filter(Boolean)
            const isToday  = i===0
            return (
              <div key={d} onClick={() => openDay(DAYS[i])}
                style={{ background:isToday?mode.color:'var(--white)', border:`2px solid ${dayMeals.length?'var(--navy)':'var(--border)'}`, borderRadius:11, padding:'5px 2px', textAlign:'center', cursor:'pointer', minHeight:64 }}>
                <div style={{ fontSize:9, fontWeight:800, color:isToday?'var(--navy)':'var(--muted)', marginBottom:1 }}>{d}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:11, fontWeight:900, color:isToday?'var(--navy)':'var(--muted)', marginBottom:2 }}>{14+i}</div>
                {dayMeals.length>0 ? dayMeals.slice(0,3).map((r,j)=><div key={j} style={{ fontSize:11,lineHeight:1.1 }}>{r.flag}</div>) : <div style={{ fontSize:9,color:'var(--border)' }}>·</div>}
              </div>
            )
          })}
        </div>

        {/* Shopping preview */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:9 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>shopping list</div>
            {pendingShop>0 && <div style={{ background:'var(--coral)', color:'#fff', width:17, height:17, borderRadius:'50%', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--navy)' }}>{pendingShop}</div>}
          </div>
          <button onClick={() => router.push('/grocery')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:mode.color, fontFamily:'Nunito, sans-serif' }}>see all →</button>
        </div>
        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'8px 0', marginBottom:14, boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
          {shopList.slice(0,4).map((item,i) => (
            <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 13px', borderBottom:i<3?'1px solid var(--border)':'none' }}>
              <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${item.done?'var(--mint)':'var(--border)'}`, background:item.done?'var(--mint)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {item.done && <IconCheck size={10} color="#fff"/>}
              </div>
              <div style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--navy)', textDecoration:item.done?'line-through':'none' }}>{item.e} {item.n}</div>
              <div style={{ fontSize:12, fontWeight:900, color:'var(--navy)', fontFamily:'Fraunces, serif' }}>${item.p.toFixed(2)}</div>
            </div>
          ))}
          <button onClick={() => router.push('/grocery')} style={{ width:'100%', padding:'9px 13px', background:'var(--paper)', border:'none', cursor:'pointer', fontSize:11, fontWeight:800, color:'var(--muted)', fontFamily:'Nunito, sans-serif', textAlign:'center' }}>
            + {shopList.length-4} more items
          </button>
        </div>

        {/* Food tip */}
        <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:14, padding:'11px 13px', marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>💡 food tip</div>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{FOOD_TIPS[tipIdx].emoji}</span>
            <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.65, fontWeight:600 }}>{FOOD_TIPS[tipIdx].tip}</div>
          </div>
          <div style={{ display:'flex', gap:3, marginTop:7 }}>
            {FOOD_TIPS.map((_,i) => <div key={i} onClick={() => setTipIdx(i)} style={{ width:i===tipIdx?18:5, height:4, borderRadius:2, background:i===tipIdx?'var(--navy)':'var(--border)', cursor:'pointer', transition:'all .3s' }}/>)}
          </div>
        </div>

        {/* Plan CTA */}
        <button onClick={() => router.push('/input')} className="retro-btn glow-btn"
          style={{ width:'100%', padding:15, background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, boxShadow:'var(--shadow-md)', marginBottom:10 }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          + plan this week ✨
        </button>

        {/* Cook together — coming soon */}
        <button onClick={() => router.push('/together')}
          style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--border)', background:'var(--white)', color:'var(--muted)', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8, position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', top:8, right:10, background:'var(--navy)', color:'var(--yellow)', fontSize:8, fontWeight:900, padding:'2px 7px', borderRadius:6, letterSpacing:1 }}>SOON</span>
          👯 cook together with housemates
        </button>

        <div style={{ height:16 }}/>
      </div>

      {dayPopup && !recipePopup && <DayPopup day={dayPopup.day} meals={dayPopup.meals} onClose={() => setDayPopup(null)} onOpenRecipe={r => setRecipePopup(r)}/>}
      {recipePopup && <RecipeModal recipe={recipePopup} onClose={() => setRecipePopup(null)} mc={WEEK_MODES.find(m=>m.key===recipePopup.mode)?.color||mode.color} saved={savedRecipes.includes(recipePopup.id)} onSave={() => toggleSaved(recipePopup.id)}/>}

      <NavBar active="home"/>
    </div>
  )
}
