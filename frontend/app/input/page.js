'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { IconChevLeft } from '@/components/Icons'
import { MamaMini } from '@/components/mama/MamaVariants'
import NomsterLogo from '@/components/NomsterLogo'

const CATS = [
  { label:'Protein', emoji:'🥩', items:['Eggs','Chicken','Beef mince','Tuna','Tofu','Prawns'] },
  { label:'Carbs',   emoji:'🍚', items:['Rice','Pasta','Bread','Potato','Noodles','Oats'] },
  { label:'Veg',     emoji:'🥦', items:['Tomatoes','Onion','Garlic','Broccoli','Spinach','Carrot','Corn','Avocado','Mushrooms'] },
  { label:'Dairy',   emoji:'🧀', items:['Milk','Cheese','Butter','Yoghurt','Cream'] },
  { label:'Pantry',  emoji:'🫙', items:['Soy sauce','Olive oil','Canned beans','Lemon','Canned tomatoes','Fish sauce'] },
]
const CUISINES  = ['Anything 🌍','Asian 🍜','Mediterranean 🫓','Mexican 🌮','Italian 🍕','Middle Eastern 🥙','Indian 🍛','Healthy 🥗']
const DIETARY   = ['No restrictions','Vegetarian','Vegan','Halal','Gluten-free','Dairy-free']
const WAIT_MSGS = ['scanning ur fridge...','matching ur week mode...','checking nutrition balance...','calculating fuel scores...','almost ready! 🍳']

