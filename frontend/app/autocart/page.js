'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/plannerStore'
import { SHOP_ITEMS, WEEK_MODES } from '@/lib/data'

const STORES = [
  {
    key: 'woolworths',
    name: 'Woolworths',
    color: '#00703F',
    lightColor: '#E8F5EE',
    logo: '🟢',
    tagline: 'Fresh food people',
    url: 'https://www.woolworths.com.au',
  },
  {
    key: 'coles',
    name: 'Coles',
    color: '#E31837',
    lightColor: '#FEE8EB',
    logo: '🔴',
    tagline: 'Down down, prices are down',
    url: 'https://www.coles.com.au',
  },
  {
    key: 'aldi',
    name: 'Aldi',
    color: '#003082',
    lightColor: '#E8EEF8',
    logo: '🔵',
    tagline: 'Good different',
    url: 'https://www.aldi.com.au',
  },
]

const PRICES = {
  woolworths: [1.20, 2.50, 1.80, 3.50, 2.20, 1.80, 4.00, 2.80, 2.50, 3.50],
  coles:      [1.10, 2.30, 1.70, 3.20, 1.90, 1.60, 3.80, 2.60, 2.30, 3.20],
  aldi:       [0.99, 1.99, 1.49, 2.99, 1.79, 1.49, 3.49, 2.49, 2.19, 2.99],
}

const ADD_MSGS = [
  'connecting to store...',
  'locating items...',
  'adding to your cart...',
  'confirming quantities...',
  'all done! ✓',
]

