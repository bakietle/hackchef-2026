'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, DAYS, DATES, SLOTS, SHORT_DAYS, WEEK_MODES } from '@/lib/data'
import { IconChevLeft, IconChevRight, IconHome, IconCalendar, IconCart, IconProfile, IconArrowUp } from '@/components/Icons'
import NotifBanner from '@/components/NotifBanner'

export default function PlannerPage() {
  const router = useRouter()
  const { recipes, assigned, assignMeal, setPlanDone, weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]
  const all = recipes.length ? recipes : RECIPES

  const [dayIdx, setDayIdx]     = useState(0)
  const [cardIdx, setCardIdx]   = useState(0)
  const [activeSlot, setActiveSlot] = useState('breakfast')
  const [poppedSlot, setPoppedSlot] = useState(null)
  const [toast, setToast]       = useState({ msg:'', visible:false })
  const [hoveredSlot, setHoveredSlot] = useState(null)

  const dragRef  = useRef(null)
  const startRef = useRef({ x:0, y:0 })
  const offRef   = useRef({ x:0, y:0 })
  const dragging = useRef(false)
  const toastT   = useRef(null)

  const showToast = useCallback((msg) => {
    setToast({ msg, visible:true })
    clearTimeout(toastT.current)
    toastT.current = setTimeout(() => setToast(t=>({...t,visible:false})), 2200)
  }, [])

  const dayKey = DAYS[dayIdx]
  const dayAss = assigned[dayKey] || {}
  const cur  = all[cardIdx % all.length]
  const next = all[(cardIdx+1) % all.length]
  const back = all[(cardIdx+2) % all.length]

  const getPos = e => e.touches ? { x:e.touches[0].clientX, y:e.touches[0].clientY } : { x:e.clientX, y:e.clientY }

  const onDown = e => {
    dragging.current = true
    startRef.current = getPos(e)
    offRef.current = { x:0, y:0 }
    if (dragRef.current) dragRef.current.style.transition = 'none'
  }
  const onMove = useCallback(e => {
    if (!dragging.current || !dragRef.current) return
    if (e.cancelable) e.preventDefault()
    const pos = getPos(e)
    const dx = pos.x - startRef.current.x, dy = pos.y - startRef.current.y
    offRef.current = { x:dx, y:dy }
    dragRef.current.style.transform = `translate(${dx}px,${dy}px) rotate(${dx*.02}deg)`
    dragRef.current.style.boxShadow = `${4+Math.abs(dy)*.04}px ${6+Math.abs(dy)*.07}px 0 var(--navy)`
  }, [])

  const onUp = useCallback(() => {
    if (!dragging.current || !dragRef.current) return
    dragging.current = false
    const { x, y } = offRef.current
    if (y < -55) {
      dragRef.current.style.transition = 'transform .35s, opacity .35s'
      dragRef.current.style.transform  = 'translateY(-130%) scale(0.85)'
      dragRef.current.style.opacity    = '0'
      assignMeal(dayKey, activeSlot, cur)
      setPoppedSlot(activeSlot)
      setTimeout(() => setPoppedSlot(null), 500)
      showToast(`${cur.name.split(' ')[0]} → ${SLOTS.find(s=>s.id===activeSlot)?.label}!`)
      setTimeout(() => {
        setCardIdx(p=>p+1)
        if (dragRef.current) { dragRef.current.style.transition='none'; dragRef.current.style.transform=''; dragRef.current.style.opacity='1'; dragRef.current.style.boxShadow='' }
      }, 360)
    } else if (x < -70) {
      dragRef.current.style.transition = 'transform .35s, opacity .35s'
      dragRef.current.style.transform  = 'translateX(-140%) rotate(-16deg)'
      dragRef.current.style.opacity    = '0'
      showToast('skipped!')
      setTimeout(() => {
        setCardIdx(p=>p+1)
        if (dragRef.current) { dragRef.current.style.transition='none'; dragRef.current.style.transform=''; dragRef.current.style.opacity='1'; dragRef.current.style.boxShadow='' }
      }, 360)
    } else {
      dragRef.current.style.transition = 'transform .24s cubic-bezier(.34,1.2,.64,1)'
      dragRef.current.style.transform  = ''
      dragRef.current.style.boxShadow  = ''
      setTimeout(() => { if(dragRef.current) dragRef.current.style.transition='' }, 260)
    }
    offRef.current = { x:0, y:0 }
  }, [dayKey, activeSlot, cur, assignMeal, showToast])

  const NavBar = () => (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)' }}>
      {[
        { icon:<IconHome size={22} color="var(--muted)" />,    label:'home',    path:'/home',    active:false },
        { icon:<IconCalendar size={22} color="var(--navy)" />, label:'planner', path:'/planner', active:true  },
        { icon:<IconCart size={22} color="var(--muted)" />,    label:'grocery', path:'/grocery', active:false },
        { icon:<IconProfile size={22} color="var(--muted)" />, label:'profile', path:'/home',    active:false },
      ].map(nav => (
        <button key={nav.label} onClick={() => router.push(nav.path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:nav.active ? 'var(--navy)':'var(--muted)', padding:'0 10px', opacity:nav.active ? 1:0.5 }}>
          {nav.icon}{nav.label}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <NotifBanner />
      <div style={{ height:4, background:mode.color }} />

      <div style={{ position:'fixed', bottom:90, left:'50%', transform:toast.visible ? 'translateX(-50%) translateY(-4px)':'translateX(-50%)', background:'var(--navy)', borderRadius:10, padding:'9px 18px', fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap', opacity:toast.visible ? 1:0, transition:'all .3s', pointerEvents:'none', zIndex:199 }}>{toast.msg}</div>

      {/* Header — back to HOME */}
      <div style={{ padding:'16px 20px 0', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => router.push('/home')} className="retro-btn" style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
          <IconChevLeft size={16} color="var(--navy)" /> home
        </button>
        <div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:'var(--navy)' }}>build ur week</h2>
          <div style={{ fontSize:10, color:'var(--muted)', fontWeight:700, display:'flex', alignItems:'center', gap:4, marginTop:1 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:mode.color, display:'inline-block', border:'1px solid var(--navy)' }} />
            {mode.emoji} {mode.name}
          </div>
        </div>
      </div>

      {/* Day nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px 10px' }}>
        <button onClick={() => setDayIdx(d=>(d+6)%7)} className="retro-btn" style={{ width:38, height:38, padding:0, background:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <IconChevLeft size={18} color="var(--navy)" />
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'Fraunces, serif', fontSize:16, fontWeight:900, color:'var(--navy)' }}>{DAYS[dayIdx]}</div>
          <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{DATES[dayIdx]}</div>
        </div>
        <button onClick={() => setDayIdx(d=>(d+1)%7)} className="retro-btn" style={{ width:38, height:38, padding:0, background:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <IconChevRight size={18} color="var(--navy)" />
        </button>
      </div>

      {/* Slot grid — 5 slots with time labels */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, padding:'0 20px 10px' }}>
        {SLOTS.map(slot => {
          const meal = dayAss[slot.id]
          const isActive = activeSlot === slot.id
          const isHovered = hoveredSlot === slot.id
          return (
            <div key={slot.id}
              onClick={() => setActiveSlot(slot.id)}
              onMouseEnter={() => setHoveredSlot(slot.id)}
              onMouseLeave={() => setHoveredSlot(null)}
              className={poppedSlot===slot.id ? 'slot-pop' : ''}
              style={{
                background: meal ? `${mode.color}30` : isActive ? mode.light : 'var(--white)',
                border:`2px solid ${meal ? 'var(--navy)' : isActive ? 'var(--navy)' : 'var(--border)'}`,
                borderRadius:14, padding:'11px 10px', minHeight:76, cursor:'pointer',
                boxShadow: isActive ? 'var(--shadow-md)' : meal ? 'var(--shadow-sm)' : isHovered ? 'var(--shadow-sm)':'none',
                transform: isHovered && !isActive ? 'translateY(-1px)':'none',
                transition:'all .15s',
              }}>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
                <span style={{ fontSize:11 }}>{slot.emoji}</span>
                <div style={{ fontSize:8, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:.5 }}>{slot.time}</div>
              </div>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:800, color:'var(--navy)', marginBottom:4 }}>{slot.label}</div>
              {meal
                ? <div className="slide-in" style={{ fontSize:10, color:'var(--navy)', fontWeight:700, display:'flex', alignItems:'center', gap:3 }}>
                    <span style={{ fontSize:12 }}>{meal.flag}</span>
                    {meal.name.split(' ').slice(0,2).join(' ')}
                  </div>
                : <div style={{ fontSize:9, color:isActive ? mode.color==='#F5C842' ? '#8A6000':'var(--sage)':'var(--border)', fontWeight:700 }}>
                    {isActive ? '↑ drag here' : 'tap to select'}
                  </div>
              }
            </div>
          )
        })}
      </div>

      {/* Hint */}
      <div style={{ padding:'0 20px 6px', display:'flex', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:9, color:'var(--muted)', fontWeight:700 }}>
          <div style={{ width:22, height:22, borderRadius:'50%', background:'#FFE8E5', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IconChevLeft size={11} color="var(--coral)" />
          </div>skip
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:9, color:'var(--muted)', fontWeight:700 }}>
          assign slot
          <div style={{ width:22, height:22, borderRadius:'50%', background:mode.light, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IconArrowUp size={11} color="var(--navy)" />
          </div>
        </div>
      </div>

      {/* Swipe stack */}
      <div style={{ padding:'0 20px', marginBottom:8 }}>
        <div style={{ position:'relative', height:190 }}>
          {/* back */}
          <div style={{ position:'absolute', width:'100%', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:13, transform:'translateY(12px) scale(0.92)', opacity:.4, zIndex:1, pointerEvents:'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:40, height:40, background:`${mode.color}20`, border:'2px solid var(--navy)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{back?.flag}</div>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{back?.name}</div>
            </div>
          </div>
          {/* mid */}
          <div style={{ position:'absolute', width:'100%', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:13, transform:'translateY(6px) scale(0.96)', opacity:.65, zIndex:2, pointerEvents:'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:40, height:40, background:`${mode.color}20`, border:'2px solid var(--navy)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{next?.flag}</div>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{next?.name}</div>
            </div>
          </div>
          {/* front */}
          <div ref={dragRef}
            style={{ position:'absolute', width:'100%', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:13, zIndex:3, cursor:'grab', touchAction:'none', boxShadow:'var(--shadow-md)' }}
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
            {cur && (<>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ width:48, height:48, background:`${mode.color}25`, border:'2px solid var(--navy)', borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{cur.flag}</div>
                <div>
                  <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)' }}>{cur.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{cur.cuisine} · {cur.time}min · ${cur.cost}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:800, color:'var(--navy)' }}>{cur.fuel}</span>
                <div style={{ flex:1, height:7, background:'var(--paper)', border:'1.5px solid var(--border)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:mode.color, width:`${cur.fuel}%` }} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
                {[['kcal',cur.cal],['prot',cur.pro],['carb',cur.carb],['fat',cur.fat]].map(([k,v])=>(
                  <div key={k} style={{ background:`${mode.color}20`, border:'1.5px solid var(--navy)', borderRadius:8, padding:'6px 3px', textAlign:'center' }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:800, color:'var(--navy)' }}>{v}</div>
                    <div style={{ fontSize:8, color:'var(--muted)', fontWeight:700, textTransform:'uppercase' }}>{k}</div>
                  </div>
                ))}
              </div>
            </>)}
          </div>
        </div>
      </div>

      {/* Week overview */}
      <div style={{ padding:'0 20px', marginBottom:12 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:7 }}>week overview</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {SHORT_DAYS.map((d,i) => {
            const meals = Object.values(assigned[DAYS[i]]||{}).filter(Boolean)
            return (
              <div key={d} onClick={() => setDayIdx(i)} style={{ background:i===dayIdx ? 'var(--navy)':meals.length ? mode.light:'var(--white)', border:`2px solid ${i===dayIdx ? 'var(--navy)':meals.length ? 'var(--navy)':'var(--border)'}`, borderRadius:10, padding:'5px 2px', textAlign:'center', cursor:'pointer', minHeight:56, boxShadow:i===dayIdx ? 'var(--shadow-sm)':meals.length ? '2px 3px 0 var(--navy)':'none', transition:'all .12s' }}>
                <div style={{ fontSize:7, fontWeight:700, textTransform:'uppercase', marginBottom:1, color:i===dayIdx ? 'rgba(255,255,255,0.5)':'var(--muted)' }}>{d}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:11, fontWeight:900, marginBottom:1, color:i===dayIdx ? mode.color:'var(--navy)' }}>{14+i}</div>
                {meals.slice(0,2).map((m,mi) => <div key={mi} style={{ fontSize:10, lineHeight:1.3 }}>{m.flag}</div>)}
                {!meals.length && <div style={{ width:4, height:4, borderRadius:'50%', background:i===dayIdx ? 'rgba(255,255,255,0.3)':'var(--border)', margin:'1px auto' }} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position:'fixed', bottom:72, left:0, right:0, padding:'6px 20px' }}>
        <button onClick={() => { setPlanDone(true); router.push('/grocery') }} style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--navy)', background:'var(--yellow)', color:'var(--navy)', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', transition:'transform .1s, box-shadow .1s' }}
          onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
          onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
        >done! see shopping list 🛒</button>
      </div>

      <NavBar />
    </div>
  )
}
