import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearStoredUserId } from './storage'

const initialStats = {
  mealsCooked: 0,
  weeksPlanned: 0,
  moneySaved: 0,
  cuisinesTried: [],
}

export const usePlannerStore = create(
  persist(
    (set) => ({
      userId: '',
      userName: '',

      setUserId: (userId) => set({ userId }),
      setUserName: (userName) => set({ userName }),
      setUserSession: ({ userId, userName }) => set({ userId, userName }),

      weekMode: 'glow',
      setWeekMode: (weekMode) => set({ weekMode }),

      currentRequestId: '',
      currentMealPlanId: '',
      recipes: [],

      setMealPlan: (recipes) =>
        set({
          recipes,
          assigned: {},
          currentMealPlanId: '',
        }),

      setCurrentRequestId: (currentRequestId) => set({ currentRequestId }),
      setCurrentMealPlanId: (currentMealPlanId) => set({ currentMealPlanId }),

      assigned: {},

      assignMeal: (day, slot, recipe) =>
        set((state) => ({
          assigned: {
            ...state.assigned,
            [day]: {
              ...(state.assigned[day] || {}),
              [slot]: recipe,
            },
          },
        })),

      removeMeal: (day, slot) =>
        set((state) => {
          const nextDay = { ...(state.assigned[day] || {}) }
          delete nextDay[slot]

          return {
            assigned: {
              ...state.assigned,
              [day]: nextDay,
            },
          }
        }),

      clearWeek: () => set({ assigned: {} }),

      savedRecipes: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedRecipes: state.savedRecipes.includes(id)
            ? state.savedRecipes.filter((item) => item !== id)
            : [...state.savedRecipes, id],
        })),

      shopItems: [],
      setShopItems: (shopItems) => set({ shopItems }),
      toggleShopItem: (id) =>
        set((state) => ({
          shopItems: state.shopItems.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item
          ),
        })),

      stats: initialStats,

      incrementMealsCooked: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            mealsCooked: state.stats.mealsCooked + 1,
          },
        })),

      completeWeek: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            weeksPlanned: state.stats.weeksPlanned + 1,
          },
        })),

      dietary: [],
      setDietary: (dietary) => set({ dietary }),

      notifSeen: false,
      setNotifSeen: () => set({ notifSeen: true }),

      reset: () =>
        set(() => {
          clearStoredUserId()
          return {
            userId: '',
            userName: '',
            weekMode: 'glow',
            currentRequestId: '',
            currentMealPlanId: '',
            recipes: [],
            assigned: {},
            savedRecipes: [],
            shopItems: [],
            stats: initialStats,
            dietary: [],
            notifSeen: false,
          }
        }),
    }),
    {
      name: 'nomster-storage',
      partialize: (state) => ({
        userId: state.userId,
        userName: state.userName,
        weekMode: state.weekMode,
        currentRequestId: state.currentRequestId,
        savedRecipes: state.savedRecipes,
        shopItems: state.shopItems,
        stats: state.stats,
        dietary: state.dietary,
        notifSeen: state.notifSeen,
      }),
    }
  )
)