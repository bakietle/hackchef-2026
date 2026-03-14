import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RECIPES } from './data'

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      // ── User ──
      userName: '',
      setUserName: (name) => set({ userName: name }),

      // ── Week mode ──
      weekMode: 'glow',
      setWeekMode: (mode) => set({ weekMode: mode }),

      // ── Recipes (generated) ──
      recipes: [],
      setMealPlan: (recipes) => set({ recipes }),

      // ── Planner: { 'Monday': { breakfast: recipeObj, lunch: recipeObj, ... } } ──
      assigned: {},
      assignMeal: (day, slot, recipe) =>
        set(s => ({
          assigned: {
            ...s.assigned,
            [day]: { ...(s.assigned[day] || {}), [slot]: recipe }
          }
        })),
      removeMeal: (day, slot) =>
        set(s => {
          const d = { ...(s.assigned[day] || {}) }
          delete d[slot]
          return { assigned: { ...s.assigned, [day]: d } }
        }),
      clearWeek: () => set({ assigned: {} }),

      // ── Saved recipes ──
      savedRecipes: [],
      toggleSaved: (id) =>
        set(s => ({
          savedRecipes: s.savedRecipes.includes(id)
            ? s.savedRecipes.filter(x => x !== id)
            : [...s.savedRecipes, id]
        })),

      // ── Shopping list ──
      shopItems: [],
      setShopItems: (items) => set({ shopItems: items }),
      toggleShopItem: (id) =>
        set(s => ({
          shopItems: s.shopItems.map(i => i.id === id ? { ...i, done: !i.done } : i)
        })),

      // ── Profile / stats ──
      stats: {
        mealsCooked: 0,
        weeksPlanned: 0,
        moneySaved: 0,
        cuisinesTried: [],
      },
      incrementMealsCooked: () =>
        set(s => ({ stats: { ...s.stats, mealsCooked: s.stats.mealsCooked + 1 } })),
      completeWeek: () =>
        set(s => ({ stats: { ...s.stats, weeksPlanned: s.stats.weeksPlanned + 1 } })),

      // ── Dietary preferences ──
      dietary: [],
      setDietary: (d) => set({ dietary: d }),

      // ── Notification seen ──
      notifSeen: false,
      setNotifSeen: () => set({ notifSeen: true }),
    }),
    {
      name: 'nomster-storage',
      partialize: (state) => ({
        userName: state.userName,
        weekMode: state.weekMode,
        assigned: state.assigned,
        savedRecipes: state.savedRecipes,
        shopItems: state.shopItems,
        stats: state.stats,
        dietary: state.dietary,
      }),
    }
  )
)
