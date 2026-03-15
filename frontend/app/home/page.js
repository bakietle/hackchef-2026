'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { WEEK_MODES, FOOD_TIPS } from '@/lib/data'
import { getHome, getRecipeById } from '@/lib/api'
import {
  IconHome,
  IconCalendar,
  IconCart,
  IconHeart,
  IconProfile,
  IconClock,
  IconCheck,
} from '@/components/Icons'
import { MamaMini } from '@/components/mama/MamaVariants'
import NotifBanner from '@/components/NotifBanner'
import NomsterLogo from '@/components/NomsterLogo'

const SLOTS = ['breakfast', 'lunch', 'snack', 'dinner']

const SLOT_ORDER = {
  breakfast: 0,
  lunch: 1,
  snack: 2,
  dinner: 3,
}

function getUpcoming7Days() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(today)
    d.setDate(today.getDate() + index)

    return {
      iso: d.toISOString().slice(0, 10),
      short: d.toLocaleDateString('en-US', { weekday: 'short' }),
      long: d.toLocaleDateString('en-US', { weekday: 'long' }),
      dateNumber: d.getDate(),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })
}

function computeFuel(recipe) {
  const protein = Number(recipe.protein || 0)
  const carbs = Number(recipe.carbs || 0)
  const fat = Number(recipe.fat || 0)
  const calories = Number(recipe.calories || 0)

  const raw =
    55 +
    protein * 0.8 +
    carbs * 0.15 -
    fat * 0.2 +
    (calories >= 300 && calories <= 700 ? 8 : 0)

  return Math.max(65, Math.min(96, Math.round(raw)))
}

function normalizeTextList(value) {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    if (typeof item === 'string') return item
    if (item && typeof item === 'object') return item.name || JSON.stringify(item)
    return String(item)
  })
}

function toMealStub(item, weekMode) {
  return {
    slot: item.meal_slot,
    recipe: {
      id: item.recipe_id,
      name: item.title,
      flag: '🍽️',
      cuisine: 'Mama special',
      mode: weekMode,
      time: 20,
      cost: 0,
      fuel: 0,
      cal: item.calories ?? 0,
      pro: `${item.protein ?? 0}g`,
      carb: `${item.carbs ?? 0}g`,
      fat: `${item.fat ?? 0}g`,
      sugar: '0g',
      funFact: 'Fresh from your weekly plan.',
      steps: ['Tap to load full recipe.'],
      miss: [],
      ingredients: [],
    },
  }
}

function groupItemsByDate(items, week, weekMode) {
  const grouped = Object.fromEntries(week.map((day) => [day.iso, []]))

  for (const item of items || []) {
    const key = item.planned_date?.slice(0, 10)
    if (!key) continue

    if (!grouped[key]) grouped[key] = []
    grouped[key].push(toMealStub(item, weekMode))
  }

  for (const key of Object.keys(grouped)) {
    grouped[key].sort(
      (a, b) => (SLOT_ORDER[a.slot] ?? 99) - (SLOT_ORDER[b.slot] ?? 99)
    )
  }

  return grouped
}

function toModalRecipe(recipe, weekMode) {
  const ingredients = normalizeTextList(recipe.ingredients)
  const steps = normalizeTextList(recipe.steps)

  return {
    id: recipe.id,
    name: recipe.title || 'Untitled recipe',
    flag: '🍽️',
    cuisine: 'Mama special',
    mode: weekMode,
    time: 20,
    cost: 0,
    fuel: computeFuel(recipe),
    cal: Number(recipe.calories ?? 0),
    pro: `${Number(recipe.protein ?? 0)}g`,
    carb: `${Number(recipe.carbs ?? 0)}g`,
    fat: `${Number(recipe.fat ?? 0)}g`,
    sugar: '0g',
    funFact: 'Fresh from your weekly plan.',
    steps: steps.length ? steps : ['No steps available yet.'],
    miss: ingredients,
    ingredients,
  }
}

// Get Mon-indexed today (0=Mon … 6=Sun)
function getTodayIdx() {
  const d = new Date().getDay() // 0=Sun,1=Mon...6=Sat
  return d === 0 ? 6 : d - 1
}

// Generate the 7 real dates starting from this Monday
function getWeekDates() {
  const today    = new Date()
  const todayIdx = getTodayIdx()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - todayIdx + i)
    return d
  })
}

