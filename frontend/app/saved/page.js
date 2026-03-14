'use client'
import NomsterLogo from '@/components/NomsterLogo'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconClock } from '@/components/Icons'
import { MamaHappy, MamaShocked } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'

function RecipeModal({ recipe, onClose, modeColor, saved, onToggleSave }) {
  const [fw, setFw] = useState(0)
  if (typeof window !== 'undefined' && fw === 0) setTimeout(() => setFw(recipe.fuel), 80)
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:100, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'22px 20px 36px', width:'100%', maxHeight:'88%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }} />
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
          <div style={{ width:62, height:62, background:`${modeColor}30`, border:'2px solid var(--navy)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, flexShrink:0 }}>{recipe.flag}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', marginBottom:2 }}>{recipe.name}</div>
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:8 }}>{recipe.cuisine}</div>
            <div style={{ display:'flex', gap:6 }}>
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
        <div style={{ background:'var(--navy)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:14 }}>
          {[['kcal',recipe.cal,'🔥'],['protein',recipe.pro,'🥩'],['carbs',recipe.carb,'🍞'],['fat',recipe.fat,'💧']].map(([k,v,i]) => (
            <div key={k} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:9, padding:'9px 5px', textAlign:'center' }}>
              <div>{i}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--navy)' }}>{v}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase' }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:9 }}>how to make it</div>
        {recipe.steps.map((s,i) => (
          <div key={i} style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:9 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:modeColor, border:'2px solid var(--navy)', color:'var(--navy)', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:13, color:'var(--navy)', lineHeight:1.65, paddingTop:2, fontWeight:500 }}>{s}</div>
          </div>
        ))}
        {recipe.tips?.length > 0 && (
          <div style={{ background:'var(--mint-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', marginBottom:7, textTransform:'uppercase', letterSpacing:1 }}>💡 mama's tips</div>
            {recipe.tips.map((t,i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom: i<recipe.tips.length-1?5:0 }}>
                <div style={{ width:16, height:16, borderRadius:4, background:'var(--navy)', color:'var(--mint)', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.6, fontWeight:500 }}>{t}</div>
              </div>
            ))}
          </div>
        )}
        {recipe.miss?.length > 0 && (
          <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'12px 14px', marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--navy)', marginBottom:5 }}>🛒 still need to buy</div>
            <div style={{ fontSize:13, color:'var(--navy)', fontWeight:500 }}>{recipe.miss.join(', ')}</div>
          </div>
        )}
        <button onClick={onClose} className="retro-btn" style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13, marginTop:8 }}>close</button>
      </div>
    </div>
  )
}

export default function SavedPage() {
  const router = useRouter()
  const { savedRecipes, toggleSaved, weekMode } = usePlannerStore()
  const mode   = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const [popup, setPopup] = useState(null)
  const [filter, setFilter] = useState('all')

  const saved = RECIPES.filter(r => savedRecipes.includes(r.id))
  const filtered = filter === 'all' ? saved
    : saved.filter(r => WEEK_MODES.find(m=>m.key===r.mode)?.key === filter)

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { icon:<IconHome size={22} />,     label:'home',    path:'/home'    },
        { icon:<IconCalendar size={22} />, label:'planner', path:'/planner' },
        { icon:<IconCart size={22} />,     label:'grocery', path:'/grocery' },
        { icon:<IconHeart size={22} />,    label:'saved',   path:'/saved',  active:true },
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

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>saved recipes 💛</h2>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {saved.length > 0 && (
              <div style={{ background:'var(--navy)', color:'var(--yellow)', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:800 }}>{saved.length} saved</div>
            )}
            <NomsterLogo size="sm" animate={false}/>
          </div>
        </div>

        {/* Mama */}
        <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:14, display:'flex', gap:10, alignItems:'center' }}>
          {saved.length === 0 ? <MamaShocked size={36} /> : <MamaHappy size={36} />}
          <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', lineHeight:1.6 }}>
            {saved.length === 0
              ? "no saved recipes yet! tap 💛 on any recipe to save it here"
              : `u saved ${saved.length} recipe${saved.length>1?'s':''}! mama approves 💕`}
          </div>
        </div>

        {/* Filter by mode */}
        {saved.length > 0 && (
          <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, marginBottom:12, scrollbarWidth:'none' }}>
            <button onClick={() => setFilter('all')} style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:800, fontFamily:'Nunito, sans-serif', cursor:'pointer', border:'2px solid var(--navy)', background:filter==='all'?'var(--navy)':'var(--white)', color:filter==='all'?'var(--yellow)':'var(--muted)' }}>
              All ({saved.length})
            </button>
            {WEEK_MODES.filter(m => saved.some(r=>r.mode===m.key)).map(m => (
              <button key={m.key} onClick={() => setFilter(m.key)}
                style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:800, fontFamily:'Nunito, sans-serif', cursor:'pointer', border:`2px solid ${filter===m.key?'var(--navy)':'var(--border)'}`, background:filter===m.key?m.color:'var(--white)', color:filter===m.key?'var(--navy)':'var(--muted)' }}>
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {saved.length === 0 && (
          <div style={{ textAlign:'center', padding:'36px 20px' }}>
            <div style={{ fontSize:52, marginBottom:10 }}>🍽️</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:16, fontWeight:900, color:'var(--navy)', marginBottom:6 }}>nothing saved yet</div>
            <div style={{ fontSize:13, color:'var(--muted)', fontWeight:600, marginBottom:24 }}>browse recipes and tap 💛 to save them here</div>
            <button onClick={() => router.push('/input')} className="retro-btn"
              style={{ padding:'12px 28px', background:'var(--yellow)', color:'var(--navy)', fontSize:13, width:'auto', display:'inline-block' }}>
              find recipes →
            </button>
          </div>
        )}

        {/* Saved list */}
        {filtered.map(r => {
          const rMode = WEEK_MODES.find(m => m.key===r.mode) || WEEK_MODES[0]
          return (
            <div key={r.id} onClick={() => setPopup(r)} className="slot-hover"
              style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:14, display:'flex', alignItems:'center', gap:12, marginBottom:10, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:52, height:52, background:`${rMode.color}25`, border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{r.flag}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)', marginBottom:1 }}>{r.name}</div>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginBottom:5 }}>{r.cuisine} · {r.time}min · ${r.cost}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:'var(--navy)' }}>{r.fuel}</span>
                  <div style={{ flex:1, height:6, background:'var(--paper)', border:'1.5px solid var(--border)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:rMode.color, width:`${r.fuel}%` }} />
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'center' }}>
                <button onClick={e => { e.stopPropagation(); toggleSaved(r.id) }}
                  style={{ width:32, height:32, borderRadius:9, border:'2px solid var(--navy)', background:'var(--coral-l)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <IconHeart size={14} color="var(--coral)" />
                </button>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>
          )
        })}

        <div style={{ height:16 }} />
      </div>

      {popup && (
        <RecipeModal recipe={popup} onClose={() => setPopup(null)}
          modeColor={WEEK_MODES.find(m=>m.key===popup.mode)?.color||mode.color}
          saved={savedRecipes.includes(popup.id)} onToggleSave={() => toggleSaved(popup.id)} />
      )}
      <NavBar />
    </div>
  )
}
