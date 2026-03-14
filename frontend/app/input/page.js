'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { MamaMini } from '@/components/mama/MamaVariants'
import NomsterLogo from '@/components/NomsterLogo'

const FRIDGE_CATEGORIES = [
  { label:'Protein', emoji:'🥩', items:['Eggs','Chicken','Beef mince','Tuna','Tofu','Prawns'] },
  { label:'Carbs',   emoji:'🍚', items:['Rice','Pasta','Bread','Potato','Noodles','Oats'] },
  { label:'Veg',     emoji:'🥦', items:['Tomatoes','Onion','Garlic','Broccoli','Spinach','Carrot','Corn','Avocado','Mushrooms'] },
  { label:'Dairy',   emoji:'🧀', items:['Milk','Cheese','Butter','Yoghurt','Cream'] },
  { label:'Pantry',  emoji:'🫙', items:['Soy sauce','Olive oil','Canned beans','Lemon','Canned tomatoes','Fish sauce'] },
]
const CUISINES = ['Anything 🌍','Asian 🍜','Mediterranean 🫓','Mexican 🌮','Italian 🍕','Middle Eastern 🥙','Indian 🍛','Healthy 🥗']
const DIETARY  = ['No restrictions','Vegetarian','Vegan','Halal','Gluten-free','Dairy-free']
const WAIT_MSGS = ['scanning ur fridge...','matching ur week mode...','checking nutrition balance...','calculating fuel scores...','almost ready! 🍳']