function fmtDate(d) {
  return d.getDate()
}

function fmtMonth(d) {
  return d.toLocaleString('en-AU', { month: 'short' })
}

// ── Recipe modal (day popup → recipe detail) ──────────────────
function RecipeModal({ recipe, onClose, mc, saved, onSave }) {
  const [fw, setFw] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setFw(recipe.fuel), 80)
    return () => clearTimeout(t)
  }, [recipe])

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(27,43,75,.65)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn .2s',
      }}
    >
      <div
        style={{
          background: 'var(--cream)',
          borderRadius: '24px 24px 0 0',
          border: '2px solid var(--navy)',
          borderBottom: 'none',
          padding: '22px 20px 40px',
          width: '100%',
          maxHeight: '88%',
          overflowY: 'auto',
          animation: 'slideUp .3s',
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: 'var(--border)',
            borderRadius: 2,
            margin: '0 auto 18px',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: `${modeColor}30`,
              border: '2px solid var(--navy)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              flexShrink: 0,
            }}
          >
            {recipe.flag}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 18,
                fontWeight: 900,
                color: 'var(--navy)',
                marginBottom: 2,
              }}
            >
              {recipe.name}
            </div>

            <div
              style={{
                fontSize: 11,
                color: 'var(--muted)',
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              {recipe.cuisine}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'var(--yellow-l)',
                  color: 'var(--navy)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: '1.5px solid var(--navy)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <IconClock size={11} color="var(--navy)" /> {recipe.time}min
              </span>

              <span
                style={{
                  background: 'var(--mint-l)',
                  color: 'var(--navy)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: '1.5px solid var(--navy)',
                }}
              >
                ${recipe.cost}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleSave}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: '2px solid var(--navy)',
              background: saved ? 'var(--coral-l)' : 'var(--white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconHeart size={18} color={saved ? 'var(--coral)' : 'var(--border)'} />
          </button>
        </div>

        <div
          style={{
            background: 'var(--navy)',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--yellow)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 5,
            }}
          >
            ✨ fun fact
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.65,
              fontWeight: 500,
            }}
          >
            {recipe.funFact}
          </div>
        </div>

        <div
          style={{
            background: `${modeColor}20`,
            border: '2px solid var(--navy)',
            borderRadius: 14,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              power level
            </div>
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 22,
                fontWeight: 900,
                color: 'var(--navy)',
              }}
            >
              {recipe.fuel}
            </div>
          </div>

          <div
            style={{
              height: 10,
              background: 'var(--white)',
              border: '2px solid var(--navy)',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: modeColor,
                width: `${fw}%`,
                transition: 'width .9s ease',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 8,
            marginBottom: 14,
          }}
        >
          {[
            ['kcal', recipe.cal, '🔥'],
            ['protein', recipe.pro, '🥩'],
            ['carbs', recipe.carb, '🍞'],
            ['fat', recipe.fat, '💧'],
          ].map(([k, v, ico]) => (
            <div
              key={k}
              style={{
                background: 'var(--white)',
                border: '2px solid var(--navy)',
                borderRadius: 10,
                padding: '9px 6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 14 }}>{ico}</div>
              <div
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 14,
                  fontWeight: 900,
                  color: 'var(--navy)',
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: 'var(--muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginTop: 1,
                }}
              >
                {k}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 9,
          }}
        >
          how to make it 👩‍🍳
        </div>

        {recipe.steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              marginBottom: 9,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: modeColor,
                border: '2px solid var(--navy)',
                color: 'var(--navy)',
                fontSize: 12,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--navy)',
                lineHeight: 1.65,
                paddingTop: 3,
                fontWeight: 500,
              }}
            >
              {step}
            </div>
          </div>
        ))}

        {recipe.miss?.length > 0 && (
          <div
            style={{
              background: 'var(--yellow-l)',
              border: '2px solid var(--navy)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--navy)',
                marginBottom: 5,
              }}
            >
              🛒 ingredients
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--navy)',
                fontWeight: 500,
              }}
            >
              {recipe.miss.join(', ')}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="retro-btn"
          style={{
            width: '100%',
            padding: 12,
            background: 'var(--white)',
            color: 'var(--navy)',
            fontSize: 13,
            marginTop: 8,
          }}
        >
          close
        </button>
      </div>
    </div>
  )
}

