'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { RECIPES, WEEK_MODES } from '@/lib/data'

const DEMO_HOUSEMATES = [
  { id:1, name:'Linh',   avatar:'👩', color:'#F5C842', meals:3 },
  { id:2, name:'Jake',   avatar:'👨', color:'#7ED8A4', meals:4 },
  { id:3, name:'Priya',  avatar:'👩‍🦱', color:'#B8A0F8', meals:2 },
]

const SHARED_ITEMS = [
  { id:1, n:'Garlic (1 bulb)',     p:1.00, e:'🧄', who:['you','Linh'] },
  { id:2, n:'Rice noodles (500g)', p:2.00, e:'🍜', who:['Linh'] },
  { id:3, n:'Olive oil (500ml)',   p:5.00, e:'🫒', who:['you','Linh','Jake','Priya'] },
  { id:4, n:'Feta cheese (200g)',  p:3.00, e:'🧀', who:['you'] },
  { id:5, n:'Parmesan (100g)',     p:2.00, e:'🧀', who:['Jake'] },
  { id:6, n:'Lemongrass',         p:1.50, e:'🌿', who:['you','Priya'] },
  { id:7, n:'Gochujang paste',    p:3.50, e:'🌶️', who:['Linh','Jake'] },
  { id:8, n:'Garam masala',       p:2.50, e:'🫙', who:['Priya'] },
]

