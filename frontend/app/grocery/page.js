'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { SHOP_ITEMS, WEEK_MODES, FOOD_TIPS } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile, IconChevLeft, IconCheck } from '@/components/Icons'
import { MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'

export default function GroceryPage() {
  const router = useRouter()
  const { weekMode, shopItems, setShopItems, toggleShopItem } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  // Init shop items from store or defaults
  const [items, setItems] = useState(() => {
    if (shopItems && shopItems.length > 0) return shopItems
    return SHOP_ITEMS.map(i => ({...i}))
  })
  const [filter,    setFilter]    = useState('all')
  const [toast,     setToast]     = useState({ msg:'', on:false })
  const [notifOk,   setNotifOk]   = useState(false)

  const toggle = (id) => {
    const next = items.map(i => i.id===id ? {...i,done:!i.done} : i)
    setItems(next)
    setShopItems?.(next)
  }

  const remaining = items.filter(i=>!i.done).reduce((a,i)=>a+i.p,0)
  const doneCount = items.filter(i=>i.done).length
  const allDone   = doneCount === items.length && items.length > 0

  const displayed = filter==='done'    ? items.filter(i=>i.done)
    : filter==='pending' ? items.filter(i=>!i.done) : items

  const showToast = (msg) => {
    setToast({ msg, on:true })
    setTimeout(() => setToast(t=>({...t,on:false})), 2200)
  }

  // Push notification setup
  const enableNotifications = async () => {
    if (!('Notification' in window)) { showToast("notifications not supported on this browser"); return }
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setNotifOk(true)
      showToast('notifications enabled! mama will remind u to shop 💕')
      // Schedule a reminder notification (demo)
      setTimeout(() => {
        new Notification('nomster 🍳', {
          body: `don't forget — u still have ${items.filter(i=>!i.done).length} items to grab!`,
          icon: '/favicon.ico',
        })
      }, 5000)
    } else {
      showToast('notifications blocked — check browser settings')
    }
  }

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { icon:<IconHome size={22} />,     label:'home',    path:'/home'    },
        { icon:<IconCalendar size={22} />, label:'planner', path:'/planner' },
        { icon:<IconCart size={22} />,     label:'grocery', path:'/grocery', active:true },
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
      <div style={{ position:'fixed', top:60, left:'50%', transform:toast.on?'translateX(-50%) translateY(0)':'translateX(-50%) translateY(-60px)', background:'var(--navy)', borderRadius:12, padding:'9px 18px', fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap', opacity:toast.on?1:0, transition:'all .3s', pointerEvents:'none', zIndex:200 }}>
        {toast.msg}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <button onClick={() => router.push('/home')} className="retro-btn"
            style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
            <IconChevLeft size={16} color="var(--navy)" /> home
          </button>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', flex:1 }}>shopping list 🛒</h2>
          {/* Push notification bell */}
          <button onClick={enableNotifications}
            style={{ width:36, height:36, borderRadius:10, border:`2px solid ${notifOk?'var(--mint)':'var(--border)'}`, background:notifOk?'var(--mint-l)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
            {notifOk ? '🔔' : '🔕'}
          </button>
        </div>

        {/* Total hero card */}
        <div style={{ background:allDone?'var(--mint-l)':'var(--navy)', border:'2px solid var(--navy)', borderRadius:20, padding:18, marginBottom:14, boxShadow:'var(--shadow-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:allDone?'var(--navy)':'rgba(245,200,66,0.7)', textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>
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

        {/* Progress bar */}
        <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:6, overflow:'hidden', marginBottom:12, boxShadow:'var(--shadow-sm)' }}>
          <div style={{ height:'100%', background:mode.color, width:`${items.length ? (doneCount/items.length)*100 : 0}%`, transition:'width .4s ease' }} />
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:14 }}>
          {[['all','All'],['pending','To buy'],['done','Done ✓']].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)}
              style={{ flex:1, padding:'8px 0', borderRadius:10, border:`2px solid ${filter===k?'var(--navy)':'var(--border)'}`, background:filter===k?'var(--navy)':'var(--white)', color:filter===k?mode.color:'var(--muted)', fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif', transition:'all .12s' }}>
              {l}
            </button>
          ))}
        </div>

        {/* Items */}
        {displayed.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} className="slot-hover"
            style={{ display:'flex', alignItems:'center', gap:12, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:12, padding:'13px 14px', marginBottom:7, cursor:'pointer', opacity:item.done?0.55:1, boxShadow:item.done?'none':'var(--shadow-sm)', transition:'all .15s' }}>
            <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:item.done?'var(--mint)':'transparent', border:`2px solid ${item.done?'var(--mint)':'var(--border)'}`, transition:'all .2s' }}>
              {item.done && <IconCheck size={11} color="#fff" />}
            </div>
            <div style={{ fontSize:20, flexShrink:0 }}>{item.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', textDecoration:item.done?'line-through':'none' }}>{item.n}</div>
              {item.tag && <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{item.tag}</div>}
            </div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:item.done?'var(--muted)':'var(--navy)' }}>
              ${item.p.toFixed(2)}
            </div>
          </div>
        ))}

        {/* All done celebration */}
        {allDone && (
          <div style={{ textAlign:'center', padding:'20px 0 12px' }}>
            <MamaHappy size={80} />
            <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)', marginTop:8 }}>
              all done!! mama is so proud 💕
            </div>
          </div>
        )}

        {/* Food tip */}
        <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:14, marginTop:8 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--navy)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>💡 food storage tip</div>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <span style={{ fontSize:20 }}>{FOOD_TIPS[Math.floor(Math.random() * FOOD_TIPS.length)].emoji}</span>
            <div style={{ fontSize:12, color:'var(--navy)', lineHeight:1.65, fontWeight:600 }}>
              {FOOD_TIPS[Math.floor(Math.random() * FOOD_TIPS.length)].tip}
            </div>
          </div>
        </div>

        {/* Supermarket links */}
        <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>compare prices</div>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {[
            ['Woolworths', '#00703F', 'https://www.woolworths.com.au'],
            ['Coles',      '#E31837', 'https://www.coles.com.au'],
            ['Aldi',       '#003082', 'https://www.aldi.com.au'],
          ].map(([name, bg, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              style={{ flex:1, padding:'10px 6px', textAlign:'center', background:bg, color:'#fff', fontSize:11, fontWeight:800, fontFamily:'Nunito, sans-serif', textDecoration:'none', display:'block', borderRadius:10, border:'2px solid var(--navy)', boxShadow:'var(--shadow-sm)' }}>
              {name}
            </a>
          ))}
        </div>

        <div style={{ height:20 }} />
      </div>

      {/* CTA back to home */}
      <div style={{ position:'fixed', bottom:72, left:0, right:0, padding:'6px 20px', zIndex:40 }}>
        <button onClick={() => { showToast('week locked in! mama is proud 💕'); setTimeout(()=>router.push('/home'),900) }}
          style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--navy)', background:allDone?'var(--mint)':'var(--yellow)', color:'var(--navy)', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', transition:'transform .1s' }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
          {allDone ? '✓ all done! back to home' : 'back to home 🏠'}
        </button>
      </div>

      <NavBar />
    </div>
  )
}
