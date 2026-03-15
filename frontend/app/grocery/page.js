'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import {
  generateShoppingList,
  getShoppingList,
  toggleShoppingListItem,
} from '@/lib/api'
import { WEEK_MODES, FOOD_TIPS } from '@/lib/data'
import {
  IconHome,
  IconCalendar,
  IconCart,
  IconHeart,
  IconProfile,
  IconChevLeft,
  IconCheck,
} from '@/components/Icons'
import { MamaHappy } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import NomsterLogo from '@/components/NomsterLogo'

function ingredientEmoji(name) {
  const text = String(name || '').toLowerCase()

  if (text.includes('egg')) return '🥚'
  if (text.includes('rice')) return '🍚'
  if (text.includes('bread')) return '🍞'
  if (text.includes('milk')) return '🥛'
  if (text.includes('cheese')) return '🧀'
  if (text.includes('tomato')) return '🍅'
  if (text.includes('onion')) return '🧅'
  if (text.includes('garlic')) return '🧄'
  if (text.includes('broccoli')) return '🥦'
  if (text.includes('carrot')) return '🥕'
  if (text.includes('chicken')) return '🍗'
  if (text.includes('beef')) return '🥩'
  if (text.includes('tuna')) return '🐟'
  if (text.includes('tofu')) return '🧈'
  if (text.includes('pasta')) return '🍝'
  if (text.includes('potato')) return '🥔'
  if (text.includes('mushroom')) return '🍄'
  return '🛒'
}

