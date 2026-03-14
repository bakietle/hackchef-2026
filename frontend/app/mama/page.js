'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES } from '@/lib/data'
import NomsterLogo from '@/components/NomsterLogo'

const CONFIGS = {
  snap: {
    dest:     '/snap',
    emoji:    '📸',
    headline: 'snap ur fridge',
    lines:    ['warming up the AI vision...', 'calibrating ingredient detection...', 'camera is ready ✨'],
    color:    '#F5C842',
  },
  autocart: {
    dest:     '/autocart',
    emoji:    '🛒',
    headline: 'auto cart',
    lines:    ['connecting to Woolworths & Coles...', 'scanning this week\'s best deals...', 'ur wallet is about to thank u 💸'],
    color:    '#C8F135',
  },
}

function BridgeContent() {
  const router  = useRouter()
  const params  = useSearchParams()
  const dest    = params.get('to') || 'snap'
  const cfg     = CONFIGS[dest] || CONFIGS.snap
  const { weekMode } = usePlannerStore()
  const mode    = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]

  const [msgIdx, setMsgIdx] = useState(0)
  const [pct,    setPct]    = useState(0)

  useEffect(() => {
    let p = 0, si = 0
    const iv = setInterval(() => {
      p += Math.random() * 24 + 14; if (p > 96) p = 96
      setPct(p)
      setMsgIdx(Math.min(si++, cfg.lines.length - 1))
    }, 520)
    const done = setTimeout(() => {
      clearInterval(iv); setPct(100)
      setTimeout(() => router.push(cfg.dest), 300)
    }, 1900)
    return () => { clearInterval(iv); clearTimeout(done) }
  }, [cfg, router])

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 28px', textAlign:'center', position:'relative' }}>

      <div style={{ position:'absolute', top:20, left:20 }}>
        <NomsterLogo size="sm" animate={false}/>
      </div>

      {/* Pulse rings + emoji */}
      <div style={{ position:'relative', width:160, height:160, marginBottom:28 }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="58" fill="none" stroke={`${cfg.color}60`} strokeWidth="3" className="pulse-ring1"/>
          <circle cx="80" cy="80" r="40" fill="none" stroke={`${cfg.color}35`} strokeWidth="2" className="pulse-ring2"/>
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:68, animation:'mamaFloat 2s ease-in-out infinite' }}>
          {cfg.emoji}
        </div>
      </div>

      <h1 style={{ fontFamily:'Fraunces, serif', fontSize:28, fontWeight:900, color:'var(--navy)', lineHeight:1.15, marginBottom:8, letterSpacing:'-0.5px' }}>
        mama is getting<br/>
        <span style={{ color:cfg.color, WebkitTextStroke:'1.5px var(--navy)' }}>{cfg.headline}</span><br/>
        ready for u~
      </h1>

      <p style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:28, lineHeight:1.6, minHeight:20 }}>
        {cfg.lines[msgIdx]}
      </p>

      <div style={{ width:'100%', maxWidth:300 }}>
        <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:6, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ height:'100%', background:cfg.color, width:`${pct}%`, transition:'width .5s ease' }}/>
        </div>
      </div>
    </div>
  )
}

export default function MamaBridgePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize:64, animation:'mamaFloat 2s ease-in-out infinite' }}>🍳</div>
      </div>
    }>
      <BridgeContent/>
    </Suspense>
  )
}
