'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { IconChevLeft } from '@/components/Icons'
import { MamaMini } from '@/components/mama/MamaVariants'

const INGREDIENTS = ['Eggs','Rice','Pasta','Bread','Milk','Cheese','Chicken','Beef mince','Tomatoes','Onion','Garlic','Potato','Broccoli','Corn','Carrot','Canned beans','Tuna','Avocado','Lemon','Soy sauce']
const CUISINES = ['Anything','Asian','Mediterranean','Mexican','Italian','Middle Eastern','Indian','Healthy bowls']
const DIETARY  = ['No restrictions','Vegetarian','Vegan','Halal','Kosher','Gluten-free','Dairy-free']
const WAIT_MSGS = ['scanning ur fridge...','matching ur week mode...','checking nutrition balance...','calculating fuel scores...','almost ready!']

export default function InputPage() {
  const router = useRouter()
  const { setMealPlan, weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]

  const [selIng, setSelIng]   = useState([])
  const [mpd, setMpd]         = useState(3)
  const [budget, setBudget]   = useState('')
  const [time, setTime]       = useState('')
  const [selC, setSelC]       = useState(['Anything'])
  const [selD, setSelD]       = useState(['No restrictions'])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [waitMsg, setWaitMsg] = useState(WAIT_MSGS[0])

  const toggle = (val, set) => set(p => p.includes(val) ? p.filter(x=>x!==val) : [...p,val])

  const handleGenerate = () => {
    setLoading(true); setProgress(0)
    let pct=0, si=0
    const iv = setInterval(() => {
      pct += Math.random()*16+8; if(pct>96) pct=96
      setProgress(pct); setWaitMsg(WAIT_MSGS[Math.min(si++,WAIT_MSGS.length-1)])
    }, 420)
    setTimeout(() => {
      clearInterval(iv); setProgress(100)
      // filter recipes by mode if possible
      const filtered = RECIPES.filter(r => r.mode === weekMode)
      setMealPlan(filtered.length >= 4 ? RECIPES : RECIPES)
      setTimeout(() => router.push('/recipe'), 380)
    }, 2400)
  }

  const chip = (val, active, onClick, activeColor=mode.color) => (
    <button key={val} onClick={onClick} style={{
      padding:'7px 13px', borderRadius:20, fontSize:12, fontWeight:700,
      fontFamily:'Nunito, sans-serif', cursor:'pointer',
      border:`2px solid ${active ? 'var(--navy)':'var(--border)'}`,
      background:active ? activeColor:'var(--white)',
      color:active ? 'var(--navy)':'var(--muted)',
      boxShadow:active ? 'var(--shadow-sm)':'none',
      transition:'all .12s',
    }}>{val}</button>
  )

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
      <div style={{ position:'relative', width:150, height:150, margin:'0 auto 24px' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="60" fill="none" stroke="var(--yellow-l)" strokeWidth="4" className="pulse-ring1" />
          <circle cx="75" cy="75" r="45" fill="none" stroke="var(--yellow-l)" strokeWidth="4" className="pulse-ring2" />
        </svg>
        <div className="mama-cook" style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>🍳</div>
      </div>
      <h2 style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, marginBottom:8, color:'var(--navy)' }}>mama is cooking<br/>something up...</h2>
      <p style={{ color:'var(--muted)', fontSize:13, fontWeight:600, marginBottom:22 }}>{waitMsg}</p>
      <div style={{ width:'100%', height:10, background:'var(--paper)', border:'2px solid var(--navy)', borderRadius:6, overflow:'hidden', marginBottom:28 }}>
        <div style={{ height:'100%', background:mode.color, width:`${progress}%`, transition:'width .5s ease' }} />
      </div>
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8 }}>
        <div className="skel" style={{ height:64 }} />
        <div className="skel" style={{ height:64 }} />
        <div className="skel" style={{ height:64, width:'72%' }} />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', paddingBottom:100 }}>
      {/* Header */}
      <div style={{ padding:'20px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => router.push('/home')} className="retro-btn" style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
          <IconChevLeft size={16} color="var(--navy)" /> home
        </button>
        <div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)' }}>what's in ur fridge?</h2>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
            <div style={{ width:16, height:16, borderRadius:4, background:mode.color, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9 }}>{mode.emoji}</div>
            <span style={{ fontSize:10, color:'var(--muted)', fontWeight:700 }}>Mode: {mode.name}</span>
          </div>
        </div>
      </div>

      {/* Mama bubble */}
      <div style={{ padding:'14px 20px', display:'flex', gap:12, alignItems:'center' }}>
        <MamaMini size={46} />
        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:'16px 16px 16px 4px', padding:'10px 14px', fontSize:12, color:'var(--navy)', lineHeight:1.6, fontWeight:600, boxShadow:'var(--shadow-sm)' }}>
          tell mama what u have and she'll plan meals for ur {mode.name} week!
        </div>
      </div>

      <div style={{ padding:'4px 20px' }}>
        {/* Ingredients */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>what's in ur fridge</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {INGREDIENTS.map(ing => chip(ing, selIng.includes(ing), () => toggle(ing,setSelIng)))}
          </div>
        </div>

        {/* Budget + Time */}
        <div style={{ display:'flex', gap:12, marginBottom:18 }}>
          {[['budget per meal ($)',budget,setBudget,'8'],['time per meal (min)',time,setTime,'20']].map(([lbl,val,setter,ph]) => (
            <div key={lbl} style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{lbl}</div>
              <input type="number" placeholder={ph} value={val} onChange={e=>setter(e.target.value)} style={{ width:'100%', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:10, padding:'12px 14px', fontSize:14, fontFamily:'Nunito, sans-serif', outline:'none', fontWeight:700, color:'var(--navy)', boxShadow:'var(--shadow-sm)' }} />
            </div>
          ))}
        </div>

        {/* Meals per day */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>meals per day</div>
          <div style={{ display:'flex', gap:8 }}>
            {[2,3,4,5].map(n => (
              <button key={n} onClick={() => setMpd(n)} style={{ flex:1, padding:'11px 0', borderRadius:10, fontSize:16, fontWeight:900, fontFamily:'Nunito, sans-serif', cursor:'pointer', border:'2px solid var(--navy)', background:mpd===n ? 'var(--navy)':'var(--white)', color:mpd===n ? mode.color:'var(--navy)', boxShadow:mpd===n ? 'var(--shadow-sm)':'none', transition:'all .12s' }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>cuisine vibe</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {CUISINES.map(c => chip(c, selC.includes(c), () => toggle(c,setSelC), 'var(--yellow-l)'))}
          </div>
        </div>

        {/* Dietary */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>dietary needs</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {DIETARY.map(d => chip(d, selD.includes(d), () => toggle(d,setSelD), 'var(--mint-l)'))}
          </div>
        </div>
      </div>

      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'12px 20px 28px', background:'var(--cream)', borderTop:'2px solid var(--navy)' }}>
        <button onClick={handleGenerate} style={{ width:'100%', padding:15, borderRadius:12, border:'2px solid var(--navy)', background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', transition:'transform .1s, box-shadow .1s' }}
          onMouseDown={e=>{ e.currentTarget.style.transform='translate(2px,3px)'; e.currentTarget.style.boxShadow='0 0 0 var(--navy)' }}
          onMouseUp={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow-md)' }}
        >cook something up 🍳</button>
      </div>
    </div>
  )
}