export default function AutoCartPage() {
  const router = useRouter()
  const { weekMode } = usePlannerStore()
  const mode = WEEK_MODES.find(m => m.key===weekMode) || WEEK_MODES[0]

  const items = SHOP_ITEMS.map((i, idx) => ({ ...i, selected: true }))
  const [selected, setSelected] = useState(items.map(i => i.id))
  const [store, setStore]       = useState(null)
  const [phase, setPhase]       = useState('select') // select | adding | done
  const [addProgress, setAddProgress] = useState(0)
  const [addMsg, setAddMsg]     = useState(ADD_MSGS[0])
  const [addedItems, setAddedItems] = useState([])

  const toggle = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const selectedItems = items.filter(i => selected.includes(i.id))
  const storeTotal = (storeKey) =>
    selectedItems.reduce((a,item,idx) => a + (PRICES[storeKey]?.[items.indexOf(item)] || item.p), 0)

  const cheapestStore = STORES.reduce((min, s) => storeTotal(s.key) < storeTotal(min.key) ? s : min, STORES[0])

  const handleAddToCart = (selectedStore) => {
    setStore(selectedStore)
    setPhase('adding')
    setAddProgress(0)
    setAddedItems([])

    let pct = 0, si = 0, itemIdx = 0
    const iv = setInterval(() => {
      pct += 22
      if (pct > 96) pct = 96
      setAddProgress(pct)
      setAddMsg(ADD_MSGS[Math.min(si++, ADD_MSGS.length - 1)])
      if (itemIdx < selectedItems.length) {
        setAddedItems(p => [...p, selectedItems[itemIdx++].id])
      }
    }, 500)

    setTimeout(() => {
      clearInterval(iv)
      setAddProgress(100)
      setAddedItems(selectedItems.map(i => i.id))
      setTimeout(() => setPhase('done'), 400)
    }, 2800)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column' }}>
      <div style={{ height:4, background:mode.color }} />

      {/* Header */}
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1.5px solid var(--border)' }}>
        <button onClick={() => router.push('/grocery')} className="retro-btn"
          style={{ padding:'8px 12px', background:'var(--white)', color:'var(--navy)', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
          ← back
        </button>
        <div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:'var(--navy)' }}>
            auto cart 🛒
          </h2>
          <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>
            add everything to your store cart instantly
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px' }}>

        {/* ── SELECT PHASE ── */}
        {phase === 'select' && (
          <>
            {/* Cheapest store banner */}
            <div style={{ background:`${cheapestStore.color}`, border:'2px solid var(--navy)', borderRadius:16, padding:'12px 16px', marginBottom:14, display:'flex', gap:10, alignItems:'center', boxShadow:'var(--shadow-md)' }}>
              <div style={{ fontSize:28 }}>{cheapestStore.logo}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'#fff' }}>cheapest option this week</div>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{cheapestStore.name} — ${storeTotal(cheapestStore.key).toFixed(2)} total</div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.2)', border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:8, padding:'4px 10px', fontSize:10, fontWeight:900, color:'#fff' }}>
                BEST DEAL
              </div>
            </div>

            {/* Store comparison */}
            <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)', marginBottom:10 }}>
              compare prices
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
              {STORES.map(s => {
                const total = storeTotal(s.key)
                const isCheapest = s.key === cheapestStore.key
                return (
                  <button key={s.key} onClick={() => handleAddToCart(s)}
                    style={{
                      width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
                      background: isCheapest ? `${s.color}15` : 'var(--white)',
                      border: `2px solid ${isCheapest ? s.color : 'var(--border)'}`,
                      borderRadius:14, cursor:'pointer',
                      boxShadow: isCheapest ? `3px 4px 0 ${s.color}60` : 'var(--shadow-sm)',
                      transition:'all .15s',
                    }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:s.lightColor, border:`2px solid ${s.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                      {s.logo}
                    </div>
                    <div style={{ flex:1, textAlign:'left' }}>
                      <div style={{ fontFamily:'Nunito, sans-serif', fontSize:14, fontWeight:900, color:'var(--navy)', display:'flex', alignItems:'center', gap:6 }}>
                        {s.name}
                        {isCheapest && <span style={{ fontSize:9, background:s.color, color:'#fff', padding:'2px 7px', borderRadius:6, fontWeight:800 }}>cheapest</span>}
                      </div>
                      <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{s.tagline}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:'Fraunces, serif', fontSize:18, fontWeight:900, color:s.color }}>${total.toFixed(2)}</div>
                      <div style={{ fontSize:10, color:'var(--muted)', fontWeight:700 }}>{selectedItems.length} items</div>
                    </div>
                    <div style={{ fontSize:18, color:s.color, flexShrink:0 }}>→</div>
                  </button>
                )
              })}
            </div>

            {/* Item list */}
            <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)', marginBottom:10 }}>
              items to add ({selectedItems.length}/{items.length})
            </div>
            {items.map(item => (
              <div key={item.id} onClick={() => toggle(item.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', background:'var(--white)', border:`1.5px solid ${selected.includes(item.id)?'var(--navy)':'var(--border)'}`, borderRadius:10, marginBottom:6, cursor:'pointer', opacity:selected.includes(item.id)?1:0.45, transition:'all .15s' }}>
                <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${selected.includes(item.id)?'var(--navy)':'var(--border)'}`, background:selected.includes(item.id)?mode.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11 }}>
                  {selected.includes(item.id) && '✓'}
                </div>
                <span style={{ fontSize:18 }}>{item.e}</span>
                <div style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--navy)' }}>{item.n}</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:13, fontWeight:900, color:'var(--muted)' }}>${item.p.toFixed(2)}</div>
              </div>
            ))}
          </>
        )}

        {/* ── ADDING PHASE ── */}
        {phase === 'adding' && store && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:20 }}>
            <div style={{ width:80, height:80, borderRadius:20, background:store.lightColor, border:`3px solid ${store.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, boxShadow:`4px 6px 0 ${store.color}40` }}>
              {store.logo}
            </div>
            <div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)', marginBottom:4 }}>
                adding to<br/>{store.name}...
              </div>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:700, color:'var(--muted)' }}>{addMsg}</div>
            </div>

            <div style={{ width:'100%' }}>
              <div style={{ height:10, background:'var(--white)', border:'2px solid var(--navy)', borderRadius:5, overflow:'hidden', marginBottom:14 }}>
                <div style={{ height:'100%', background:store.color, width:`${addProgress}%`, transition:'width .4s ease' }} />
              </div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:15, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>
                {addedItems.length}/{selectedItems.length} items added
              </div>
            </div>

            {/* Items checking off */}
            <div style={{ width:'100%', display:'flex', flexWrap:'wrap', gap:7 }}>
              {selectedItems.map(item => {
                const added = addedItems.includes(item.id)
                return (
                  <div key={item.id} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:20, fontSize:11, fontWeight:700, fontFamily:'Nunito, sans-serif', border:`1.5px solid ${added?store.color:'var(--border)'}`, background:added?store.lightColor:'var(--white)', color:added?store.color:'var(--muted)', transition:'all .3s' }}>
                    {added ? '✓' : '○'} {item.n.split(' ')[0]}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── DONE PHASE ── */}
        {phase === 'done' && store && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:16 }}>
            {/* Success */}
            <div style={{ width:80, height:80, borderRadius:20, background:store.color, border:'3px solid var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, boxShadow:'var(--shadow-md)' }}>
              ✓
            </div>
            <div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'var(--navy)', marginBottom:4 }}>
                all {selectedItems.length} items added!
              </div>
              <div style={{ fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:700, color:'var(--muted)' }}>
                your {store.name} cart is ready 🛒
              </div>
            </div>

            {/* Summary card */}
            <div style={{ width:'100%', background:'var(--white)', border:'2px solid var(--navy)', borderRadius:16, padding:16, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:14, fontWeight:900, color:'var(--navy)' }}>cart summary</div>
                <div style={{ fontFamily:'Nunito, sans-serif', fontSize:11, fontWeight:700, color:'var(--muted)' }}>{store.name}</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--muted)' }}>{selectedItems.length} items</div>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:store.color }}>${storeTotal(store.key).toFixed(2)}</div>
              </div>
              {store.key !== cheapestStore.key && (
                <div style={{ background:'var(--yellow-l)', border:'1.5px solid var(--navy)', borderRadius:8, padding:'6px 10px', fontSize:11, fontWeight:700, color:'var(--navy)' }}>
                  💡 you could save ${(storeTotal(store.key) - storeTotal(cheapestStore.key)).toFixed(2)} at {cheapestStore.name}
                </div>
              )}
            </div>

            {/* Go to store */}
            <a href={store.url} target="_blank" rel="noopener noreferrer"
              style={{ width:'100%', padding:15, borderRadius:12, border:'2px solid var(--navy)', background:store.color, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-md)', textDecoration:'none', display:'block', textAlign:'center' }}>
              open {store.name} cart →
            </a>

            <button onClick={() => { setPhase('select'); setStore(null); setAddedItems([]) }}
              className="retro-btn"
              style={{ width:'100%', padding:12, background:'var(--white)', color:'var(--navy)', fontSize:13 }}>
              ← choose different store
            </button>

            <button onClick={() => router.push('/home')}
              style={{ width:'100%', padding:13, borderRadius:12, border:'2px solid var(--navy)', background:'var(--yellow)', color:'var(--navy)', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'var(--shadow-sm)' }}>
              back to home 🏠
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
