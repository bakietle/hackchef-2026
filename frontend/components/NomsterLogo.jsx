'use client'
import { useEffect, useState } from 'react'

/**
 * NomsterLogo — animated wordmark
 * Props:
 *   size    = 'sm' | 'md' | 'lg'  (default 'md')
 *   dark    = true/false           (yellow text for dark bg)
 *   animate = true/false           (default true)
 *   tagline = true/false           (show "ur meal mama" below)
 */
export default function NomsterLogo({ size='md', dark=false, animate=true, tagline=false }) {
  const [mounted, setMounted] = useState(false)
  const [dotBounce, setDotBounce] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!animate) return
    // dot bounces every 4s
    const iv = setInterval(() => {
      setDotBounce(true)
      setTimeout(() => setDotBounce(false), 600)
    }, 4000)
    // trigger once on mount after 800ms
    const t = setTimeout(() => { setDotBounce(true); setTimeout(() => setDotBounce(false), 600) }, 800)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [animate])

  const sizes = {
    sm: { fontSize: 18, dotSize: 5, dotTop: -2, dotLeft: 10, gap: 2 },
    md: { fontSize: 24, dotSize: 7, dotTop: -3, dotLeft: 14, gap: 3 },
    lg: { fontSize: 34, dotSize: 9, dotTop: -4, dotLeft: 19, gap: 4 },
  }
  const s = sizes[size] || sizes.md
  const color = dark ? '#F5C842' : '#1B2B4B'
  const dotColor = '#F5C842'
  const dotBorder = dark ? 'rgba(255,255,255,0.3)' : '#1B2B4B'

  return (
    <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'flex-start', gap: tagline ? 2 : 0 }}>
      {/* Wordmark row */}
      <div style={{ position:'relative', display:'inline-block' }}>

        {/* Animated dot above the 'o' */}
        <span
          style={{
            position:'absolute',
            top: s.dotTop,
            left: s.dotLeft,
            width: s.dotSize,
            height: s.dotSize,
            background: dotColor,
            border: `1.5px solid ${dotBorder}`,
            borderRadius: '50%',
            display: 'block',
            transformOrigin: 'center bottom',
            transition: 'transform 0.15s cubic-bezier(.34,1.56,.64,1)',
            transform: dotBounce ? 'translateY(-5px) scale(1.2)' : 'translateY(0) scale(1)',
          }}
        />

        {/* The wordmark text — Fraunces 900 */}
        <span
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: s.fontSize,
            fontWeight: 900,
            color: color,
            letterSpacing: '-0.8px',
            lineHeight: 1,
            display: 'block',
            // Entrance animation
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          nomster
        </span>
      </div>

      {/* Optional tagline */}
      {tagline && (
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: Math.max(9, s.fontSize * 0.36),
            fontWeight: 800,
            color: dark ? 'rgba(245,200,66,0.6)' : 'rgba(27,43,75,0.45)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            paddingLeft: 2,
          }}
        >
          ur meal mama
        </span>
      )}
    </div>
  )
}

