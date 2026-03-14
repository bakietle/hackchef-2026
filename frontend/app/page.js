'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MamaIdle from '@/components/mama/MamaIdle'
import MamaCooking from '@/components/mama/MamaCooking'
import { generateMealPlan } from '@/lib/api'
import { usePlannerStore } from '@/lib/plannerStore'
 
// Common ingredients in fridge
const INGREDIENTS = [
  '🥚 Eggs', '🍚 Rice', '🍝 Pasta', '🍞 Bread', '🥛 Milk',
  '🧀 Cheese', '🐔 Chicken', '🥩 Beef mince', '🍅 Tomatoes',
  '🧅 Onion', '🧄 Garlic', '🥔 Potato', '🥦 Broccoli',
  '🌽 Corn', '🥕 Carrot', '🫘 Canned beans', '🐟 Tuna',
  '🥑 Avocado', '🍋 Lemon', '🫙 Soy sauce',
]
 
const CUISINES = [
  '🌍 Anything', '🍜 Asian', '🫓 Mediterranean', '🌮 Mexican',
  '🍕 Italian', '🥘 Middle Eastern', '🍛 Indian', '🥗 Healthy bowls',
]
 
const DIETARY = [
  '✅ No restrictions', '🌱 Vegetarian', '🌿 Vegan',
  '☪️ Halal', '✡️ Kosher', '🌾 Gluten-free', '🥛 Dairy-free',
]
 
const MODES = [
  { key: 'broke',  icon: '💸', name: 'Survivor',     desc: 'max value, min $' },
  { key: 'exam',   icon: '📚', name: 'Galaxy Brain', desc: 'brain food only' },
  { key: 'gym',    icon: '💪', name: 'Beast Mode',   desc: 'protein everything' },
  { key: 'lazy',   icon: '😴', name: 'CEO Energy',   desc: '10 mins max' },
]
 