// ── Day popup (from week grid) ────────────────────────────────
function DayPopup({ day, meals, onClose, onOpenRecipe }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(27,43,75,.65)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn .2s',
      }}
    >
      <div
        style={{
          background: 'var(--cream)',
          borderRadius: '24px 24px 0 0',
          border: '2px solid var(--navy)',
          borderBottom: 'none',
          padding: '20px 20px 36px',
          width: '100%',
          maxHeight: '70%',
          overflowY: 'auto',
          animation: 'slideUp .3s',
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: 'var(--border)',
            borderRadius: 2,
            margin: '0 auto 16px',
          }}
        />

        <div
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--navy)',
            marginBottom: 14,
          }}
        >
          {day}'s meals
        </div>

        {meals.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 0',
              color: 'var(--muted)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            no meals planned for this day yet
          </div>
        ) : (
          meals.map(({ slot, recipe }) => (
            <div
              key={slot}
              onClick={() => onOpenRecipe(recipe)}
              style={{
                background: 'var(--white)',
                border: '2px solid var(--navy)',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'var(--yellow-l)',
                  border: '2px solid var(--navy)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {recipe.flag}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: 2,
                  }}
                >
                  {slot}
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 14,
                    fontWeight: 800,
                    color: 'var(--navy)',
                  }}
                >
                  {recipe.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    fontWeight: 600,
                    marginTop: 1,
                  }}
                >
                  {recipe.time}min
                </div>
              </div>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="var(--muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ))
        )}

        <button
          onClick={onClose}
          className="retro-btn"
          style={{
            width: '100%',
            padding: 12,
            background: 'var(--white)',
            color: 'var(--navy)',
            fontSize: 13,
            marginTop: 8,
          }}
        >
          close
        </button>
      </div>
    </div>
  )
}