export default function CookTogetherPage() {
  const router = useRouter()
  const { userName, weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  const [tab, setTab]       = useState('plan')  // plan | split | invite
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState([1])   // Linh already joined

  const shareLink = 'nomster.app/join/abc123'

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareLink).catch(()=>{})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate split per person
  const totalCost = SHARED_ITEMS.reduce((a,i) => a + i.p, 0)
  const splits = {}
  SHARED_ITEMS.forEach(item => {
    const perPerson = item.p / item.who.length
    item.who.forEach(person => {
      splits[person] = (splits[person] || 0) + perPerson
    })
  })

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column' }}>
      <div style={{ height:4, background:mode.color }} />

      {/* Header */}
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1.5px solid var(--border)' }}>
        <button onClick={() => router.push('/home')} className="retro-btn"
          style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
          ← home
        </button>
        <div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>
            cook together 👯
          </h2>
          <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>
            shared meal plan · split grocery costs
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid var(--navy)', flexShrink:0 }}>
        {[['plan','📅 shared plan'],['split','💰 cost split'],['invite','👥 housemates']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              flex:1, padding:'12px 8px', border:'none',
              borderBottom: tab===key ? `3px solid ${mode.color}` : '3px solid transparent',
              background: tab===key ? `${mode.color}20` : 'transparent',
              color: tab===key ? 'var(--navy)' : 'var(--muted)',
              fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:800,
              cursor:'pointer', transition:'all .15s',
            }}>{label}</button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>

        {/* ── SHARED PLAN TAB ── */}
        {tab === 'plan' && (
          <>
            {/* Housemates row */}
            <div style={{ display:'flex', gap:8, marginBottom:16, alignItems:'center' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>cooking with</div>
              {[{ id:0, name:userName||'You', avatar:'🧑', color:mode.color }, ...DEMO_HOUSEMATES.filter(h=>invited.includes(h.id))].map(h => (
                <div key={h.id} style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:`${h.color}40`, border:`2px solid ${h.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{h.avatar}</div>
                </div>
              ))}
              <button onClick={() => setTab('invite')}
                style={{ width:32, height:32, borderRadius:10, border:'2px dashed var(--border)', background:'transparent', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)' }}>+</button>
            </div>

            {/* Shared recipe list */}
            <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)', marginBottom:10 }}>
              this week's shared menu
            </div>
            {RECIPES.slice(0,5).map((r, i) => {
              const housemates = [{ name:userName||'You', avatar:'🧑', color:mode.color }, ...DEMO_HOUSEMATES.filter(h=>invited.includes(h.id))]
              const assignedTo = housemates[i % housemates.length]
              return (
                <div key={r.id} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:12, display:'flex', alignItems:'center', gap:10, marginBottom:8, boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ width:46, height:46, background:`${mode.color}25`, border:'2px solid var(--navy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{r.flag}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{r.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{r.cuisine} · {r.time}min · ${r.cost}</div>
                  </div>
                  {/* Assigned to */}
                  <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                    <div style={{ width:24, height:24, borderRadius:7, background:`${assignedTo.color}40`, border:`1.5px solid ${assignedTo.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>{assignedTo.avatar}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)' }}>{assignedTo.name}</div>
                  </div>
                </div>
              )
            })}

            <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:12, padding:'10px 14px', marginTop:8 }}>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:700, color:'var(--navy)', lineHeight:1.6 }}>
                💡 each person cooks 1-2 meals and shares — less effort, more variety, lower cost for everyone!
              </div>
            </div>
          </>
        )}

        {/* ── COST SPLIT TAB ── */}
        {tab === 'split' && (
          <>
            {/* Total */}
            <div style={{ background:'var(--navy)', border:'2px solid var(--navy)', borderRadius:16, padding:16, marginBottom:14, boxShadow:'var(--shadow-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:'rgba(245,200,66,0.6)', textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>total groceries</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:28, fontWeight:900, color:mode.color }}>${totalCost.toFixed(2)}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>shared between</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'#fff' }}>{1 + invited.length} people</div>
              </div>
            </div>

            {/* Per person breakdown */}
            <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)', marginBottom:10 }}>who pays what</div>
            {[{ name:userName||'You', avatar:'🧑', color:mode.color }, ...DEMO_HOUSEMATES.filter(h=>invited.includes(h.id))].map(person => {
              const amt = splits[person.id===0?'you':person.name] || 0
              return (
                <div key={person.name} style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${person.color}40`, border:`2px solid ${person.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{person.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)' }}>{person.name}</div>
                    <div style={{ height:6, background:'var(--paper)', border:'1.5px solid var(--border)', borderRadius:3, overflow:'hidden', marginTop:5 }}>
                      <div style={{ height:'100%', background:person.color, width:`${(amt/totalCost)*100}%`, transition:'width 1s ease' }} />
                    </div>
                  </div>
                  <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)', flexShrink:0 }}>${amt.toFixed(2)}</div>
                </div>
              )
            })}

            {/* Items breakdown */}
            <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)', marginTop:14, marginBottom:10 }}>shared items</div>
            {SHARED_ITEMS.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:10, marginBottom:6 }}>
                <span style={{ fontSize:18 }}>{item.e}</span>
                <div style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--navy)' }}>{item.n}</div>
                <div style={{ display:'flex', gap:3 }}>
                  {item.who.map(w => (
                    <div key={w} style={{ width:20, height:20, borderRadius:6, background:'var(--yellow-l)', border:'1px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'var(--navy)' }}>{w[0]}</div>
                  ))}
                </div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--navy)', minWidth:40, textAlign:'right' }}>${item.p.toFixed(2)}</div>
              </div>
            ))}
          </>
        )}

        {/* ── INVITE TAB ── */}
        {tab === 'invite' && (
          <>
            {/* Share link */}
            <div style={{ background:'var(--navy)', border:'2px solid var(--navy)', borderRadius:16, padding:16, marginBottom:16, boxShadow:'var(--shadow-md)' }}>
              <div style={{ fontSize:10, fontWeight:800, color:'rgba(245,200,66,0.6)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>your share link</div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ flex:1, background:'rgba(255,255,255,.1)', border:'1.5px solid rgba(245,200,66,0.3)', borderRadius:10, padding:'10px 12px', fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>
                  {shareLink}
                </div>
                <button onClick={handleCopy}
                  style={{ padding:'10px 14px', borderRadius:10, border:'2px solid var(--yellow)', background:copied?'var(--yellow)':'transparent', color:copied?'var(--navy)':'var(--yellow)', fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:800, cursor:'pointer', transition:'all .2s' }}>
                  {copied ? '✓ copied!' : 'copy'}
                </button>
              </div>
            </div>

            {/* Housemates */}
            <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)', marginBottom:10 }}>your household</div>
            {/* You */}
            <div style={{ background:mode.color, border:'2px solid var(--navy)', borderRadius:14, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'rgba(27,43,75,0.2)', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🧑</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)' }}>{userName||'You'}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(27,43,75,0.6)' }}>admin · meal plan owner</div>
              </div>
              <div style={{ background:'var(--navy)', color:mode.color, padding:'3px 10px', borderRadius:8, fontSize:10, fontWeight:800 }}>you</div>
            </div>

            {DEMO_HOUSEMATES.map(h => {
              const joined = invited.includes(h.id)
              return (
                <div key={h.id} style={{ background:'var(--white)', border:`2px solid ${joined?'var(--navy)':'var(--border)'}`, borderRadius:14, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:joined?'var(--shadow-sm)':'none', opacity:joined?1:0.7 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${h.color}40`, border:`2px solid ${joined?'var(--navy)':'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{h.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:800, color:'var(--navy)' }}>{h.name}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)' }}>{joined ? `✓ joined · ${h.meals} meals planned` : 'invite pending...'}</div>
                  </div>
                  {!joined && (
                    <button onClick={() => setInvited(p => [...p, h.id])}
                      style={{ padding:'7px 12px', borderRadius:9, border:'2px solid var(--navy)', background:'var(--yellow)', color:'var(--navy)', fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
                      add
                    </button>
                  )}
                </div>
              )
            })}

            <div style={{ marginTop:4 }}>
              <button className="retro-btn"
                style={{ width:'100%', padding:13, background:'var(--white)', color:'var(--navy)', fontSize:13 }}
                onClick={handleCopy}>
                📲 share invite link
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