export default function InputPage() {
  const router = useRouter()
  const { setMealPlan, weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const [selIng,setSelIng]=useState([])
  const [budget,setBudget]=useState('')
  const [time,setTime]=useState('')
  const [selC,setSelC]=useState(['Anything 🌍'])
  const [selD,setSelD]=useState(['No restrictions'])
  const [loading,setLoading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [waitMsg,setWaitMsg]=useState(WAIT_MSGS[0])
  const [openCat,setOpenCat]=useState('Protein')
  const toggle=(val,set)=>set(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val])
  const toggleC=(val)=>setSelC(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val])
  const handleGenerate=()=>{
    setLoading(true);setProgress(0)
    let pct=0,si=0
    const iv=setInterval(()=>{pct+=Math.random()*16+8;if(pct>96)pct=96;setProgress(pct);setWaitMsg(WAIT_MSGS[Math.min(si++,WAIT_MSGS.length-1)])},420)
    setTimeout(()=>{clearInterval(iv);setProgress(100);setMealPlan(RECIPES);setTimeout(()=>router.push('/recipe'),380)},2400)
  }
  const chip=(val,active,onClick,activeColor)=>(
    <button key={val} onClick={onClick} style={{padding:'6px 12px',borderRadius:20,fontSize:12,fontWeight:700,fontFamily:'Nunito, sans-serif',cursor:'pointer',border:`2px solid ${active?'var(--navy)':'var(--border)'}`,background:active?(activeColor||mode.color):'var(--white)',color:active?'var(--navy)':'var(--muted)',boxShadow:active?'var(--shadow-sm)':'none',transition:'all .12s'}}>{val}</button>
  )
  if(loading) return(
    <div style={{minHeight:'100vh',background:'var(--cream)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}>
      <div style={{position:'relative',width:150,height:150,margin:'0 auto 24px'}}>
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="60" fill="none" stroke="var(--yellow-l)" strokeWidth="4" className="pulse-ring1"/>
          <circle cx="75" cy="75" r="45" fill="none" stroke="var(--yellow-l)" strokeWidth="3" className="pulse-ring2"/>
        </svg>
        <div className="mama-cook" style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:64}}>🍳</div>
      </div>
      <h2 style={{fontFamily:'Fraunces, serif',fontSize:22,fontWeight:900,marginBottom:8,color:'var(--navy)'}}>mama is cooking<br/>something up...</h2>
      <p style={{color:'var(--muted)',fontSize:13,fontWeight:600,marginBottom:22}}>{waitMsg}</p>
      <div style={{width:'100%',height:10,background:'var(--paper)',border:'2px solid var(--navy)',borderRadius:6,overflow:'hidden',marginBottom:28}}>
        <div style={{height:'100%',background:mode.color,width:`${progress}%`,transition:'width .5s ease'}}/>
      </div>
      <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
        {[100,100,72].map((w,i)=><div key={i} className="skel" style={{height:64,width:`${w}%`}}/>)}
      </div>
    </div>
  )
  return(
    <div style={{minHeight:'100vh',background:'var(--cream)',paddingBottom:100}}>
      <div style={{height:4,background:mode.color}}/>
      {/* HEADER */}
      <div style={{padding:'14px 20px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1.5px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>router.push('/home')} className="retro-btn" style={{padding:'8px 12px',background:'var(--white)',color:'var(--navy)',fontSize:13,display:'flex',alignItems:'center',gap:4}}>← home</button>
          <NomsterLogo size="sm" animate={false}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <div style={{width:14,height:14,borderRadius:4,background:mode.color,border:'1.5px solid var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8}}>{mode.emoji}</div>
          <span style={{fontSize:10,color:'var(--muted)',fontWeight:700}}>{mode.name}</span>
        </div>
      </div>
      {/* MAMA */}
      <div style={{padding:'12px 20px',display:'flex',gap:10,alignItems:'center'}}>
        <MamaMini size={40}/>
        <div style={{background:'var(--white)',border:'2px solid var(--navy)',borderRadius:'14px 14px 14px 4px',padding:'9px 13px',fontSize:12,color:'var(--navy)',lineHeight:1.6,fontWeight:600,boxShadow:'var(--shadow-sm)'}}>
          tell mama what u have and she'll cook up a {mode.name} week plan!
        </div>
      </div>
      <div style={{padding:'0 20px'}}>
        {/* SNAP BUTTON */}
        <button onClick={()=>router.push('/mama-loading?to=snap')} style={{width:'100%',padding:14,borderRadius:12,border:'2px solid var(--navy)',background:'var(--navy)',color:'var(--yellow)',fontSize:14,fontWeight:900,cursor:'pointer',fontFamily:'Nunito, sans-serif',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:14,boxShadow:'var(--shadow-md)'}}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          📸 snap ur fridge instead
          <span style={{background:'var(--yellow)',color:'var(--navy)',padding:'2px 8px',borderRadius:8,fontSize:10,fontWeight:900}}>NEW</span>
        </button>
        {/* OR */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{flex:1,height:1.5,background:'var(--border)'}}/>
          <span style={{fontFamily:'Nunito, sans-serif',fontSize:11,fontWeight:700,color:'var(--muted)'}}>or tap what u have</span>
          <div style={{flex:1,height:1.5,background:'var(--border)'}}/>
        </div>
        {/* FRIDGE TABS */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:10,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
            what's in ur fridge
            {selIng.length>0&&<span style={{background:mode.color,color:'var(--navy)',padding:'2px 8px',borderRadius:8,fontSize:10,fontWeight:900}}>{selIng.length} ✓</span>}
          </div>
          <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,marginBottom:10,scrollbarWidth:'none'}}>
            {FRIDGE_CATEGORIES.map(cat=>(
              <button key={cat.label} onClick={()=>setOpenCat(cat.label)} style={{flexShrink:0,padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:800,fontFamily:'Nunito, sans-serif',cursor:'pointer',border:'2px solid var(--navy)',background:openCat===cat.label?'var(--navy)':'var(--white)',color:openCat===cat.label?mode.color:'var(--muted)',boxShadow:openCat===cat.label?'var(--shadow-sm)':'none',transition:'all .12s'}}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          <div style={{background:'var(--white)',border:'2px solid var(--navy)',borderRadius:16,padding:'12px 14px',boxShadow:'var(--shadow-sm)'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {FRIDGE_CATEGORIES.find(c=>c.label===openCat)?.items.map(item=>chip(item,selIng.includes(item),()=>toggle(item,setSelIng)))}
            </div>
          </div>
          {selIng.length>0&&(
            <div style={{marginTop:10}}>
              <div style={{fontSize:10,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>selected</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {selIng.map(item=>(
                  <span key={item} onClick={()=>toggle(item,setSelIng)} style={{display:'inline-flex',alignItems:'center',gap:4,background:mode.color,color:'var(--navy)',padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:800,cursor:'pointer',border:'1.5px solid var(--navy)'}}>
                    {item} ✕
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* BUDGET + TIME */}
        <div style={{display:'flex',gap:12,marginBottom:18}}>
          {[['budget per meal ($)',budget,setBudget,'8'],['time available (min)',time,setTime,'20']].map(([lbl,val,setter,ph])=>(
            <div key={lbl} style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>{lbl}</div>
              <input type="number" placeholder={ph} value={val} onChange={e=>setter(e.target.value)} style={{width:'100%',background:'var(--white)',border:'2px solid var(--navy)',borderRadius:10,padding:'12px 14px',fontSize:14,fontFamily:'Nunito, sans-serif',outline:'none',fontWeight:700,color:'var(--navy)',boxShadow:'var(--shadow-sm)'}}/>
            </div>
          ))}
        </div>
        {/* CUISINE */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:10,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>cuisine vibe</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>{CUISINES.map(c=>chip(c,selC.includes(c),()=>toggleC(c),'var(--yellow-l)'))}</div>
        </div>
        {/* DIETARY */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:10,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>dietary needs</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>{DIETARY.map(d=>chip(d,selD.includes(d),()=>toggle(d,setSelD),'var(--mint-l)'))}</div>
        </div>
      </div>
      {/* CTA */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,padding:'12px 20px 28px',background:'var(--cream)',borderTop:'2px solid var(--navy)'}}>
        <button onClick={handleGenerate} className="retro-btn" style={{width:'100%',padding:15,background:'var(--yellow)',color:'var(--navy)',fontSize:15,fontWeight:900,boxShadow:'var(--shadow-md)'}}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          cook something up 🍳
        </button>
      </div>
    </div>
  )
}
