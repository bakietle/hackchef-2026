'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { IconChevLeft, IconHeart, IconClock, IconRefresh, IconHome, IconCalendar, IconCart, IconProfile } from '@/components/Icons'
import { MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import NomsterLogo from '@/components/NomsterLogo'

function NutriTag({ tag }) {
  const map = {
    protein:     { icon:'🥩', label:'Protein',   bg:'#FFE8E5', color:'#CC3322' },
    veggie:      { icon:'🥗', label:'Veggie',    bg:'#E0F5EC', color:'#2A7A4A' },
    carb:        { icon:'🍞', label:'Carbs',     bg:'#FFF8DC', color:'#8A6200' },
    quick:       { icon:'⚡', label:'Quick',     bg:'#F0FAC0', color:'#5A7A00' },
    hearty:      { icon:'🫀', label:'Hearty',    bg:'#FFE8D6', color:'#8A4A00' },
    balanced:    { icon:'⚖️', label:'Balanced',  bg:'#EDE0FF', color:'#5A3A9A' },
    rich:        { icon:'🧈', label:'Rich',      bg:'#FFF8DC', color:'#8A6200' },
    umami:       { icon:'🍄', label:'Umami',     bg:'#F0E8D8', color:'#6A4A2A' },
    fun:         { icon:'🎉', label:'Fun',       bg:'#F0FAC0', color:'#5A7A00' },
    'meal-prep': { icon:'📦', label:'Meal-Prep', bg:'#EAF4FB', color:'#2A5A8A' },
  }
  const t = map[tag] || { icon:'•', label:tag, bg:'var(--paper)', color:'var(--muted)' }
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, background:t.bg, color:t.color, padding:'3px 8px', borderRadius:6, fontSize:10, fontWeight:800, border:`1.5px solid ${t.color}20` }}>
      {t.icon} {t.label}
    </span>
  )
}

