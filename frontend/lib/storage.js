const USER_ID_KEY = 'nomster-user-id'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getStoredUserId() {
  if (!canUseStorage()) return null
  return window.localStorage.getItem(USER_ID_KEY)
}

export function setStoredUserId(userId) {
  if (!canUseStorage() || !userId) return
  window.localStorage.setItem(USER_ID_KEY, userId)
}

export function clearStoredUserId() {
  if (!canUseStorage()) return
  window.localStorage.removeItem(USER_ID_KEY)
}
