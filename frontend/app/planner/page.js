'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
 
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const FULL_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DATES = ['Mar 14','Mar 15','Mar 16','Mar 17','Mar 18','Mar 19','Mar 20']
const SLOTS = [
  { id:'breakfast', label:'☀️ Breakfast', time:'7 AM' },
  { id:'lunch',     label:'🌤️ Lunch',     time:'12 PM' },
  { id:'snack',     label:'🍎 Snack',      time:'3 PM' },
  { id:'dinner',    label:'🌙 Dinner',     time:'6 PM' },
]
 
export default function PlannerPage() {
  const router = useRouter()
  const { recipes, assigned, assignMeal } = usePlannerStore()
  const [dayIdx, setDayIdx] = useState(0)
  const [cardIdx, setCardIdx] = useState(0)
  const [poppedSlot, setPoppedSlot] = useState(null)
  const dragRef = useRef(null)
  const startRef = useRef({ x: 0, y: 0 })
  const offsetRef = useRef({ x: 0, y: 0 })
 
  const dayKey = FULL_DAYS[dayIdx]
  const dayAssigned = assigned[dayKey] || {}
  const currentRecipe = recipes[cardIdx % recipes.length]
 
  const handleDragStart = (e) => {
    const pos = e.touches ? e.touches[0] : e
    startRef.current = { x: pos.clientX, y: pos.clientY }
  }
 
  const handleDragMove = (e) => {
    if (!dragRef.current) return
    if (e.cancelable) e.preventDefault()
    const pos = e.touches ? e.touches[0] : e
    offsetRef.current = {
      x: pos.clientX - startRef.current.x,
      y: pos.clientY - startRef.current.y
    }
    const { x, y } = offsetRef.current
    dragRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.025}deg)`
    dragRef.current.style.boxShadow = `0 ${16 + Math.abs(y) * 0.1}px 40px rgba(0,0,0,0.15)`
    dragRef.current.style.zIndex = 50
  }
 
  const handleDragEnd = (slotId) => {
    if (!dragRef.current) return
    const { y } = offsetRef.current
    if (y < -50 && slotId) {
      // Assign to slot
      assignMeal(dayKey, slotId, currentRecipe)
      setPoppedSlot(slotId)
      setTimeout(() => setPoppedSlot(null), 500)
      setCardIdx(prev => prev + 1)
    }
    // Reset card position
    dragRef.current.style.transform = ''
    dragRef.current.style.boxShadow = ''
    dragRef.current.style.zIndex = ''
    offsetRef.current = { x: 0, y: 0 }
  }
 
  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', paddingBottom:100 }}>
 
      {/* Header */}
      <div style={{ padding:'20px 20px 0', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => router.push('/recipe')}
          style={{ padding:'8px 14px', borderRadius:12, border:'2px solid var(--border)',
            background:'#fff', cursor:'pointer', fontSize:12, fontWeight:800, fontFamily:'Nunito' }}>
          ← back
        </button>
        <h2 style={{ fontSize:18, fontWeight:800 }}>build ur week 📅</h2>
      </div>
 
      {/* Day navigator */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 20px 12px' }}>
        <button onClick={() => setDayIdx(d => (d+6)%7)}
          style={{ width:38, height:38, borderRadius:12, border:'2px solid var(--border)',
            background:'#fff', cursor:'pointer', fontSize:16 }}>←</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:17, fontWeight:800 }}>{FULL_DAYS[dayIdx]}</div>
          <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600 }}>{DATES[dayIdx]}</div>
        </div>
        <button onClick={() => setDayIdx(d => (d+1)%7)}
          style={{ width:38, height:38, borderRadius:12, border:'2px solid var(--border)',
            background:'#fff', cursor:'pointer', fontSize:16 }}>→</button>
      </div>
 
      {/* SLOT GRID — 2 columns, bigger, pops on assignment */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 20px 16px' }}>
        {SLOTS.map(slot => {
          const meal = dayAssigned[slot.id]
          const isPopped = poppedSlot === slot.id
          return (
            <div key={slot.id}
              className={isPopped ? 'slot-pop' : ''}
              style={{
                background: meal ? 'var(--mint-l)' : '#fff',
                border: `2px solid ${meal ? 'var(--mint)' : 'var(--border)'}`,
                borderRadius: 18, padding: '14px 12px', minHeight: 90,
                cursor: 'pointer', transition: 'border-color .2s, background .2s',
              }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)',
                textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4 }}>
                {slot.time}
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)', marginBottom:6 }}>
                {slot.label}
              </div>
              {meal ? (
                <div style={{ fontSize:12, color:'#3da876', fontWeight:700 }}>
                  {meal.flag} {meal.name.split(' ')[0]}...
                </div>
              ) : (
                <div style={{ fontSize:11, color:'#ddd' }}>drag a card here ↑</div>
              )}
            </div>
          )
        })}
      </div>
 
      {/* Swipe card stack */}
      <div style={{ padding:'0 20px', marginBottom:12 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)',
          textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>
          drag up ↑ to assign · ← to skip
        </div>
        <div style={{ position:'relative', height:210 }}>
          {/* Back card */}
          <div style={{ position:'absolute', width:'100%', background:'#fff',
            border:'2px solid var(--border)', borderRadius:20, padding:16,
            transform:'translateY(14px) scale(0.93)', opacity:0.5, zIndex:1 }}>
            <div style={{ height:40, background:'var(--border)', borderRadius:8 }} />
          </div>
          {/* Mid card */}
          <div style={{ position:'absolute', width:'100%', background:'#fff',
            border:'2px solid var(--border)', borderRadius:20, padding:16,
            transform:'translateY(7px) scale(0.96)', opacity:0.7, zIndex:2 }}>
            <div style={{ height:40, background:'var(--border)', borderRadius:8 }} />
          </div>
          {/* Front draggable card */}
          <div ref={dragRef}
            style={{ position:'absolute', width:'100%', background:'#fff',
              border:'2px solid var(--border)', borderRadius:20, padding:16,
              zIndex:3, cursor:'grab', touchAction:'none',
              boxShadow:'0 8px 24px rgba(0,0,0,0.08)', transition:'box-shadow .15s' }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={() => handleDragEnd(SLOTS.find(s => !dayAssigned[s.id])?.id)}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={() => handleDragEnd(SLOTS.find(s => !dayAssigned[s.id])?.id)}
          >
            {currentRecipe && (
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:52, height:52, background:'var(--peach-l)',
                  borderRadius:16, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {currentRecipe.flag}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800 }}>{currentRecipe.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:2 }}>
                    {currentRecipe.cuisine} · {currentRecipe.time}min · ${currentRecipe.cost}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Week overview grid */}
      <div style={{ padding:'0 20px' }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)',
          textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>
          week overview
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {DAYS.map((d, i) => {
            const meals = Object.values(assigned[FULL_DAYS[i]] || {}).filter(Boolean)
            return (
              <div key={d}
                onClick={() => setDayIdx(i)}
                style={{ background: i===dayIdx ? 'var(--peach-l)' : '#fff',
                  border: `2px solid ${i===dayIdx ? 'var(--peach)' : meals.length ? 'var(--mint)' : 'var(--border)'}`,
                  borderRadius:12, padding:'6px 3px', textAlign:'center', cursor:'pointer',
                  minHeight:64, transition:'all .18s' }}>
                <div style={{ fontSize:8, color:'var(--muted)', fontWeight:800,
                  textTransform:'uppercase', marginBottom:2 }}>{d}</div>
                <div style={{ fontSize:11, fontWeight:800, marginBottom:3 }}>{14+i}</div>
                {meals.slice(0,2).map((m,mi) => (
                  <div key={mi} style={{ fontSize:12, lineHeight:1.2 }}>{m.flag}</div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
 
      {/* Done CTA — back to home, no grocery redirect */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0,
        padding:'12px 20px 28px', background:'var(--cream)',
        borderTop:'2px solid var(--border)' }}>
        <button onClick={() => router.push('/')}
          style={{ width:'100%', padding:15, borderRadius:16, border:'none',
            fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'Nunito',
            background:'linear-gradient(135deg, var(--mint), #5ec992)',
            color:'#fff', boxShadow:'0 6px 20px rgba(94,201,146,.3)' }}>
          all done! back to home 🏠
        </button>
      </div>
    </div>
  )
}