export default function InputPage() {
  const router = useRouter()
  const { setMealPlan, weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  const [selIng,  setSelIng]  = useState([])
  const [budget,  setBudget]  = useState('')
  const [time,    setTime]    = useState('')
  const [selC,    setSelC]    = useState(['Anything 🌍'])
  const [selD,    setSelD]    = useState(['No restrictions'])
  const [loading, setLoading] = useState(false)
  const [pct,     setPct]     = useState(0)
  const [msg,     setMsg]     = useState(WAIT_MSGS[0])
  const [cat,     setCat]     = useState('Protein')

  const tog  = (v,set) => set(p => p.includes(v) ? p.filter(x=>x!==v) : [...p,v])
  const togC = v => setSelC(p => p.includes(v) ? p.filter(x=>x!==v) : [...p,v])

  const chip = (val, active, onClick, ac) => (
    <button key={val} onClick={onClick} style={{ padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:700, fontFamily:'Nunito, sans-serif', cursor:'pointer', border:`2px solid ${active?'var(--navy)':'var(--border)'}`, background:active?(ac||mode.color):'var(--white)', color:active?'var(--navy)':'var(--muted)', boxShadow:active?'var(--shadow-sm)':'none', transition:'all .12s' }}>{val}</button>
  )

  const generate = () => {
    setLoading(true); setPct(0)
    let p=0, si=0
    const iv = setInterval(() => { p+=Math.random()*16+8; if(p>96)p=96; setPct(p); setMsg(WAIT_MSGS[Math.min(si++,4)]) }, 420)
    setTimeout(() => { clearInterval(iv); setPct(100); setMealPlan(RECIPES); setTimeout(() => router.push('/recipe'), 380) }, 2400)
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
      <div style={{ position:'absolute', top:20, left:20 }}><NomsterLogo size="sm" animate={false}/></div>
      <div style={{ position:'relative', width:150, height:150, margin:'0 auto 24px' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="60" fill="none" stroke="var(--yellow-l)" strokeWidth="4" className="pulse-ring1"/>
          <circle cx="75" cy="75" r="45" fill="none" stroke="var(--yellow-l)" strokeWidth="3" className="pulse-ring2"/>
        </svg>
        <div className="mama-cook" style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>🍳</div>
      </div>
      <h2 style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, marginBottom:6, color:'var(--navy)' }}>mama is cooking<br/>something up...</h2>
      <p style={{ fontFamily:'Nunito, sans-serif', color:'var(--muted)', fontSize:13, fontWeight:700, marginBottom:22 }}>{msg}</p>
      <div style={{ width:'100%', height:10, background:'var(--paper)', border:'2px solid var(--navy)', borderRadius:6, overflow:'hidden', marginBottom:28 }}>
        <div style={{ height:'100%', background:mode.color, width:`${pct}%`, transition:'width .5s ease' }}/>
      </div>
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8 }}>
        {[100,100,72].map((w,i) => <div key={i} className="skel" style={{ height:60, width:`${w}%` }}/>)}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', paddingBottom:100 }}>
      <div style={{ height:4, background:mode.color }}/>
      <div style={{ padding:'14px 20px 12px', display:'flex', alignItems:'center', gap:12, borderBottom:'1.5px solid var(--border)' }}>
        <button onClick={() => router.push('/home')} className="retro-btn" style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
          <IconChevLeft size={16} color="var(--navy)"/> home
        </button>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)' }}>what's in ur fridge?</h2>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:1 }}>
            <div style={{ width:13, height:13, borderRadius:4, background:mode.color, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8 }}>{mode.emoji}</div>
            <span style={{ fontSize:10, color:'var(--muted)', fontWeight:700 }}>{mode.name} mode</span>
          </div>
        </div>
        <NomsterLogo size="sm" animate={false}/>
      </div>

      <div style={{ padding:'10px 20px', display:'flex', gap:10, alignItems:'center' }}>
        <MamaMini size={38}/>
        <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:'13px 13px 13px 4px', padding:'8px 12px', fontSize:12, color:'var(--navy)', lineHeight:1.65, fontWeight:600, boxShadow:'var(--shadow-sm)' }}>
          tell mama what u have and she'll plan the perfect {mode.name} week! 💕
        </div>
      </div>

      <div style={{ padding:'0 20px' }}>

        {/* Snap fridge button */}
        <button onClick={() => router.push('/mama?to=snap')}
          style={{ width:'100%', padding:13, borderRadius:12, marginBottom:14, border:'2px solid var(--navy)', background:'var(--navy)', color:'var(--yellow)', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'var(--shadow-md)' }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          📸 snap ur fridge — mama detects everything
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ flex:1, height:1.5, background:'var(--border)'}}/>
          <span style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:800, color:'var(--muted)' }}>or pick manually</span>
          <div style={{ flex:1, height:1.5, background:'var(--border)'}}/>
        </div>

        {/* Fridge categories */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:9 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>what's in ur fridge</div>
            {selIng.length>0 && <span style={{ background:mode.color, color:'var(--navy)', padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:800 }}>{selIng.length} selected</span>}
          </div>
          <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, marginBottom:9, scrollbarWidth:'none' }}>
            {CATS.map(c => (
              <button key={c.label} onClick={() => setCat(c.label)} style={{ flexShrink:0, padding:'6px 13px', borderRadius:20, fontSize:12, fontWeight:800, fontFamily:'Nunito, sans-serif', cursor:'pointer', border:'2px solid var(--navy)', background:cat===c.label?'var(--navy)':'var(--white)', color:cat===c.label?mode.color:'var(--muted)', boxShadow:cat===c.label?'var(--shadow-sm)':'none', transition:'all .12s' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'11px 13px', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {CATS.find(c=>c.label===cat)?.items.map(item => chip(item, selIng.includes(item), () => tog(item,setSelIng)))}
            </div>
          </div>
          {selIng.length>0 && (
            <div style={{ marginTop:9, display:'flex', flexWrap:'wrap', gap:5 }}>
              {selIng.map(item => <span key={item} onClick={() => tog(item,setSelIng)} style={{ display:'inline-flex', alignItems:'center', gap:4, background:mode.color, color:'var(--navy)', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:800, cursor:'pointer', border:'1.5px solid var(--navy)' }}>{item} ✕</span>)}
            </div>
          )}
        </div>

        {/* Budget + time */}
        <div style={{ display:'flex', gap:12, marginBottom:16 }}>
          {[['budget per meal ($)',budget,setBudget,'8'],['time available (min)',time,setTime,'20']].map(([lbl,val,setter,ph]) => (
            <div key={lbl} style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:7 }}>{lbl}</div>
              <input type="number" placeholder={ph} value={val} onChange={e=>setter(e.target.value)} style={{ width:'100%', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:10, padding:'11px 13px', fontSize:14, fontFamily:'Nunito, sans-serif', outline:'none', fontWeight:700, color:'var(--navy)' }}/>
            </div>
          ))}
        </div>

        {/* Cuisine */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:9 }}>cuisine vibe</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>{CUISINES.map(c => chip(c,selC.includes(c),()=>togC(c),'var(--yellow-l)'))}</div>
        </div>

        {/* Dietary */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:9 }}>dietary needs</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>{DIETARY.map(d => chip(d,selD.includes(d),()=>tog(d,setSelD),'var(--mint-l)'))}</div>
        </div>
      </div>

      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'12px 20px 28px', background:'var(--cream)', borderTop:'2px solid var(--navy)' }}>
        <button onClick={generate} className="retro-btn" style={{ width:'100%', padding:15, background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, boxShadow:'var(--shadow-md)' }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          cook something up 🍳
        </button>
      </div>
    </div>
  )
}
