import { create } from 'zustand'
 
export const usePlannerStore = create((set) => ({
  userName: '',
  recipes: [],        // list of Recipe objects from Claude
  assigned: {},       // { 'Monday': { breakfast: Recipe, lunch: Recipe } }
  shoppingList: [],
 
  setUserName: (name) => set({ userName: name }),
 
  setMealPlan: (recipes) => set({ recipes }),
 
  assignMeal: (day, slot, recipe) => set((state) => ({
    assigned: {
      ...state.assigned,
      [day]: { ...state.assigned[day], [slot]: recipe }
    }
  })),
 
  removeMeal: (day, slot) => set((state) => {
    const dayData = { ...state.assigned[day] }
    delete dayData[slot]
    return { assigned: { ...state.assigned, [day]: dayData } }
  }),
 
  setShoppingList: (list) => set({ shoppingList: list }),
 
  reset: () => set({ recipes: [], assigned: {}, shoppingList: [] })
}))