function RecipeModal({ recipe, onClose, modeColor, saved, onToggleSave }) {
  const [fw, setFw] = useState(0)
  useEffect(() => { const t = setTimeout(() => setFw(recipe.fuel), 80); return () => clearTimeout(t) }, [recipe])

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.65)', zIndex:100, display:'flex', alignItems:'flex-end', backdropFilter:'blur(4px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'24px 24px 0 0', border:'2px solid var(--navy)', borderBottom:'none', padding:'22px 20px 40px', width:'100%', maxHeight:'92%', overflowY:'auto', animation:'slideUp .3s' }}>
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 18px' }} />

        {/* Header */}
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
          <div style={{ width:64, height:64, background:`${modeColor}30`, border:'2px solid var(--navy)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, flexShrink:0, boxShadow:'var(--shadow-sm)', animation:'zoomIn .4s' }}>
            {recipe.flag}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', marginBottom:2 }}>{recipe.name}</div>
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:8, fontWeight:600 }}>{recipe.cuisine}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              <span style={{ background:'var(--navy)', color:modeColor, padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)' }}>
                {WEEK_MODES.find(m => m.key===recipe.mode)?.emoji} {WEEK_MODES.find(m => m.key===recipe.mode)?.name || recipe.mode}
              </span>
              <span style={{ background:'var(--yellow-l)', color:'var(--navy)', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', gap:4 }}>
                <IconClock size={11} color="var(--navy)" /> {recipe.time}min
              </span>
              <span style={{ background:'var(--mint-l)', color:'var(--navy)', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:800, border:'1.5px solid var(--navy)' }}>${recipe.cost}</span>
            </div>
          </div>
          <button onClick={onToggleSave}
            style={{ width:40, height:40, borderRadius:12, border:'2px solid var(--navy)', background:saved?'var(--coral-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'var(--shadow-sm)' }}>
            <IconHeart size={18} color={saved?'var(--coral)':'var(--border)'} />
          </button>
        </div>

        {/* Nutrition tags */}
        {recipe.tags?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
            {recipe.tags.map(t => <NutriTag key={t} tag={t} />)}
          </div>
        )}

        {/* Fun fact */}
        <div style={{ background:'var(--navy)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--yellow)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>✨ fun fact</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.65, fontWeight:500 }}>{recipe.funFact}</div>
        </div>

        {/* Fuel bar */}
        <div style={{ background:`${modeColor}20`, border:'2px solid var(--navy)', borderRadius:14, padding:14, marginBottom:14, boxShadow:'var(--shadow-sm)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>power level</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)' }}>{recipe.fuel}</div>
          </div>
          <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:5, overflow:'hidden' }}>
            <div style={{ height:'100%', background:modeColor, width:`${fw}%`, transition:'width .9s ease' }} />
          </div>
          <div style={{ fontSize:11, color:'var(--muted)', marginTop:6, fontWeight:600 }}>
            {recipe.fuel>=88 ? 'excellent fuel — gonna smash it! 🚀' : recipe.fuel>=80 ? 'solid fuel — good energy ✨' : 'decent fuel — works for now 👌'}
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

        {/* Mama's tips */}
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

        {/* Missing items */}
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

export default function RecipePage() {
  const router = useRouter()
  const { recipes, weekMode, savedRecipes, toggleSaved } = usePlannerStore()
  const mode    = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const [popup,  setPopup]  = useState(null)
  const [offset, setOffset] = useState(0)

  const all       = recipes.length ? recipes : RECIPES
  const displayed = all.map((_,i) => all[(i+offset) % all.length]).slice(0,7)

  const NavBar = () => (
    <div style={{ display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)' }}>
      {[
        { icon:<IconHome size={22} color="var(--muted)" />,     label:'home',    path:'/home'    },
        { icon:<IconCalendar size={22} color="var(--muted)" />, label:'planner', path:'/planner' },
        { icon:<IconCart size={22} color="var(--muted)" />,     label:'grocery', path:'/grocery' },
        { icon:<IconHeart size={22} color="var(--muted)" />,    label:'saved',   path:'/saved'   },
        { icon:<IconProfile size={22} color="var(--muted)" />,  label:'profile', path:'/profile' },
      ].map(nav => (
        <button key={nav.label} onClick={() => router.push(nav.path)}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:'var(--muted)', padding:'0 8px', opacity:0.45 }}>
          {nav.icon}{nav.label}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column' }}>
      <NotifBanner />
      <div style={{ height:4, background:mode.color }} />

      <div style={{ padding:'16px 20px 10px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => router.push('/input')} className="retro-btn"
            style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
            <IconChevLeft size={16} color="var(--navy)" /> back
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)' }}>mama picked these</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, display:'flex', alignItems:'center', gap:4, marginTop:1 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:mode.color, display:'inline-block', border:'1.5px solid var(--navy)' }} />
              {mode.name} mode · tap any for full recipe + fun fact
            </div>
          </div>
          <NomsterLogo size="sm" animate={false}/>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'4px 20px 8px' }}>
        {displayed.map((r,i) => (
          <div key={`${r.id}-${i}`} onClick={() => setPopup(r)} className="slot-hover"
            style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:14, display:'flex', alignItems:'center', gap:12, marginBottom:10, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ width:54, height:54, background:`${mode.color}25`, border:'2px solid var(--navy)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
              {r.flag}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)', marginBottom:1 }}>{r.name}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginBottom:5, fontWeight:600 }}>{r.cuisine} · {r.time}min · ${r.cost}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <span style={{ fontSize:10, fontWeight:800, color:'var(--navy)' }}>{r.fuel}</span>
                <div style={{ flex:1, height:7, background:'var(--paper)', border:'1.5px solid var(--border)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:mode.color, width:`${r.fuel}%` }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {r.tags?.slice(0,2).map(t => <NutriTag key={t} tag={t} />)}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <button onClick={e => { e.stopPropagation(); toggleSaved(r.id) }}
                style={{ width:32, height:32, borderRadius:9, border:'2px solid var(--navy)', background:savedRecipes.includes(r.id)?'var(--coral-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconHeart size={14} color={savedRecipes.includes(r.id)?'var(--coral)':'var(--border)'} />
              </button>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        ))}
        <div style={{ height:8 }} />
      </div>

      <div style={{ padding:'12px 20px 16px', borderTop:'2px solid var(--navy)', background:'var(--cream)', display:'flex', gap:10, flexShrink:0 }}>
        <button onClick={() => setOffset(p => (p+4) % all.length)} className="retro-btn"
          style={{ flex:1, padding:14, background:'var(--white)', color:'var(--navy)', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <IconRefresh size={14} color="var(--navy)" /> not feeling it
        </button>
        <button onClick={() => router.push('/planner/build')}
          style={{ flex:1, padding:14, borderRadius:12, border:'2px solid var(--navy)', background:'var(--yellow)', color:'var(--navy)', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)' }}>
          plan my week →
        </button>
      </div>

      <NavBar />

      {popup && (
        <RecipeModal recipe={popup} onClose={() => setPopup(null)}
          modeColor={WEEK_MODES.find(m=>m.key===popup.mode)?.color || mode.color}
          saved={savedRecipes.includes(popup.id)}
          onToggleSave={() => toggleSaved(popup.id)} />
      )}
    </div>
  )
}
