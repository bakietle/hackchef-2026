'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'
import { IconHome, IconCalendar, IconCart, IconHeart, IconProfile } from '@/components/Icons'
import { MamaMini } from '@/components/mama/MamaVariants'
import NomsterLogo from '@/components/NomsterLogo'
import NotifBanner from '@/components/NotifBanner'

const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DATES = [14,15,16,17,18,19,20]
const SLOTS = [
  { id:'breakfast', label:'Breakfast', emoji:'☀️' },
  { id:'lunch',     label:'Lunch',     emoji:'🌤️' },
  { id:'snack',     label:'Snack',     emoji:'🍎' },
  { id:'dinner',    label:'Dinner',    emoji:'🌙' },
]

function PickSheet({ slotLabel, onPick, onClose, mode }) {
  const { recipes } = usePlannerStore()
  const all = recipes.length ? recipes : RECIPES
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.6)', zIndex:110, display:'flex', alignItems:'flex-end', backdropFilter:'blur(3px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'22px 22px 0 0', border:'2px solid var(--navy)', borderBottom:'none', width:'100%', maxHeight:'72%', display:'flex', flexDirection:'column', animation:'slideUp .25s' }}>
        <div style={{ padding:'14px 20px 10px', borderBottom:'1.5px solid var(--border)', flexShrink:0 }}>
          <div style={{ width:32, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 10px' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:16, fontWeight:900, color:'var(--navy)' }}>pick a recipe</div>
              <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>for {slotLabel.toLowerCase()}</div>
            </div>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'1.5px solid var(--border)', background:'var(--white)', cursor:'pointer', fontSize:13, color:'var(--muted)', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        </div>
        <div style={{ overflowY:'auto', padding:'10px 20px 28px' }}>
          {all.map(r => {
            const rMode = WEEK_MODES.find(m => m.key === r.mode) || WEEK_MODES[0]
            return (
              <div key={r.id} onClick={() => onPick(r)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 13px', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, marginBottom:8, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}
                onMouseDown={e => e.currentTarget.style.transform='scale(.98)'}
                onMouseUp={e => e.currentTarget.style.transform=''}>
                <div style={{ width:46, height:46, background:`${rMode.color}25`, border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{r.flag}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)', marginBottom:1 }}>{r.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{r.cuisine} · {r.time}min</div>
                </div>
                <div style={{ width:28, height:28, borderRadius:8, background:`${rMode.color}30`, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{rMode.emoji}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DaySheet({ day, dayIdx, mode, onClose }) {
  const { assigned, assignMeal, removeMeal } = usePlannerStore()
  const dayData = assigned[day] || {}
  const [picking, setPicking] = useState(null)

  if (picking) {
    return (
      <PickSheet
        slotLabel={SLOTS.find(s => s.id === picking)?.label || ''}
        onPick={r => { assignMeal(day, picking, r); setPicking(null) }}
        onClose={() => setPicking(null)}
        mode={mode}
      />
    )
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(27,43,75,.6)', zIndex:90, display:'flex', alignItems:'flex-end', backdropFilter:'blur(3px)', animation:'fadeIn .2s' }}>
      <div style={{ background:'var(--cream)', borderRadius:'22px 22px 0 0', border:'2px solid var(--navy)', borderBottom:'none', width:'100%', maxHeight:'82%', display:'flex', flexDirection:'column', animation:'slideUp .25s' }}>

        {/* Header */}
        <div style={{ padding:'14px 20px 12px', borderBottom:'1.5px solid var(--border)', flexShrink:0, position:'relative' }}>
          <div style={{ width:32, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 10px' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:19, fontWeight:900, color:'var(--navy)' }}>{day}</div>
              <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>Mar {DATES[dayIdx]}</div>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:'1.5px solid var(--border)', background:'var(--white)', cursor:'pointer', fontSize:14, color:'var(--muted)', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        </div>

        {/* Slots */}
        <div style={{ overflowY:'auto', padding:'14px 20px 24px' }}>
          {SLOTS.map(slot => {
            const meal = dayData[slot.id]
            return (
              <div key={slot.id} style={{ marginBottom:12 }}>
                {/* Slot label */}
                <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:6, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ fontSize:13 }}>{slot.emoji}</span> {slot.label}
                </div>

                {meal ? (
                  <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'11px 13px', display:'flex', alignItems:'center', gap:11, boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ width:46, height:46, background:`${mode.color}20`, border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{meal.flag}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)', marginBottom:1 }}>{meal.name}</div>
                      <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{meal.cuisine} · {meal.time}min</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => setPicking(slot.id)}
                        style={{ width:32, height:32, borderRadius:9, border:'2px solid var(--border)', background:'var(--paper)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        ✏️
                      </button>
                      <button onClick={() => removeMeal(day, slot.id)}
                        style={{ width:32, height:32, borderRadius:9, border:'2px solid var(--coral)', background:'var(--coral-l)', cursor:'pointer', fontSize:12, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--coral)' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setPicking(slot.id)}
                    style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:'2px dashed var(--border)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'Nunito, sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=mode.color; e.currentTarget.style.background=`${mode.color}10` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='transparent' }}>
                    <div style={{ width:36, height:36, borderRadius:10, border:'2px dashed var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, color:'var(--muted)' }}>+</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)' }}>add {slot.label.toLowerCase()}</div>
                  </button>
                )}
              </div>
            )
          })}

          <button onClick={onClose}
            style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--navy)', background:mode.color, color:'var(--navy)', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)', marginTop:4 }}
            onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='none'}}
            onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-sm)'}}>
            done ✓
          </button>
        </div>
      </div>
    </div>
  )
}

function NavBar() {
  const router = useRouter()
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { label:'home',    path:'/home',    Icon:IconHome,     active:false },
        { label:'planner', path:'/planner', Icon:IconCalendar, active:true  },
        { label:'grocery', path:'/grocery', Icon:IconCart,     active:false },
        { label:'saved',   path:'/saved',   Icon:IconHeart,    active:false },
        { label:'profile', path:'/profile', Icon:IconProfile,  active:false },
      ].map(({ label, path, Icon, active }) => (
        <button key={label} onClick={() => router.push(path)}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', border:'none', background:'none', fontFamily:'Nunito, sans-serif', fontWeight:800, fontSize:9, color:active?'var(--navy)':'var(--muted)', padding:'0 8px', opacity:active?1:0.45 }}>
          <Icon size={22} color={active?'var(--navy)':'var(--muted)'}/>
          {label}
        </button>
      ))}
    </div>
  )
}

