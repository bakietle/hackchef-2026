'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES } from '@/lib/data'
import NomsterLogo from '@/components/NomsterLogo'

const DESTINATIONS = {
  snap: {
    path: '/snap',
    emoji: '📸',
    headline: "snap ur fridge",
    sub: "mama's getting the camera ready...",
    msgs: [
      "warming up the AI vision...",
      "calibrating ingredient detection...",
      "ready to scan ur fridge ✨",
    ],
    color: '#F5C842',
  },
  together: {
    path: '/together',
    emoji: '👯',
    headline: "cook together",
    sub: "mama's setting the table for everyone...",
    msgs: [
      "rounding up ur housemates...",
      "calculating shared costs...",
      "the more the merrier 💕",
    ],
    color: '#7ED8A4',
  },
  autocart: {
    path: '/autocart',
    emoji: '🛒',
    headline: "auto cart",
    sub: "mama's comparing every price for u...",
    msgs: [
      "connecting to Woolworths & Coles...",
      "scanning this week's best deals...",
      "ur wallet is about to thank u 💸",
    ],
    color: '#C8F135',
  },
}

export default function MamaBridgePage() {
  const router       = useSearchParams ? useRouter() : useRouter()
  const params       = useSearchParams?.() || null
  const dest         = params?.get('to') || 'snap'
  const { weekMode } = usePlannerStore()
  const mode         = WEEK_MODES.find(m => m.key === weekMode) || WEEK_MODES[0]

  const config   = DESTINATIONS[dest] || DESTINATIONS.snap
  const [msgIdx, setMsgIdx]   = useState(0)
  const [pct,    setPct]      = useState(0)
  const [done,   setDone]     = useState(false)

  useEffect(() => {
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 22 + 12
      if (p > 96) p = 96
      setPct(p)
      setMsgIdx(i => Math.min(i + 1, config.msgs.length - 1))
    }, 520)

    const t = setTimeout(() => {
      clearInterval(iv)
      setPct(100)
      setDone(true)
      setTimeout(() => router.push(config.path), 380)
    }, 1900)

    return () => { clearInterval(iv); clearTimeout(t) }
  }, [config, router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 28px',
      textAlign: 'center',
    }}>

      {/* Logo top */}
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <NomsterLogo size="sm" animate={false} />
      </div>

      {/* Mama cooking SVG — inline, animated */}
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 28 }}>
        {/* Pulse rings */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="58" fill="none" stroke={`${config.color}50`} strokeWidth="3" className="pulse-ring1"/>
          <circle cx="80" cy="80" r="42" fill="none" stroke={`${config.color}35`} strokeWidth="2" className="pulse-ring2"/>
        </svg>

        {/* Feature emoji floating */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 64,
          animation: 'mamaFloat 2s ease-in-out infinite',
        }}>
          {config.emoji}
        </div>
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'Fraunces, serif',
        fontSize: 28, fontWeight: 900,
        color: 'var(--navy)',
        lineHeight: 1.15,
        marginBottom: 8,
        letterSpacing: '-0.5px',
      }}>
        mama is getting<br />
        <span style={{ color: config.color, WebkitTextStroke: '1.5px var(--navy)' }}>
          {config.headline}
        </span><br />
        ready for u~
      </h1>

      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: 13, fontWeight: 700,
        color: 'var(--muted)',
        marginBottom: 28,
        lineHeight: 1.6,
      }}>
        {config.sub}
      </p>

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 300, marginBottom: 14 }}>
        <div style={{
          height: 10,
          background: 'var(--white)',
          border: '2px solid var(--navy)',
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            height: '100%',
            background: config.color,
            width: `${pct}%`,
            transition: 'width .5s ease',
          }}/>
        </div>
      </div>

      {/* Status message */}
      <div style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: 12, fontWeight: 700,
        color: done ? mode.color : 'var(--muted)',
        minHeight: 20,
        transition: 'color .3s',
      }}>
        {done ? '✓ ready!' : config.msgs[msgIdx]}
      </div>

    </div>
  )
}
