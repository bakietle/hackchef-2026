import { create } from 'zustand'

export const usePlannerStore = create((set, get) => ({
  userName:     '',
  weekMode:     'glow',
  recipes:      [],
  assigned:     {},
  savedRecipes: [],
  planDone:     false,
  badges:       [],
  moodLog:      {},

  setUserName:  (name)    => set({ userName: name }),
  setWeekMode:  (mode)    => set({ weekMode: mode }),
  setMealPlan:  (recipes) => set({ recipes }),
  setPlanDone:  (v)       => set({ planDone: v }),

  assignMeal: (day, slotId, recipe) => set(state => ({
    assigned: { ...state.assigned, [day]: { ...state.assigned[day], [slotId]: recipe } }
  })),
  removeMeal: (day, slotId) => set(state => {
    const d = { ...state.assigned[day] }; delete d[slotId]
    return { assigned: { ...state.assigned, [day]: d } }
  }),

  toggleSaved: (recipeId) => set(state => {
    const saved = state.savedRecipes.includes(recipeId)
      ? state.savedRecipes.filter(id => id !== recipeId)
      : [...state.savedRecipes, recipeId]
    return { savedRecipes: saved }
  }),

  setMood: (day, mood) => set(state => ({
    moodLog: { ...state.moodLog, [day]: mood }
  })),

  reset: () => set({ recipes:[], assigned:{}, planDone:false }),
}))
