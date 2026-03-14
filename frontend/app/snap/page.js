'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES } from '@/lib/data'

const DETECTED_SETS = [
  ['Eggs', 'Milk', 'Cheese', 'Butter', 'Tomatoes', 'Garlic', 'Spinach'],
  ['Chicken', 'Rice', 'Broccoli', 'Soy sauce', 'Garlic', 'Onion', 'Carrot'],
  ['Pasta', 'Canned tomatoes', 'Beef mince', 'Onion', 'Garlic', 'Mushrooms'],
  ['Eggs', 'Avocado', 'Lemon', 'Bread', 'Cheese', 'Spinach', 'Tomatoes'],
]

const SCAN_MSGS = [
  'scanning fridge contents...',
  'detecting ingredients...',
  'identifying freshness levels...',
  'cross-referencing pantry items...',
  'almost done! ✨',
]

export default function SnapFridgePage() {
  const router = useRouter()
  const { weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]
  const fileRef = useRef(null)

  const [phase, setPhase]       = useState('idle') // idle | scanning | result
  const [preview, setPreview]   = useState(null)
  const [scanMsg, setScanMsg]   = useState(SCAN_MSGS[0])
  const [progress, setProgress] = useState(0)
  const [detected, setDetected] = useState([])
  const [selected, setSelected] = useState([])
  const [scanIdx]               = useState(() => Math.floor(Math.random() * DETECTED_SETS.length))

  const handleFile = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    startScan()
  }

  const startScan = () => {
    setPhase('scanning')
    setProgress(0)
    let pct = 0, si = 0
    const iv = setInterval(() => {
      pct += Math.random() * 18 + 8
      if (pct > 96) pct = 96
      setProgress(pct)
      setScanMsg(SCAN_MSGS[Math.min(si++, SCAN_MSGS.length - 1)])
    }, 400)
    setTimeout(() => {
      clearInterval(iv)
      setProgress(100)
      const items = DETECTED_SETS[scanIdx]
      setTimeout(() => {
        setDetected(items)
        setSelected(items)
        setPhase('result')
      }, 300)
    }, 2600)
  }

  const useDemoPhoto = () => {
    setPreview('/fridge-demo.jpg')
    startScan()
  }

  const toggle = (item) =>
    setSelected(p => p.includes(item) ? p.filter(x => x !== item) : [...p, item])

  const handleUseIngredients = () => {
    router.push('/input?snap=1&ing=' + encodeURIComponent(selected.join(',')))
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column' }}>
      <div style={{ height:4, background:mode.color }} />

      {/* Header */}
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1.5px solid var(--border)' }}>
        <button onClick={() => router.push('/input')} className="retro-btn"
          style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
          ← back
        </button>
        <div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>
            snap ur fridge 📸
          </h2>
          <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>
            AI detects your ingredients instantly
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>

        {/* ── IDLE ── */}
        {phase === 'idle' && (
          <>
            {/* Camera area */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                background:'var(--navy)', border:'2px solid var(--navy)', borderRadius:20,
                height:260, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                gap:12, cursor:'pointer', marginBottom:16,
                position:'relative', overflow:'hidden',
                boxShadow:'var(--shadow-md)',
              }}>
              {/* Viewfinder corners */}
              {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                <div key={`${v}${h}`} style={{
                  position:'absolute', [v]:16, [h]:16,
                  width:24, height:24,
                  borderTop: v==='top' ? '3px solid var(--yellow)' : 'none',
                  borderBottom: v==='bottom' ? '3px solid var(--yellow)' : 'none',
                  borderLeft:  h==='left'  ? '3px solid var(--yellow)' : 'none',
                  borderRight: h==='right' ? '3px solid var(--yellow)' : 'none',
                }} />
              ))}
              <div style={{ fontSize:52 }}>📷</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'#fff' }}>
                tap to open camera
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>
                or upload a photo of your fridge
              </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" capture="environment"
              style={{ display:'none' }}
              onChange={e => handleFile(e.target.files?.[0])} />

            {/* OR divider */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
              <span style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:700, color:'var(--muted)' }}>or try the demo</span>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
            </div>

            {/* Demo button */}
            <button onClick={useDemoPhoto} className="retro-btn"
              style={{ width:'100%', padding:14, background:'var(--yellow)', color:'var(--navy)', fontSize:14, fontWeight:900, boxShadow:'var(--shadow-md)' }}
              onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
              onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
              🧪 use demo fridge photo
            </button>

            {/* How it works */}
            <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:16, marginTop:16, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)', marginBottom:10 }}>how it works</div>
              {[
                ['📸', 'Snap a photo of your open fridge'],
                ['🧠', 'AI scans and identifies every ingredient'],
                ['✅', 'Review detected items, tap to remove any'],
                ['🍳', 'Mama plans your meals from what you have'],
              ].map(([ico, txt]) => (
                <div key={txt} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'var(--yellow-l)', border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{ico}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--navy)' }}>{txt}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── SCANNING ── */}
        {phase === 'scanning' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:20 }}>
            {/* Preview */}
            <div style={{ width:'100%', height:220, borderRadius:16, border:'2px solid var(--navy)', overflow:'hidden', position:'relative', boxShadow:'var(--shadow-md)' }}>
              {preview ? (
                <img src={preview} alt="fridge" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              ) : (
                <div style={{ width:'100%', height:'100%', background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>🧊</div>
              )}
              {/* scan line animation */}
              <div style={{
                position:'absolute', left:0, right:0, height:3,
                background:'rgba(245,200,66,0.8)',
                top:`${progress}%`,
                transition:'top .3s ease',
                boxShadow:'0 0 10px rgba(245,200,66,0.6)',
              }} />
              {/* overlay */}
              <div style={{ position:'absolute', inset:0, background:'rgba(27,43,75,0.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ background:'rgba(27,43,75,0.9)', borderRadius:12, padding:'10px 18px' }}>
                  <div style={{ fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:800, color:'var(--yellow)' }}>
                    🔍 {scanMsg}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width:'100%' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)' }}>analysing...</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)' }}>{Math.round(progress)}%</div>
              </div>
              <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:5, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ height:'100%', background:mode.color, width:`${progress}%`, transition:'width .4s ease' }} />
              </div>
            </div>

            {/* skeleton items appearing */}
            <div style={{ width:'100%', display:'flex', flexWrap:'wrap', gap:8 }}>
              {[100,80,120,90,110,70,95].map((w,i) => (
                <div key={i} className="skel" style={{ height:32, width:w, borderRadius:20, animationDelay:`${i*.1}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === 'result' && (
          <>
            {/* Photo + badge */}
            <div style={{ position:'relative', marginBottom:14 }}>
              <div style={{ width:'100%', height:180, borderRadius:16, border:'2px solid var(--navy)', overflow:'hidden', boxShadow:'var(--shadow-md)' }}>
                {preview ? (
                  <img src={preview} alt="fridge" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%', background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>🧊</div>
                )}
              </div>
              <div style={{ position:'absolute', bottom:-10, right:12, background:'var(--mint)', border:'2px solid var(--navy)', borderRadius:20, padding:'5px 14px', fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:900, color:'var(--navy)', boxShadow:'var(--shadow-sm)' }}>
                ✓ {detected.length} items detected
              </div>
            </div>

            {/* Detected chips */}
            <div style={{ background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:16, marginBottom:14, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)' }}>
                  mama found these 👀
                </div>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:700, color:'var(--muted)' }}>
                  tap to remove
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {detected.map(item => {
                  const on = selected.includes(item)
                  return (
                    <button key={item} onClick={() => toggle(item)}
                      style={{
                        padding:'7px 13px', borderRadius:20, fontSize:12, fontWeight:800,
                        fontFamily:'Nunito, sans-serif', cursor:'pointer',
                        border:`2px solid ${on ? 'var(--navy)' : 'var(--border)'}`,
                        background: on ? mode.color : 'var(--paper)',
                        color: on ? 'var(--navy)' : 'var(--muted)',
                        boxShadow: on ? 'var(--shadow-sm)' : 'none',
                        textDecoration: on ? 'none' : 'line-through',
                        opacity: on ? 1 : 0.5,
                        transition:'all .12s',
                        display:'flex', alignItems:'center', gap:5,
                      }}>
                      {on ? '✓' : '✕'} {item}
                    </button>
                  )
                })}
              </div>
              <div style={{ marginTop:10, fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:700, color:'var(--muted)', textAlign:'right' }}>
                {selected.length} of {detected.length} selected
              </div>
            </div>

            {/* Add more manually */}
            <div style={{ background:'var(--yellow-l)', border:'2px solid var(--navy)', borderRadius:14, padding:'10px 14px', marginBottom:16, display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontSize:16 }}>💡</span>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:700, color:'var(--navy)', lineHeight:1.5 }}>
                mama can only see what's visible — add anything she missed on the next screen
              </div>
            </div>

            {/* Retry */}
            <button onClick={() => { setPhase('idle'); setPreview(null); setDetected([]); setSelected([]) }}
              className="retro-btn"
              style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13, marginBottom:10 }}>
              📸 take another photo
            </button>

            {/* Use ingredients */}
            <button onClick={handleUseIngredients}
              style={{ width:'100%', padding:15, borderRadius:12, border:'2px solid var(--navy)', background:'var(--yellow)', color:'var(--navy)', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)' }}
              onMouseDown={e=>{e.currentTarget.style.transform='translate(2px,3px)';e.currentTarget.style.boxShadow='0 0 0 var(--navy)'}}
              onMouseUp={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow-md)'}}>
              use these {selected.length} ingredients →
            </button>
          </>
        )}

      </div>
    </div>
  )
}