// ── NavBar ─────────────────────────────────────────────────────
function NavBar() {
  const router = useRouter()
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0 20px', borderTop:'2px solid var(--navy)', background:'var(--white)', zIndex:50 }}>
      {[
        { label:'home',    path:'/home',    Icon:IconHome,     active:true  },
        { label:'planner', path:'/planner', Icon:IconCalendar, active:false },
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

// ── MAIN ───────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()

  const {
    userName,
    weekMode,
    savedRecipes,
    toggleSaved,
    setCurrentMealPlanId,
  } = usePlannerStore()

  const mode = WEEK_MODES.find((m) => m.key === weekMode) || WEEK_MODES[0]

  const [dayPopup, setDayPopup] = useState(null)
  const [recipePopup, setRecipePopup] = useState(null)
  const [tipIdx, setTipIdx] = useState(0)

  const [homeData, setHomeData] = useState({
    quote: '',
    meal_plan: null,
    items: [],
  })

  const [loadingHome, setLoadingHome] = useState(true)
  const [homeError, setHomeError] = useState('')

  const upcomingWeek = useMemo(() => getUpcoming7Days(), [])

  const mealsByDate = useMemo(() => {
    return groupItemsByDate(homeData.items, upcomingWeek, weekMode)
  }, [homeData.items, upcomingWeek, weekMode])

  const hasPlan = !!homeData.meal_plan

  // Rotate tips
  useEffect(() => {
    const iv = setInterval(() => setTipIdx((i) => (i + 1) % FOOD_TIPS.length), 8000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadHome() {
      setLoadingHome(true)
      setHomeError('')

      try {
        const data = await getHome()

        if (cancelled) return

        setHomeData({
          quote: data.quote || '',
          meal_plan: data.meal_plan || null,
          items: data.items || [],
        })

        if (data.meal_plan?.id) {
          setCurrentMealPlanId(data.meal_plan.id)
        }
      } catch (err) {
        if (!cancelled) {
          setHomeError(err.message || 'Could not load home page.')
        }
      } finally {
        if (!cancelled) {
          setLoadingHome(false)
        }
      }
    }

    loadHome()

    return () => {
      cancelled = true
    }
  }, [setCurrentMealPlanId])

  const openDay = (dayObj) => {
    const meals = mealsByDate[dayObj.iso] || []
    setDayPopup({
      day: `${dayObj.long} · ${dayObj.label}`,
      meals,
    })
  }

  const openRecipe = async (recipeStub) => {
    try {
      const fullRecipe = await getRecipeById(recipeStub.id)
      setRecipePopup(toModalRecipe(fullRecipe, weekMode))
    } catch (err) {
      setHomeError(err.message || 'Could not load recipe details.')
      setRecipePopup(recipeStub)
    }
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'good morning'
    if (h < 17) return 'good afternoon'
    if (h < 21) return 'good evening'
    return 'good night'
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
        {
          icon: <IconHome size={22} color="var(--navy)" />,
          label: 'home',
          path: '/home',
          active: true,
        },
        {
          icon: <IconCalendar size={22} color="var(--muted)" />,
          label: 'planner',
          path: '/planner',
          active: false,
        },
        {
          icon: <IconCart size={22} color="var(--muted)" />,
          label: 'grocery',
          path: '/grocery',
          active: false,
        },
        {
          icon: <IconHeart size={22} color="var(--muted)" />,
          label: 'saved',
          path: '/saved',
          active: false,
        },
        {
          icon: <IconProfile size={22} color="var(--muted)" />,
          label: 'profile',
          path: '/profile',
          active: false,
        },
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>
              {greeting()}
            </div>
            <h1
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 24,
                fontWeight: 900,
                color: 'var(--navy)',
                lineHeight: 1.1,
              }}
            >
              {hasPlan ? 'some fun this week,' : "let's plan,"}
              <br />
              <span style={{ color: mode.color }}>{userName || 'Foodie'}</span>
              <span style={{ fontSize: 20 }}> {mode.emoji}</span>
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 6,
            }}
          >
            <NomsterLogo size="sm" animate />
            <button
              onClick={() => router.push('/profile')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--white)',
                border: '2px solid var(--navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IconProfile size={18} color="var(--navy)" />
            </button>
          </div>
        </div>

        {loadingHome && (
          <div
            style={{
              marginBottom: 12,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--muted)',
            }}
          >
            loading your kitchen...
          </div>
        )}

        {homeError && (
          <div
            style={{
              marginBottom: 12,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--coral)',
            }}
          >
            {homeError}
          </div>
        )}

        <div
          style={{
            background: 'var(--white)',
            border: '2px solid var(--navy)',
            borderRadius: 16,
            padding: '12px 14px',
            marginBottom: 14,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/profile')}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            mode this week
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: mode.color,
                border: '2px solid var(--navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              {mode.emoji}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 15,
                  fontWeight: 900,
                  color: 'var(--navy)',
                }}
              >
                {mode.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  fontWeight: 600,
                }}
              >
                {mode.desc}
              </div>
            </div>

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ opacity: 0.4 }}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="var(--navy)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {modeOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:13, zIndex:30, boxShadow:'var(--shadow-md)', overflow:'hidden', animation:'bounceIn .2s' }}>
              {WEEK_MODES.map((m, i) => (
                <div key={m.key}
                  onClick={() => { setWeekMode(m.key); setModeOpen(false) }}
                  style={{
                    display:'flex', alignItems:'center', gap:10, padding:'10px 13px',
                    cursor:'pointer', background:m.key===weekMode ? `${m.color}25` : 'transparent',
                    borderBottom: i < WEEK_MODES.length-1 ? '1px solid var(--border)' : 'none',
                    transition:'background .12s',
                  }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:m.color, border:`2px solid ${m.key===weekMode?'var(--navy)':'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{m.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:800, color:'var(--navy)' }}>{m.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{m.desc}</div>
                  </div>
                  {m.key === weekMode && <div style={{ width:18, height:18, borderRadius:'50%', background:m.color, border:'2px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}><IconCheck size={9} color="var(--navy)"/></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: hasPlan ? `${mode.color}20` : 'var(--navy)',
            border: '2px solid var(--navy)',
            borderRadius: 16,
            padding: '12px 14px',
            marginBottom: 16,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/input')}
        >
          <MamaMini size={42} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: hasPlan ? 'var(--muted)' : 'var(--yellow)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              mama says
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: hasPlan ? 'var(--navy)' : 'rgba(255,255,255,0.9)',
                lineHeight: 1.6,
              }}
            >
              {homeData.quote ||
                (hasPlan
                  ? 'ur week is all planned! tap to start a new one 💕'
                  : 'tap "plan this week" and mama sorts u out 🍳')}
            </div>
          </div>

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.4, flexShrink: 0 }}
          >
            <path
              d="M9 6L15 12L9 18"
              stroke={hasPlan ? 'var(--navy)' : '#fff'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            this week
          </div>

          <button
            onClick={() => router.push('/planner')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 800,
              color: mode.color,
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            planner →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7,1fr)',
            gap: 4,
            marginBottom: 16,
          }}
        >
          {upcomingWeek.map((day, i) => {
            const dayMeals = mealsByDate[day.iso] || []
            const isToday = i === 0

            return (
              <div
                key={day.iso}
                onClick={() => openDay(day)}
                style={{
                  background: isToday ? mode.color : 'var(--white)',
                  border: `2px solid ${
                    dayMeals.length ? 'var(--navy)' : 'var(--border)'
                  }`,
                  borderRadius: 12,
                  padding: '6px 3px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: 68,
                  boxShadow: isToday ? 'var(--shadow-sm)' : 'none',
                  transition: 'transform .15s',
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: isToday ? 'var(--navy)' : 'var(--muted)',
                    marginBottom: 2,
                  }}
                >
                  {day.short}
                </div>

                <div
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: 12,
                    fontWeight: 900,
                    color: isToday ? 'var(--navy)' : 'var(--muted)',
                    marginBottom: 3,
                  }}
                >
                  {day.dateNumber}
                </div>

                {dayMeals.length > 0 ? (
                  dayMeals.slice(0, 3).map((meal, j) => (
                    <div key={j} style={{ fontSize: 12, lineHeight: 1.2 }}>
                      {meal.recipe.flag}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 10, color: 'var(--border)' }}>·</div>
                )}
              </div>
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            shopping list
          </div>

          <button
            onClick={() => router.push('/grocery')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 800,
              color: mode.color,
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            see all →
          </button>
        </div>

        <div
          style={{
            background: 'var(--white)',
            border: '2px solid var(--navy)',
            borderRadius: 14,
            padding: '14px',
            marginBottom: 14,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {hasPlan ? (
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
              shopping list is ready on the grocery page 🛒
            </div>
          ) : (
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
              nothing to shop yet. plan your week first.
            </div>
          )}
        </div>

        <div
          style={{
            background: 'var(--yellow-l)',
            border: '2px solid var(--navy)',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 16,
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
            💡 food tip
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>
              {FOOD_TIPS[tipIdx].emoji}
            </span>
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

          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {FOOD_TIPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setTipIdx(i)}
                style={{
                  width: i === tipIdx ? 20 : 6,
                  height: 4,
                  borderRadius: 2,
                  background: i === tipIdx ? 'var(--navy)' : 'var(--border)',
                  cursor: 'pointer',
                  transition: 'all .3s',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push('/input')}
          className="retro-btn glow-btn"
          style={{
            width: '100%',
            padding: 15,
            background: 'var(--yellow)',
            color: 'var(--navy)',
            fontSize: 15,
            fontWeight: 900,
            boxShadow: 'var(--shadow-md)',
            marginBottom: 10,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(2px,3px)'
            e.currentTarget.style.boxShadow = '0 0 0 var(--navy)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          + plan this week ✨
        </button>

        <button
          onClick={() => router.push('/mama?to=together')}
          style={{
            width: '100%',
            padding: 13,
            borderRadius: 12,
            border: '2px solid var(--navy)',
            background: 'var(--white)',
            color: 'var(--navy)',
            fontSize: 13,
            fontWeight: 900,
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 8,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(2px,3px)'
            e.currentTarget.style.boxShadow = '0 0 0 var(--navy)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
          }}
        >
          👯 cook together with housemates
        </button>

        <div style={{ height: 20 }} />
      </div>

      {/* ── POPUPS ── */}
      {dayPopup && !recipePopup && (
        <DayPopup
          day={dayPopup.day}
          meals={dayPopup.meals}
          onClose={() => setDayPopup(null)}
          onOpenRecipe={openRecipe}
        />
      )}

      {recipePopup && (
        <RecipeModal
          recipe={recipePopup}
          onClose={() => setRecipePopup(null)}
          modeColor={
            WEEK_MODES.find((m) => m.key === recipePopup.mode)?.color || mode.color
          }
          saved={savedRecipes.includes(recipePopup.id)}
          onToggleSave={() => toggleSaved(recipePopup.id)}
        />
      )}

      <NavBar />
    </div>
  )
}