export default function PlannerPage() {
  const router = useRouter()
  const { weekMode, assigned, clearWeek } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]
  const [openDay, setOpenDay] = useState(null)

  const totalMeals  = Object.values(assigned).reduce((a, d) => a + Object.keys(d || {}).length, 0)
  const daysPlanned = Object.keys(assigned).filter(d => Object.keys(assigned[d] || {}).length > 0).length

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', paddingBottom:80 }}>
      <NotifBanner/>
      <div style={{ height:4, background:mode.color }}/>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <h2 style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)', marginBottom:2 }}>week planner 📅</h2>
            <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600 }}>
              {totalMeals === 0 ? 'tap any day to start' : `${totalMeals} meals · ${daysPlanned} days planned`}
            </div>
          </div>
          <NomsterLogo size="sm" animate/>
        </div>

        {/* Mama prompt — only when empty */}
        {totalMeals === 0 && (
          <div style={{ background:`${mode.color}20`, border:'2px solid var(--navy)', borderRadius:16, padding:'11px 14px', marginBottom:16, display:'flex', gap:10, alignItems:'center' }}>
            <MamaMini size={38}/>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', lineHeight:1.65 }}>
              tap a day → pick meals for each slot → mama remembers it all 💕
            </div>
          </div>
        )}

        {/* Day list */}
        <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:18 }}>
          {DAYS.map((day, i) => {
            const dayData = assigned[day] || {}
            const meals   = SLOTS.map(s => dayData[s.id] ? { slot:s, recipe:dayData[s.id] } : null).filter(Boolean)
            const isEmpty = meals.length === 0
            const isToday = i === 0

            return (
              <div key={day} onClick={() => setOpenDay(i)}
                style={{
                  background: 'var(--white)',
                  border: `2px solid ${isToday ? mode.color : isEmpty ? 'var(--border)' : 'var(--navy)'}`,
                  borderRadius: 18,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  boxShadow: isEmpty ? 'none' : 'var(--shadow-sm)',
                  display: 'flex', alignItems: 'center', gap: 13,
                  transition: 'transform .12s',
                }}
                onMouseDown={e => e.currentTarget.style.transform='scale(.99)'}
                onMouseUp={e => e.currentTarget.style.transform=''}>

                {/* Date pill */}
                <div style={{
                  width:46, height:50, borderRadius:13, flexShrink:0,
                  background: isToday ? mode.color : isEmpty ? 'var(--paper)' : `${mode.color}18`,
                  border: `2px solid ${isToday ? 'var(--navy)' : isEmpty ? 'var(--border)' : 'var(--navy)'}`,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1,
                }}>
                  <div style={{ fontSize:9, fontWeight:800, color:isToday?'var(--navy)':'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>{SHORT[i]}</div>
                  <div style={{ fontFamily:'Fraunces, serif', fontSize:17, fontWeight:900, color:isToday?'var(--navy)':isEmpty?'var(--muted)':'var(--navy)', lineHeight:1 }}>{DATES[i]}</div>
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  {isEmpty ? (
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)' }}>tap to plan this day</div>
                  ) : (
                    <>
                      <div style={{ display:'flex', gap:5, alignItems:'center', marginBottom:4, flexWrap:'wrap' }}>
                        {meals.map(({ slot, recipe }) => (
                          <div key={slot.id} style={{ display:'flex', alignItems:'center', gap:3 }}>
                            <span style={{ fontSize:10 }}>{slot.emoji}</span>
                            <span style={{ fontSize:17 }}>{recipe.flag}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {meals.map(({ recipe }) => recipe.name).join(' · ')}
                      </div>
                    </>
                  )}
                </div>

                {/* Badge + arrow */}
                <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                  {!isEmpty && (
                    <div style={{ background:mode.color, color:'var(--navy)', width:21, height:21, borderRadius:7, border:'1.5px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900 }}>
                      {meals.length}
                    </div>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity:.25 }}>
                    <path d="M9 6L15 12L9 18" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary card */}
        {totalMeals > 0 && (
          <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:'13px 15px', marginBottom:14, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>week summary</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[['🍽️', totalMeals, 'meals'],[mode.emoji, daysPlanned, 'days'],['✨', mode.name, 'mode']].map(([ico,val,lbl]) => (
                <div key={lbl} style={{ background:'var(--paper)', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
                  <div style={{ fontSize:18, marginBottom:2 }}>{ico}</div>
                  <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)' }}>{val}</div>
                  <div style={{ fontSize:9, color:'var(--muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:10, marginBottom:8 }}>
          <button onClick={() => router.push('/home')}
            style={{ flex:2, padding:14, borderRadius:12, border:'2px solid var(--navy)', background:mode.color, color:'var(--navy)', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)' }}
            onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='none'}}
            onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-sm)'}}>
            ✓ back to home
          </button>
          {totalMeals > 0 && (
            <button onClick={clearWeek}
              style={{ flex:1, padding:14, borderRadius:12, border:'2px solid var(--coral)', background:'var(--coral-l)', color:'var(--coral)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
              clear week
            </button>
          )}
        </div>

        <div style={{ height:12 }}/>
      </div>

      {openDay !== null && (
        <DaySheet day={DAYS[openDay]} dayIdx={openDay} mode={mode} onClose={() => setOpenDay(null)}/>
      )}

      <NavBar/>
    </div>
  )
}