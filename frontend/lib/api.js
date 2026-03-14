const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export async function generateMealPlan(params) {
  const res = await fetch(`${BASE}/generate-meal-plan`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(params),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
export async function getShoppingList(recipeIds) {
  const res = await fetch(`${BASE}/shopping-list`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ recipeIds }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
