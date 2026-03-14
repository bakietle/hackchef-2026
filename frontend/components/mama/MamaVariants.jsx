// MamaMini — small for banner
export function MamaMini({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52"
      style={{ display:'block', animation:'mamaFloat 3s ease-in-out infinite' }}>
      <ellipse cx="26" cy="32" rx="13" ry="11" fill="#F5C842" />
      <ellipse cx="26" cy="33" rx="8"  ry="7"  fill="#FFF8DC" />
      <ellipse cx="26" cy="19" rx="13" ry="11" fill="#7A4A20" />
      <ellipse cx="15" cy="26" rx="4"  ry="9"  fill="#7A4A20" />
      <ellipse cx="37" cy="26" rx="4"  ry="9"  fill="#7A4A20" />
      <ellipse cx="26" cy="27" rx="11" ry="12" fill="#FADA9A" />
      <rect x="15" y="16" width="22" height="7" rx="3.5" fill="#1B2B4B" />
      <ellipse cx="34" cy="15" rx="6.5" ry="4.5" fill="#F5C842" stroke="#1B2B4B" strokeWidth="1" />
      <ellipse cx="34" cy="15" rx="4"   ry="2.8" fill="#E8B820" />
      <circle  cx="34" cy="15" r="2"    fill="#F5C842" />
      <ellipse cx="21" cy="28" rx="3"   ry="3.5" fill="#fff" />
      <ellipse cx="21" cy="28.5" rx="1.9" ry="2.3" fill="#2C1A0E" />
      <circle  cx="22" cy="27.2" r=".8" fill="#fff" />
      <ellipse cx="31" cy="28" rx="3"   ry="3.5" fill="#fff" />
      <ellipse cx="31" cy="28.5" rx="1.9" ry="2.3" fill="#2C1A0E" />
      <circle  cx="32" cy="27.2" r=".8" fill="#fff" />
      <ellipse cx="15" cy="32" rx="3.5" ry="2" fill="#F0A060" opacity=".3" />
      <ellipse cx="37" cy="32" rx="3.5" ry="2" fill="#F0A060" opacity=".3" />
      <path d="M21 34 Q26 39 31 34" stroke="#A0603A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// MamaHappy — celebrating with sparkles
export function MamaHappy({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 72" style={{ display:'block', margin:'0 auto' }}>
      <g className="mama-sp1" style={{ transformOrigin:'8px 14px' }}>
        <path d="M8 8 L9.5 13 L14 14 L9.5 15 L8 20 L6.5 15 L2 14 L6.5 13Z" fill="#F5C842" />
      </g>
      <g className="mama-sp2" style={{ transformOrigin:'72px 20px' }}>
        <path d="M72 14 L73 18 L77 19 L73 20 L72 24 L71 20 L67 19 L71 18Z" fill="#C8F135" />
      </g>
      <g className="mama-sp3" style={{ transformOrigin:'14px 56px' }}>
        <path d="M14 52 L15 56 L19 57 L15 58 L14 62 L13 58 L9 57 L13 56Z" fill="#FF6B5B" />
      </g>
      <g className="mama-sp4" style={{ transformOrigin:'66px 60px' }}>
        <path d="M66 56 L67 60 L71 61 L67 62 L66 66 L65 62 L61 61 L65 60Z" fill="#7ED8A4" />
      </g>
      <g className="mama-jump">
        <rect x="27" y="42" width="26" height="24" rx="9" fill="#F5C842" />
        <rect x="32" y="42" width="16" height="15" rx="5" fill="#FFF8DC" />
        <g className="mama-cheer-larm">
          <rect x="14" y="28" width="13" height="18" rx="6.5" fill="#F0B87A" transform="rotate(-38,14,28)" />
        </g>
        <g className="mama-cheer-rarm">
          <rect x="53" y="28" width="13" height="18" rx="6.5" fill="#F0B87A" transform="rotate(38,66,28)" />
        </g>
        <rect x="32" y="36" width="16" height="10" rx="6" fill="#F0B87A" />
        <ellipse cx="40" cy="23" rx="19" ry="21" fill="#FADA9A" />
        <ellipse cx="40" cy="11" rx="19" ry="14" fill="#7A4A20" />
        <ellipse cx="23" cy="23" rx="6"  ry="13" fill="#7A4A20" />
        <ellipse cx="57" cy="23" rx="6"  ry="13" fill="#7A4A20" />
        <ellipse cx="40" cy="25" rx="15" ry="17" fill="#FADA9A" />
        <rect x="23" y="10" width="34" height="8" rx="4" fill="#1B2B4B" />
        <ellipse cx="54" cy="10" rx="7" ry="5" fill="#F5C842" stroke="#1B2B4B" strokeWidth="1" />
        <ellipse cx="54" cy="10" rx="4" ry="3" fill="#E8B820" />
        <path d="M31 22 Q36 18 41 22" stroke="#2C1A0E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M39 22 Q44 18 49 22" stroke="#2C1A0E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="28" cy="28" rx="5" ry="3" fill="#F0A060" opacity=".3" />
        <ellipse cx="52" cy="28" rx="5" ry="3" fill="#F0A060" opacity=".3" />
        <path d="M32 32 Q40 40 48 32" stroke="#A0603A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M33 33 Q40 39 47 33 Q40 38 33 33Z" fill="#fff" opacity=".7" />
      </g>
    </svg>
  )
}

// MamaShocked — notification banner
export function MamaShocked({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40"
      style={{ display:'block', flexShrink:0 }} className="mama-shock">
      <circle cx="20" cy="20" r="20" fill="#FFF8DC" />
      <ellipse cx="20" cy="14" rx="10" ry="9" fill="#7A4A20" />
      <ellipse cx="11" cy="20" rx="4"  ry="8" fill="#7A4A20" />
      <ellipse cx="29" cy="20" rx="4"  ry="8" fill="#7A4A20" />
      <ellipse cx="20" cy="22" rx="9"  ry="10" fill="#FADA9A" />
      <rect x="11" y="11" width="18" height="6" rx="3" fill="#1B2B4B" />
      <ellipse cx="27" cy="10" rx="5" ry="3.5" fill="#F5C842" stroke="#1B2B4B" strokeWidth="1" />
      <ellipse cx="15" cy="22" rx="3"   ry="3.5" fill="#fff" stroke="#1B2B4B" strokeWidth=".8" />
      <ellipse cx="15" cy="22.5" rx="2" ry="2.5" fill="#2C1A0E" />
      <circle  cx="15.8" cy="21.5" r=".7" fill="#fff" />
      <ellipse cx="25" cy="22" rx="3"   ry="3.5" fill="#fff" stroke="#1B2B4B" strokeWidth=".8" />
      <ellipse cx="25" cy="22.5" rx="2" ry="2.5" fill="#2C1A0E" />
      <circle  cx="25.8" cy="21.5" r=".7" fill="#fff" />
      <ellipse cx="20" cy="29" rx="2.5" ry="2.2" fill="#A0603A" />
      <path d="M30 12 Q31.5 14.5 30 17" stroke="#C8F135" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

// MamaCooking — loading screen
export function MamaCooking({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" style={{ display:'block', margin:'0 auto' }}>
      <rect x="20" y="93" width="78" height="30" rx="12" fill="#8A8A7A" stroke="#1B2B4B" strokeWidth="1.5" />
      <rect x="22" y="89" width="74" height="10" rx="5" fill="#6A6A5A" stroke="#1B2B4B" strokeWidth="1.5" />
      <rect x="10" y="95" width="14" height="11" rx="5.5" fill="#6A6A5A" stroke="#1B2B4B" strokeWidth="1.5" />
      <rect x="96" y="95" width="14" height="11" rx="5.5" fill="#6A6A5A" stroke="#1B2B4B" strokeWidth="1.5" />
      <ellipse cx="59" cy="94" rx="30" ry="7" fill="#F5C842" opacity=".85" />
      <path className="mama-steam-a" d="M38 88 Q42 78 38 68" stroke="#E8D090" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path className="mama-steam-b" d="M59 86 Q63 75 59 65" stroke="#E8D090" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path className="mama-steam-c" d="M80 88 Q84 78 80 68" stroke="#E8D090" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <rect x="33" y="55" width="52" height="42" rx="16" fill="#F5C842" />
      <rect x="41" y="55" width="36" height="30" rx="10" fill="#FFF8DC" />
      <rect x="38" y="89" width="14" height="10" rx="6" fill="#F0B87A" />
      <rect x="66" y="89" width="14" height="10" rx="6" fill="#F0B87A" />
      <rect x="14" y="70" width="20" height="28" rx="10" fill="#F0B87A" transform="rotate(14,14,70)" />
      <g className="mama-stir-arm" style={{ transformOrigin:'93px 58px' }}>
        <rect x="86" y="58" width="18" height="28" rx="9" fill="#F0B87A" transform="rotate(-18,93,58)" />
        <rect x="96" y="30" width="5" height="28" rx="2.5" fill="#8A8A7A" />
        <ellipse cx="98" cy="30" rx="7" ry="5.5" fill="#8A8A7A" />
        <ellipse cx="98" cy="30" rx="4" ry="3.5" fill="#F0B87A" />
      </g>
      <rect x="55" y="46" width="18" height="13" rx="7" fill="#F0B87A" />
      <ellipse cx="64" cy="31" rx="30" ry="32" fill="#FADA9A" />
      <ellipse cx="64" cy="15" rx="30" ry="20" fill="#7A4A20" />
      <ellipse cx="36" cy="31" rx="9"  ry="18" fill="#7A4A20" />
      <ellipse cx="92" cy="31" rx="9"  ry="18" fill="#7A4A20" />
      <ellipse cx="64" cy="34" rx="24" ry="27" fill="#FADA9A" />
      <rect x="36" y="12" width="56" height="12" rx="6" fill="#1B2B4B" />
      <ellipse cx="39" cy="12" rx="11" ry="8"  fill="#F5C842" stroke="#1B2B4B" strokeWidth="1.5" />
      <ellipse cx="39" cy="12" rx="7"  ry="5"  fill="#E8B820" />
      <circle  cx="39" cy="12" r="3"   fill="#F5C842" />
      <ellipse cx="52" cy="34" rx="5.5" ry="6.5" fill="#fff" />
      <ellipse cx="52" cy="35" rx="3.5" ry="4.5" fill="#2C1A0E" />
      <circle  cx="54" cy="33" r="1.4" fill="#fff" />
      <path d="M72 34 Q78 30 84 34" stroke="#2C1A0E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M47 27 Q52 24 57 27" stroke="#2C1A0E" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <ellipse cx="43" cy="42" rx="6.5" ry="3.5" fill="#F0A060" opacity=".3" />
      <ellipse cx="85" cy="42" rx="6.5" ry="3.5" fill="#F0A060" opacity=".3" />
      <path d="M50 48 Q64 58 78 48" stroke="#A0603A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
