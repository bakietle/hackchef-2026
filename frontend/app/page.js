'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MamaIdle from '@/components/mama/MamaIdle'
import NomsterLogo from '@/components/NomsterLogo'
import { createUser } from '@/lib/api'
import { usePlannerStore } from '@/lib/plannerStore'

export default function WelcomePage() {
  const router = useRouter()
  const userId = usePlannerStore((state) => state.userId)
  const storedUserName = usePlannerStore((state) => state.userName)
  const setUserSession = usePlannerStore((state) => state.setUserSession)

  const [name, setName] = useState('')
  const [floatY, setFloatY] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let dir = 1
    const iv = setInterval(() => {
      setFloatY((value) => {
        if (value > 8) dir = -1
        if (value < -8) dir = 1
        return value + dir * 0.5
      })
    }, 50)

    return () => clearInterval(iv)
  }, [])

  const handleStart = async () => {
    if (submitting) return

    const nextName = name.trim() || 'Foodie'
    setError('')
    setSubmitting(true)

    try {
      if (userId && storedUserName === nextName) {
        setUserSession({ userId, userName: nextName })
        router.push('/home')
        return
      }

      const user = await createUser(nextName)
      setUserSession({
        userId: user.id,
        userName: user.username || nextName,
      })
      router.push('/home')
    } catch (err) {
      setError(err.message || 'Could not connect to the backend.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1b2b4b, #2d3e70)',
        color: 'var(--navy)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
        <NomsterLogo size="md" />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '16px 24px',
          position: 'relative',
        }}
      >
        <div
          style={{
            marginBottom: 20,
            transform: `translateY(${floatY}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          <MamaIdle size={140} />
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid var(--navy)',
            borderRadius: '16px 16px 16px 4px',
            padding: '12px 18px',
            maxWidth: 240,
            margin: '0 auto 24px',
            lineHeight: 1.6,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'relative',
            animation: 'fadeInUp 0.8s ease forwards',
            opacity: 0,
          }}
        >
          hi! i'm mama - let's make your week tasty and smart
        </div>

        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 38,
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.05,
            marginBottom: 10,
            letterSpacing: '-0.5px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Your AI
          <br />
          <span
            style={{
              color: '#ffe066',
              WebkitTextStroke: '1px #1b2b4b',
              textShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            meal mama
          </span>
        </h1>

        <p
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 600,
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          Plan your week · Save money · Eat well
        </p>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            ['Students', 'Student friendly'],
            ['Global', 'Multicultural'],
            ['AI', 'AI-powered'],
          ].map(([ico, label], idx) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,224,102,0.2)',
                border: '1.5px solid #1b2b4b',
                borderRadius: 22,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                opacity: 0,
                transform: 'translateY(10px)',
                animation: 'fadeInUp 0.6s ease forwards',
                animationDelay: `${idx * 0.15}s`,
              }}
            >
              <span>{ico}</span> {label}
            </div>
          ))}
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 360,
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid var(--navy)',
            borderRadius: 20,
            padding: '22px 20px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 12,
              textAlign: 'left',
            }}
          >
            What should mama call you?
          </div>
          <input
            style={{
              width: '100%',
              background: 'var(--paper)',
              border: '2px solid var(--border)',
              borderRadius: 12,
              padding: '14px 16px',
              fontSize: 15,
              fontFamily: 'Nunito, sans-serif',
              outline: 'none',
              fontWeight: 700,
              color: 'var(--navy)',
              marginBottom: 16,
            }}
            placeholder="e.g. Alex"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleStart()}
            autoFocus
            disabled={submitting}
          />
          {error && (
            <div style={{ color: 'var(--coral)', fontSize: 12, fontWeight: 700, marginBottom: 12, textAlign: 'left' }}>
              {error}
            </div>
          )}
          <button
            onClick={handleStart}
            className="retro-btn"
            disabled={submitting}
            style={{
              width: '100%',
              padding: 16,
              background: 'linear-gradient(90deg, #ffe066, #ffba49)',
              color: '#1b2b4b',
              fontSize: 16,
              fontWeight: 900,
              borderRadius: 12,
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Connecting...' : "Let's get cooking"}
          </button>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: '14px 20px 20px',
          fontSize: 11,
          color: 'var(--muted)',
          fontWeight: 600,
        }}
      >
        nomster · made by LAWA
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
