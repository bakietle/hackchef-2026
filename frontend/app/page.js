'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleStart = () => {
    if (!name.trim()) return
    localStorage.setItem('userName', name.trim())
    router.push('/home')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFAF4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: 80, marginBottom: 8 }}>🧑‍🍳</div>

      <div style={{
        background: '#fff',
        border: '1.5px solid #D8D0C0',
        borderRadius: '4px 4px 4px 0',
        padding: '14px 18px',
        fontSize: 13,
        color: '#555',
        maxWidth: 220,
        margin: '0 auto 28px',
        lineHeight: 1.7,
      }}>
        hey! i'm mama 💕<br/>
        let me help you eat<br/>
        something real this week~
      </div>

      <div style={{ fontSize: 11, letterSpacing: 4, color: '#A87840', marginBottom: 6 }}>
        HACKCHEF
      </div>
      <h1 style={{ fontSize: 44, fontWeight: 900, color: '#1C1812', marginBottom: 6 }}>
        UR MEAL MAMA 🍳
      </h1>
      <p style={{ fontSize: 13, color: '#8A7A60', marginBottom: 32 }}>
        AI-powered weekly meal planning
      </p>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: '#8A7A60', marginBottom: 6 }}>
            WHAT SHOULD MAMA CALL YOU?
          </label>
          <input
            style={{
              width: '100%',
              border: 'none',
              borderBottom: '1.5px solid #D8D0C0',
              padding: '10px 0',
              fontSize: 14,
              outline: 'none',
              background: 'transparent',
            }}
            placeholder="e.g. Alex"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            autoFocus
          />
        </div>
        <button
          onClick={handleStart}
          style={{
            padding: '14px 20px',
            background: '#1C1812',
            color: '#D4A96A',
            border: 'none',
            fontSize: 14,
            letterSpacing: 2,
            cursor: 'pointer',
            marginTop: 4,
          }}>
          LET'S COOK →
        </button>
      </div>
    </div>
  )
}