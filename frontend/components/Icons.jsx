// Food-themed playful icons — no default/boring icons
export function IconHome({ size=22, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" fill={color} />
    </svg>
  )
}
export function IconCalendar({ size=22, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="17" rx="3" stroke={color} strokeWidth="2" />
      <path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <rect x="8"  y="3" width="2" height="4" rx="1" fill={color} />
      <rect x="14" y="3" width="2" height="4" rx="1" fill={color} />
      <rect x="7"  y="14" width="3" height="3" rx="1" fill={color} />
      <rect x="13" y="14" width="3" height="3" rx="1" fill={color} />
    </svg>
  )
}
export function IconCart({ size=22, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 3H4.5L6.5 15H18L20.5 6H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9"  cy="19.5" r="1.8" fill={color} />
      <circle cx="16" cy="19.5" r="1.8" fill={color} />
    </svg>
  )
}
export function IconProfile({ size=22, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
      <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
export function IconCheck({ size=14, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12L10 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function IconChevLeft({ size=18, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 6L9 12L15 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function IconChevRight({ size=18, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function IconPlus({ size=16, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
export function IconRefresh({ size=16, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12C4 7.58 7.58 4 12 4C14.5 4 16.74 5.08 18.3 6.8L20 5V10H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12C20 16.42 16.42 20 12 20C9.5 20 7.26 18.92 5.7 17.2L4 19V14H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function IconArrowUp({ size=16, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M6 11L12 5L18 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function IconHeart({ size=16, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
export function IconStar({ size=14, color='#F5C842' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L14.4 9.2H22L16 13.8L18.2 21L12 16.5L5.8 21L8 13.8L2 9.2H9.6L12 2Z" />
    </svg>
  )
}
export function IconClock({ size=14, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M12 7V12L15 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function IconFlame({ size=14, color='#FF6B5B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C12 2 7 7 7 12.5C7 15.54 9.24 18 12 18C14.76 18 17 15.54 17 12.5C17 11.5 16.7 10.5 16 9.5C16 9.5 15.5 12 13.5 12C13.5 12 14 8 12 2Z" />
    </svg>
  )
}
// Food decorative icons
export function IconFork({ size=16, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 2V8C8 9.1 8.9 10 10 10V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 2V5M12 8V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2H12M8 5H12M8 8H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
export function IconLeaf({ size=14, color='#7ED8A4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17 8C8 10 5.9 16.17 3.82 22H5.5C6 20.5 6.5 19 7.5 17.5C9 15.5 11 14 17 14C22 14 20.5 6 17 8Z" />
      <path d="M3.82 22C5 20.29 6.5 18.4 8.5 17" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
export function IconDrop({ size=14, color='#60B8FF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C12 2 6 10 6 15C6 18.31 8.69 21 12 21C15.31 21 18 18.31 18 15C18 10 12 2 12 2Z" />
    </svg>
  )
}
export function IconBell({ size=22, color='currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 10C18 6.69 15.31 4 12 4C8.69 4 6 6.69 6 10V16H18V10Z" stroke={color} strokeWidth="2" />
      <path d="M4 16H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16" stroke={color} strokeWidth="2" />
    </svg>
  )
}