export default function HomePage() {
  const router = useRouter()
  const setMealPlan = usePlannerStore(s => s.setMealPlan)
  const [screen, setScreen] = useState('welcome') // 'welcome' | 'input' | 'loading'
  const [name, setName] = useState('')
 
  // Input state
  const [selIngredients, setSelIngredients] = useState([])
  const [mealsPerDay, setMealsPerDay] = useState(3)
  const [budget, setBudget] = useState('')
  const [timePerMeal, setTimePerMeal] = useState('')
  const [selCuisines, setSelCuisines] = useState(['🌍 Anything'])
  const [selDietary, setSelDietary] = useState(['✅ No restrictions'])
  const [mode, setMode] = useState('broke')
  const [loading, setLoading] = useState(false)
 
  const toggleChip = (val, list, setList) => {
    setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }
 
  const handleGenerate = async () => {
    setLoading(true)
    setScreen('loading')
    try {
      const result = await generateMealPlan({
        ingredients: selIngredients,
        mealsPerDay, budget, timePerMeal,
        cuisines: selCuisines, dietary: selDietary, mode
      })
      setMealPlan(result)
      router.push('/recipe')
    } catch(e) {
      console.error(e)
      setScreen('input')
    } finally {
      setLoading(false)
    }
  }
 
  // ── WELCOME SCREEN ──
  if (screen === 'welcome') return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', textAlign: 'center' }}>
 
      <div className='mama-float' style={{ marginBottom: 8 }}>
        <MamaIdle size={150} />
      </div>
 
      {/* Speech bubble */}
      <div style={{ background: '#fff', border: '2px solid var(--border)',
        borderRadius: '20px 20px 20px 6px', padding: '14px 18px',
        fontSize: 13, color: '#666', maxWidth: 220,
        margin: '0 auto 28px', lineHeight: 1.7, fontWeight: 600,
        boxShadow: '0 3px 12px rgba(0,0,0,.05)' }}>
        hey! i'm mama 💕<br/>
        let me help you eat better this week~
      </div>
 
      <div style={{ fontFamily: 'Fredoka One', fontSize: 12, color: 'var(--peach)',
        letterSpacing: 3, marginBottom: 5 }}>HACKCHEF</div>
      <h1 style={{ fontFamily: 'Fredoka One', fontSize: 28, color: 'var(--dark)',
        marginBottom: 6 }}>ur meal mama 🍳</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 32,
        fontWeight: 600 }}>AI-powered weekly meal planning</p>
 
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.5px' }}>your name</label>
          <input
            style={{ width: '100%', background: '#fff', border: '2px solid var(--border)',
              borderRadius: 14, padding: '13px 15px', fontSize: 14, fontFamily: 'Nunito',
              outline: 'none', marginTop: 5, fontWeight: 600 }}
            placeholder='e.g. Alex'
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name && setScreen('input')}
          />
        </div>
        <button
          onClick={() => name && setScreen('input')}
          style={{ padding: 15, borderRadius: 16, border: 'none', fontSize: 15,
            fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito', marginTop: 4,
            background: 'linear-gradient(135deg, var(--peach), var(--peach2))',
            color: '#fff', boxShadow: '0 6px 20px rgba(255,122,85,.35)' }}>
          let's cook! 🍽️
        </button>
      </div>
    </div>
  )
 
  // ── LOADING SCREEN ──
  if (screen === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div className='mama-cook'><MamaCooking size={140} /></div>
      <h2 style={{ fontFamily: 'Fredoka One', fontSize: 24, margin: '24px 0 8px' }}>
        mama is cooking something up...
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>
        finding the best meals for you~
      </p>
    </div>
  )
 
  // ── INPUT SCREEN ──
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: 100 }}>
 
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setScreen('welcome')}
          style={{ padding: '8px 14px', borderRadius: 12, border: '2px solid var(--border)',
            background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 800,
            fontFamily: 'Nunito' }}>← back</button>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>tell mama what u got 🛍️</h2>
      </div>
 
      <div style={{ padding: '0 20px' }}>
 
        {/* Ingredients chips */}
        <div style={{ marginTop: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
            what's in ur fridge rn 🛒
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {INGREDIENTS.map(ing => (
              <button key={ing}
                onClick={() => toggleChip(ing, selIngredients, setSelIngredients)}
                style={{
                  padding: '8px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  fontFamily: 'Nunito', cursor: 'pointer', transition: 'all .15s',
                  border: selIngredients.includes(ing)
                    ? '2px solid var(--peach)' : '2px solid var(--border)',
                  background: selIngredients.includes(ing) ? 'var(--peach-l)' : '#fff',
                  color: selIngredients.includes(ing) ? 'var(--peach2)' : 'var(--dark)',
                }}>
                {ing}
              </button>
            ))}
          </div>
        </div>
 
        {/* Budget + Time */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '.5px' }}>budget per meal ($)</label>
            <input type='number' placeholder='8'
              value={budget} onChange={e => setBudget(e.target.value)}
              style={{ width: '100%', marginTop: 5, padding: '12px 14px', borderRadius: 14,
                border: '2px solid var(--border)', fontSize: 14, fontFamily: 'Nunito',
                fontWeight: 600, outline: 'none', background: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '.5px' }}>time per meal (min)</label>
            <input type='number' placeholder='20'
              value={timePerMeal} onChange={e => setTimePerMeal(e.target.value)}
              style={{ width: '100%', marginTop: 5, padding: '12px 14px', borderRadius: 14,
                border: '2px solid var(--border)', fontSize: 14, fontFamily: 'Nunito',
                fontWeight: 600, outline: 'none', background: '#fff' }} />
          </div>
        </div>
 
        {/* Meals per day */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>
            meals per day
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[2,3,4,5].map(n => (
              <button key={n} onClick={() => setMealsPerDay(n)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 14,
                  fontWeight: 800, fontFamily: 'Nunito', cursor: 'pointer',
                  border: mealsPerDay === n ? '2px solid var(--peach)' : '2px solid var(--border)',
                  background: mealsPerDay === n ? 'var(--peach)' : '#fff',
                  color: mealsPerDay === n ? '#fff' : 'var(--dark)' }}>
                {n}
              </button>
            ))}
          </div>
        </div>
 
        {/* Cuisine chips */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
            cuisine vibe 🌍
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CUISINES.map(c => (
              <button key={c} onClick={() => toggleChip(c, selCuisines, setSelCuisines)}
                style={{ padding: '8px 14px', borderRadius: 20, fontSize: 12,
                  fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
                  border: selCuisines.includes(c) ? '2px solid var(--sky)' : '2px solid var(--border)',
                  background: selCuisines.includes(c) ? 'var(--sky-l)' : '#fff',
                  color: selCuisines.includes(c) ? '#2878B0' : 'var(--dark)' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
 
        {/* Dietary chips */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
            dietary needs
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DIETARY.map(d => (
              <button key={d} onClick={() => toggleChip(d, selDietary, setSelDietary)}
                style={{ padding: '8px 14px', borderRadius: 20, fontSize: 12,
                  fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
                  border: selDietary.includes(d) ? '2px solid var(--mint)' : '2px solid var(--border)',
                  background: selDietary.includes(d) ? 'var(--mint-l)' : '#fff',
                  color: selDietary.includes(d) ? '#207050' : 'var(--dark)' }}>
                {d}
              </button>
            ))}
          </div>
        </div>
 
        {/* Mode selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
            pick ur mode
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MODES.map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                style={{ padding: 12, borderRadius: 16, textAlign: 'left',
                  fontFamily: 'Nunito', cursor: 'pointer',
                  border: mode === m.key ? '2px solid var(--peach)' : '2px solid var(--border)',
                  background: mode === m.key ? 'var(--peach-l)' : '#fff' }}>
                <div style={{ fontSize: 22 }}>{m.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>{m.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
 
      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 28px', background: 'var(--cream)',
        borderTop: '2px solid var(--border)' }}>
        <button onClick={handleGenerate}
          style={{ width: '100%', padding: 15, borderRadius: 16, border: 'none',
            fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito',
            background: 'linear-gradient(135deg, var(--peach), var(--peach2))',
            color: '#fff', boxShadow: '0 6px 20px rgba(255,122,85,.35)' }}>
          cook something up ✨
        </button>
      </div>
    </div>
  )
}
 