export default function GroceryPage() {
  const router = useRouter()
  const { weekMode, currentMealPlanId, setShopItems } = usePlannerStore()
  const mode = WEEK_MODES.find((m) => m.key === weekMode) || WEEK_MODES[0]

  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState({ msg: '', on: false })
  const [notifOk, setNotifOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tipIdx] = useState(() => Math.floor(Math.random() * FOOD_TIPS.length))

  useEffect(() => {
    let cancelled = false

    async function loadShopping() {
      if (!currentMealPlanId) {
        setItems([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        let data = await getShoppingList(currentMealPlanId)

        if (!data.items || data.items.length === 0) {
          data = await generateShoppingList(currentMealPlanId)
        }

        if (cancelled) return

        const normalized = (data.items || []).map((item) => ({
          id: item.id,
          name: item.ingredient_name,
          checked: item.checked,
        }))

        setItems(normalized)
        setShopItems?.(normalized)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load shopping list.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadShopping()

    return () => {
      cancelled = true
    }
  }, [currentMealPlanId, setShopItems])

  const toggle = async (id) => {
    const previous = items

    const optimistic = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
    setItems(optimistic)
    setShopItems?.(optimistic)

    try {
      const updated = await toggleShoppingListItem(id)
      const next = optimistic.map((item) =>
        item.id === id ? { ...item, checked: updated.checked } : item
      )
      setItems(next)
      setShopItems?.(next)
    } catch (err) {
      setItems(previous)
      setShopItems?.(previous)
      showToast(err.message || 'Could not update item')
    }
  }

  const doneCount = items.filter((i) => i.checked).length
  const allDone = doneCount === items.length && items.length > 0

  const displayed = useMemo(() => {
    if (filter === 'done') return items.filter((i) => i.checked)
    if (filter === 'pending') return items.filter((i) => !i.checked)
    return items
  }, [items, filter])

  const showToast = (msg) => {
    setToast({ msg, on: true })
    setTimeout(() => setToast((t) => ({ ...t, on: false })), 2200)
  }

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      showToast("browser doesn't support notifications")
      return
    }

    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setNotifOk(true)
      showToast('mama will remind u to shop! 🔔')
      setTimeout(() => {
        new Notification('nomster 🍳', {
          body: `don't forget — ${items.filter((i) => !i.checked).length} items left to grab today!`,
          icon: '/icon.svg',
        })
      }, 3000)
    } else {
      showToast('notifications blocked — check ur browser settings')
    }
  }

  const NavBar = () => (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0 20px',
        borderTop: '2px solid var(--navy)',
        background: 'var(--white)',
        zIndex: 50,
      }}
    >
      {[
        { icon: <IconHome size={22} />, label: 'home', path: '/home' },
        { icon: <IconCalendar size={22} />, label: 'planner', path: '/planner' },
        { icon: <IconCart size={22} />, label: 'grocery', path: '/grocery', active: true },
        { icon: <IconHeart size={22} />, label: 'saved', path: '/saved' },
        { icon: <IconProfile size={22} />, label: 'profile', path: '/profile' },
      ].map((nav) => (
        <button
          key={nav.label}
          onClick={() => router.push(nav.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 9,
            color: nav.active ? 'var(--navy)' : 'var(--muted)',
            padding: '0 8px',
            opacity: nav.active ? 1 : 0.45,
          }}
        >
          {nav.icon}
          {nav.label}
        </button>
      ))}
    </div>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 80,
      }}
    >
      <NotifBanner />
      <div style={{ height: 4, background: mode.color }} />

      <div
        style={{
          position: 'fixed',
          top: 60,
          left: '50%',
          transform: toast.on
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(-60px)',
          background: 'var(--navy)',
          borderRadius: 12,
          padding: '9px 18px',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          whiteSpace: 'nowrap',
          opacity: toast.on ? 1 : 0,
          transition: 'all .3s',
          pointerEvents: 'none',
          zIndex: 200,
        }}
      >
        {toast.msg}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => router.push('/home')}
            className="retro-btn"
            style={{
              padding: '8px 12px',
              background: 'var(--white)',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
            }}
          >
            <IconChevLeft size={16} color="var(--navy)" /> home
          </button>

          <h2
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 18,
              fontWeight: 900,
              color: 'var(--navy)',
              flex: 1,
            }}
          >
            shopping list 🛒
          </h2>

          <button
            onClick={enableNotifications}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `2px solid ${notifOk ? 'var(--mint)' : 'var(--border)'}`,
              background: notifOk ? 'var(--mint-l)' : 'var(--white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            {notifOk ? '🔔' : '🔕'}
          </button>

          <NomsterLogo size="sm" animate={false} />
        </div>

        {loading && (
          <div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            loading your shopping list...
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--coral)', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div
          style={{
            background: allDone ? 'var(--mint-l)' : 'var(--navy)',
            border: '2px solid var(--navy)',
            borderRadius: 20,
            padding: 18,
            marginBottom: 14,
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: allDone ? 'var(--navy)' : 'rgba(245,200,66,0.7)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              {allDone ? 'all done! 🎉' : 'items left'}
            </div>
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 30,
                fontWeight: 900,
                color: allDone ? 'var(--navy)' : mode.color,
              }}
            >
              {items.length - doneCount}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 22,
                fontWeight: 900,
                color: allDone ? 'var(--navy)' : 'var(--white)',
              }}
            >
              {doneCount}
              <span style={{ fontSize: 13, opacity: 0.5 }}>/{items.length}</span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: allDone ? 'var(--muted)' : 'rgba(255,255,255,0.4)',
                fontWeight: 600,
              }}
            >
              checked off
            </div>
          </div>
        </div>

        <div
          style={{
            height: 10,
            background: 'var(--white)',
            border: '2px solid var(--navy)',
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 12,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              height: '100%',
              background: mode.color,
              width: `${items.length ? (doneCount / items.length) * 100 : 0}%`,
              transition: 'width .4s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {[
            ['all', 'All'],
            ['pending', 'To buy'],
            ['done', 'Done ✓'],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 10,
                border: `2px solid ${filter === k ? 'var(--navy)' : 'var(--border)'}`,
                background: filter === k ? 'var(--navy)' : 'var(--white)',
                color: filter === k ? mode.color : 'var(--muted)',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                transition: 'all .12s',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {!loading && displayed.length === 0 && (
          <div
            style={{
              background: 'var(--white)',
              border: '2px solid var(--navy)',
              borderRadius: 12,
              padding: '14px',
              marginBottom: 12,
              color: 'var(--muted)',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {!currentMealPlanId
              ? 'no weekly meal plan yet, so nothing to shop for.'
              : 'no shopping items in this view.'}
          </div>
        )}

        {displayed.map((item) => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            className="slot-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--white)',
              border: '2px solid var(--navy)',
              borderRadius: 12,
              padding: '13px 14px',
              marginBottom: 7,
              cursor: 'pointer',
              opacity: item.checked ? 0.55 : 1,
              boxShadow: item.checked ? 'none' : 'var(--shadow-sm)',
              transition: 'all .15s',
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: item.checked ? 'var(--mint)' : 'transparent',
                border: `2px solid ${item.checked ? 'var(--mint)' : 'var(--border)'}`,
                transition: 'all .2s',
              }}
            >
              {item.checked && <IconCheck size={11} color="#fff" />}
            </div>

            <div style={{ fontSize: 20, flexShrink: 0 }}>{ingredientEmoji(item.name)}</div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--navy)',
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </div>
            </div>
          </div>
        ))}

        {allDone && (
          <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
            <MamaHappy size={80} />
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 15,
                fontWeight: 900,
                color: 'var(--navy)',
                marginTop: 8,
              }}
            >
              all done!! mama is so proud 💕
            </div>
          </div>
        )}

        <div
          style={{
            background: 'var(--yellow-l)',
            border: '2px solid var(--navy)',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 14,
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--navy)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 5,
            }}
          >
            💡 food storage tip
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>{FOOD_TIPS[tipIdx].emoji}</span>
            <div
              style={{
                fontSize: 12,
                color: 'var(--navy)',
                lineHeight: 1.65,
                fontWeight: 600,
              }}
            >
              {FOOD_TIPS[tipIdx].tip}
            </div>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>

      <div style={{ position: 'fixed', bottom: 72, left: 0, right: 0, padding: '6px 20px', zIndex: 40 }}>
        <button
          onClick={() => router.push('/home')}
          style={{
            width: '100%',
            padding: 13,
            borderRadius: 12,
            border: '2px solid var(--navy)',
            background: allDone ? 'var(--mint)' : 'var(--yellow)',
            color: 'var(--navy)',
            fontSize: 14,
            fontWeight: 900,
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {allDone ? '✓ all done! back to home' : 'back to home 🏠'}
        </button>
      </div>

      <NavBar />
    </div>
  )
}
