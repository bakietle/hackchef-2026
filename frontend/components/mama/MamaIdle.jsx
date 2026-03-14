// MamaIdle — yellow warm palette, arm fully fixed
export default function MamaIdle({ size = 150 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 140 155" style={{ display:'block', margin:'0 auto' }}>
      {/* shadow */}
      <ellipse cx="70" cy="152" rx="26" ry="4" fill="#E8C870" opacity=".35" />

      {/* ── LEGS ── */}
      <rect x="49" y="132" width="15" height="17" rx="7.5" fill="#F0B87A" />
      <rect x="76" y="132" width="15" height="17" rx="7.5" fill="#F0B87A" />
      {/* shoes — yellow */}
      <ellipse cx="56"  cy="149" rx="12" ry="5" fill="#F5C842" stroke="#1B2B4B" strokeWidth="1.5" />
      <ellipse cx="84" cy="149" rx="12" ry="5" fill="#F5C842" stroke="#1B2B4B" strokeWidth="1.5" />
      {/* shoe detail */}
      <ellipse cx="50"  cy="148" rx="5"  ry="3" fill="#E8B820" />
      <ellipse cx="78" cy="148" rx="5"  ry="3" fill="#E8B820" />

      {/* ── BODY — warm yellow ── */}
      <rect x="39" y="79" width="62" height="61" rx="22" fill="#F5C842" />
      {/* apron bib */}
      <rect x="48" y="79" width="44" height="48" rx="14" fill="#FFF8DC" stroke="#E8B820" strokeWidth="1.2" />
      {/* pocket */}
      <rect x="56" y="104" width="28" height="18" rx="8" fill="#FFE8A0" stroke="#E8B820" strokeWidth="1.2" />
      {/* apron tie knot */}
      <circle cx="70" cy="79" r="4" fill="#1B2B4B" />
      <rect x="67" y="74" width="6" height="10" rx="3" fill="#1B2B4B" />

      {/* ── LEFT ARM — down, resting ── */}
      <path d="M39 88 Q24 96 22 112 Q21 120 30 122 Q38 123 40 115 Q42 104 43 95Z"
        fill="#F0B87A" />
      {/* left hand */}
      <ellipse cx="29" cy="121" rx="9" ry="7.5" fill="#F0B87A" />
      <ellipse cx="21" cy="117" rx="4.5" ry="4" fill="#F0B87A" />
      <ellipse cx="20" cy="124" rx="4.5" ry="4" fill="#F0B87A" />

      {/* ── RIGHT ARM — waving, drawn as a path so it naturally curves up ── */}
      <path d="M101 88 Q112 80 118 68 Q122 58 115 52 Q108 47 104 56 Q100 66 98 78Z"
        fill="#F0B87A" />
      {/* right hand at top */}
      <ellipse cx="113" cy="50" rx="9" ry="8" fill="#F0B87A" />
      <ellipse cx="106" cy="43" rx="4.5" ry="4" fill="#F0B87A" />
      <ellipse cx="114" cy="41" rx="4.5" ry="4" fill="#F0B87A" />
      <ellipse cx="121" cy="45" rx="4.5" ry="4" fill="#F0B87A" />
      {/* wave animation wrapper — subtle rotate on whole arm area */}
      <g className="mama-wave-arm" style={{ transformOrigin:'101px 88px' }}>
        <path d="M101 88 Q112 80 118 68 Q122 58 115 52 Q108 47 104 56 Q100 66 98 78Z"
          fill="#F0B87A" />
        <ellipse cx="113" cy="50" rx="9" ry="8" fill="#F0B87A" />
        <ellipse cx="106" cy="43" rx="4.5" ry="4" fill="#F0B87A" />
        <ellipse cx="114" cy="41" rx="4.5" ry="4" fill="#F0B87A" />
        <ellipse cx="121" cy="45" rx="4.5" ry="4" fill="#F0B87A" />
      </g>

      {/* ── NECK ── */}
      <rect x="61" y="69" width="18" height="14" rx="8" fill="#F0B87A" />

      {/* ── HEAD ── */}
      {/* hair back — warm brown */}
      <ellipse cx="70" cy="44" rx="34" ry="36" fill="#7A4A20" />
      {/* hair sides */}
      <ellipse cx="40" cy="47" rx="10" ry="20" fill="#7A4A20" />
      <ellipse cx="100" cy="47" rx="10" ry="20" fill="#7A4A20" />
      {/* hair highlights */}
      <ellipse cx="56" cy="20" rx="9"  ry="11" fill="#8C5A28" />
      <ellipse cx="70" cy="16" rx="11" ry="9"  fill="#8C5A28" />
      <ellipse cx="84" cy="20" rx="9"  ry="11" fill="#8C5A28" />
      {/* face */}
      <ellipse cx="70" cy="50" rx="29" ry="31" fill="#FADA9A" />

      {/* ── HEADBAND — navy with yellow bow ── */}
      <rect x="38" y="24" width="64" height="13" rx="6.5" fill="#1B2B4B" />
      {/* bow */}
      <ellipse cx="40" cy="24" rx="14" ry="9"  fill="#F5C842" stroke="#1B2B4B" strokeWidth="1.5" />
      <ellipse cx="40" cy="24" rx="9"  ry="5.5" fill="#E8B820" />
      <circle  cx="40" cy="24" r="3.5" fill="#F5C842" stroke="#1B2B4B" strokeWidth="1" />
      {/* headband dots */}
      <circle cx="58" cy="28" r="2" fill="#F5C842" opacity=".6" />
      <circle cx="70" cy="26" r="2" fill="#F5C842" opacity=".6" />
      <circle cx="82" cy="28" r="2" fill="#F5C842" opacity=".6" />

      {/* ── EYES ── */}
      <g className="mama-blink" style={{ transformOrigin:'55px 50px' }}>
        <ellipse cx="55" cy="50" rx="6.5" ry="7.5" fill="#fff" />
        <ellipse cx="55" cy="51" rx="4"   ry="5"   fill="#2C1A0E" />
        <circle  cx="57" cy="48.5" r="1.6" fill="#fff" />
        <circle  cx="57.5" cy="52" r=".6"  fill="#fff" opacity=".5" />
      </g>
      <g className="mama-blink" style={{ transformOrigin:'85px 50px' }}>
        <ellipse cx="85" cy="50" rx="6.5" ry="7.5" fill="#fff" />
        <ellipse cx="85" cy="51" rx="4"   ry="5"   fill="#2C1A0E" />
        <circle  cx="87" cy="48.5" r="1.6" fill="#fff" />
        <circle  cx="87.5" cy="52" r=".6"  fill="#fff" opacity=".5" />
      </g>
      {/* lashes */}
      <path d="M49 43 Q55 40 61 43" stroke="#2C1A0E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M79 43 Q85 40 91 43" stroke="#2C1A0E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* nose */}
      <circle cx="70" cy="57" r="1.8" fill="#D4904A" opacity=".5" />
      {/* blush — warm yellow-orange */}
      <ellipse cx="46" cy="61" rx="7.5" ry="4" fill="#F0A060" opacity=".28" />
      <ellipse cx="94" cy="61" rx="7.5" ry="4" fill="#F0A060" opacity=".28" />
      {/* smile */}
      <path d="M58 66 Q70 77 82 66" stroke="#A0603A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
