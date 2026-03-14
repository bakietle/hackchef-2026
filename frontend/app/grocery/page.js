'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SHOP_ITEMS } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconProfile, IconChevLeft, IconCheck } from '@/components/Icons'
import { MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES } from '@/lib/data'

export default function GroceryPage() {
  const router = useRouter()
  const { weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const [items, setItems] = useState(SHOP_ITEMS.map(i=>({...i})))
  const [toast, setToast] = useState({ msg:'', visible:false })
  const [filter, setFilter] = useState('all')

  const toggle = id => setItems(p => p.map(i => i.id===id ? {...i,done:!i.done} : i))
  const remaining = items.filter(i=>!i.done).reduce((a,i)=>a+i.p,0)
  const doneCount = items.filter(i=>i.done).length
  const allDone   = doneCount === items.length

  const showToast = msg => {
    setToast({msg,visible:true})
    setTimeout(()=>setToast(t=>({...t,visible:false})),2200)
  }

  const displayed = filter === 'done' ? items.filter(i=>i.done)
    : filter === 'pending' ? items.filter(i=>!i.done) : items

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)' }}>
      {[
        { icon:<IconHome size={22} color="var(--muted)" />,    label:'home',    path:'/home',    active:false },
        { icon:<IconCalendar size={22} color="var(--muted)" />,label:'planner', path:'/planner', active:false },
        { icon:<IconCart size={22} color="var(--navy)" />,     label:'grocery', path:'/grocery', active:true  },
        { icon:<IconProfile size={22} color="var(--muted)" />, label:'profile', path:'/home',    active:false },
      ].map(nav => (
        <button key={nav.label} onClick={() => router.push(nav.path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:nav.active?'var(--navy)':'var(--muted)', padding:'0 10px', opacity:nav.active?1:0.5 }}>
          {nav.icon}{nav.label}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <NotifBanner />
      <div style={{ height:4, background:mode.color }} />

      <div style={{ position:'fixed', bottom:90, left:'50%', transform:toast.visible?'translateX(-50%) translateY(-4px)':'translateX(-50%)', background:'var(--navy)', borderRadius:10, padding:'9px 18px', fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap', opacity:toast.visible?1:0, transition:'all .3s', pointerEvents:'none', zIndex:199 }}>{toast.msg}</div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <button onClick={() => router.push('/planner')} className="retro-btn" style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
            <IconChevLeft size={16} color="var(--navy)" /> back
          </button>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>shopping list</h2>
        </div>

        {/* Total hero card */}
        <div style={{ background:allDone ? 'var(--mint-l)' : 'var(--navy)', border:'2px solid var(--navy)', borderRadius:20, padding:18, marginBottom:14, boxShadow:'var(--shadow-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:allDone?'var(--sage)':'rgba(245,200,66,0.7)', textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>
              {allDone ? 'all done! 🎉' : 'estimated total'}
            </div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:30, fontWeight:900, color:allDone?'var(--navy)':mode.color }}>
              ${remaining.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:allDone?'var(--navy)':'var(--white)' }}>
              {doneCount}<span style={{ fontSize:13, opacity:.5 }}>/{items.length}</span>
            </div>
            <div style={{ fontSize:10, color:allDone?'var(--muted)':'rgba(255,255,255,0.4)', fontWeight:600 }}>checked off</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:6, overflow:'hidden', marginBottom:12, boxShadow:'var(--shadow-sm)' }}>
          <div style={{ height:'100%', background:mode.color, width:`${(doneCount/items.length)*100}%`, transition:'width .4s ease' }} />
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:14 }}>
          {[['all','All'],['pending','To buy'],['done','Done']].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ flex:1, padding:'8px 0', borderRadius:10, border:`2px solid ${filter===k?'var(--navy)':'var(--border)'}`, background:filter===k?'var(--navy)':'var(--white)', color:filter===k?mode.color:'var(--muted)', fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif', transition:'all .12s' }}>{l}</button>
          ))}
        </div>

        {/* Items */}
        {displayed.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)}
            className="slot-hover"
            style={{ display:'flex', alignItems:'center', gap:12, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:12, padding:'13px 14px', marginBottom:7, cursor:'pointer', opacity:item.done ? 0.55:1, boxShadow:item.done?'none':'var(--shadow-sm)', transition:'all .15s' }}>
            <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:item.done?'var(--mint)':'transparent', border:`2px solid ${item.done?'var(--mint)':'var(--border)'}`, transition:'all .2s' }}>
              {item.done && <IconCheck size={11} color="#fff" />}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', textDecoration:item.done?'line-through':'none' }}>{item.n}</div>
              {item.tag && <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{item.tag}</div>}
            </div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:item.done?'var(--muted)':'var(--navy)' }}>${item.p.toFixed(2)}</div>
          </div>
        ))}

        {allDone && (
          <div style={{ textAlign:'center', padding:'20px 0 12px' }}>
            <MamaHappy size={80} />
            <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)', marginTop:8 }}>all done!! mama is so proud 💕</div>
          </div>
        )}

        <div style={{ height:100 }} />
      </div>

      {/* CTA */}
      <div style={{ position:'fixed', bottom:72, left:0, right:0, padding:'6px 20px' }}>
        <button onClick={() => { showToast('week locked in! mama is proud 💕'); setTimeout(()=>router.push('/home'),900) }} style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--navy)', background:allDone?'var(--mint)':'var(--yellow)', color:'var(--navy)', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', transition:'transform .1s, box-shadow .1s' }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
        >{allDone ? '✓ back to home':'all done! back to home'}</button>
      </div>

      <NavBar />
    </div>
  )
}
