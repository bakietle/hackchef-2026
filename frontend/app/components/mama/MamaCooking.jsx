export default function MamaCooking({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" style={{ display: 'block', margin: '0 auto' }}>
      {/* pot */}
      <rect x="20" y="94" width="78" height="30" rx="13" fill="#8A8A7A" stroke="#1A1A14" strokeWidth="1.5" />
      <rect x="22" y="90" width="74" height="10" rx="5" fill="#6B6B5A" stroke="#1A1A14" strokeWidth="1.5" />
      <rect x="10" y="96" width="14" height="11" rx="5.5" fill="#6B6B5A" stroke="#1A1A14" strokeWidth="1.5" />
      <rect x="96" y="96" width="14" height="11" rx="5.5" fill="#6B6B5A" stroke="#1A1A14" strokeWidth="1.5" />
      {/* food in pot — yolk yellow */}
      <ellipse cx="59" cy="95" rx="30" ry="7" fill="#F5C842" opacity=".8" />
      {/* steam */}
      <path className="mama-steam-a" d="M38 88 Q42 78 38 68" stroke="#D8D5C4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path className="mama-steam-b" d="M59 86 Q63 75 59 65" stroke="#D8D5C4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path className="mama-steam-c" d="M80 88 Q84 78 80 68" stroke="#D8D5C4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="33" y="56" width="52" height="42" rx="16" fill="#7BAF6E" />
      <rect x="41" y="56" width="36" height="30" rx="10" fill="#F7F5EE" />
      <rect x="46" y="70" width="26" height="13" rx="6" fill="#E8F5E4" />
      {/* legs */}
      <rect x="38" y="90" width="14" height="10" rx="6" fill="#C8A882" />
      <rect x="66" y="90" width="14" height="10" rx="6" fill="#C8A882" />
      {/* left arm holding pot */}
      <rect x="15" y="70" width="19" height="28" rx="9.5" fill="#E8C49A" transform="rotate(12,15,70)" />
      {/* right arm stirring */}
      <g className="mama-stir-arm" style={{ transformOrigin: '93px 58px' }}>
        <rect x="86" y="58" width="17" height="28" rx="8.5" fill="#E8C49A" transform="rotate(-18,93,58)" />
        {/* spoon */}
        <rect x="96" y="30" width="5" height="28" rx="2.5" fill="#8A8A7A" />
        <ellipse cx="98" cy="30" rx="7" ry="5.5" fill="#8A8A7A" />
        <ellipse cx="98" cy="30" rx="4.5" ry="3.5" fill="#C8A882" />
      </g>
      {/* neck */}
      <rect x="54" y="47" width="18" height="13" rx="7" fill="#E8C49A" />
      {/* HEAD */}
      <ellipse cx="63" cy="32" rx="31" ry="33" fill="#F2C99A" />
      <ellipse cx="63" cy="16" rx="31" ry="21" fill="#6B4423" />
      <ellipse cx="35" cy="32" rx="9"  ry="18" fill="#6B4423" />
      <ellipse cx="91" cy="32" rx="9"  ry="18" fill="#6B4423" />
      <ellipse cx="63" cy="35" rx="25" ry="28" fill="#F2C99A" />
      {/* headband lime */}
      <rect x="34" y="13" width="58" height="12" rx="6" fill="#C8F135" stroke="#1A1A14" strokeWidth="1.5" />
      <ellipse cx="37" cy="13" rx="11" ry="8"  fill="#C8F135" stroke="#1A1A14" strokeWidth="1.5" />
      <ellipse cx="37" cy="13" rx="7"  ry="5"  fill="#A8D420" />
      <circle  cx="37" cy="13" r="3"   fill="#C8F135" />
      {/* focused wink */}
      <ellipse cx="51" cy="35" rx="5.5" ry="6.5" fill="#fff" stroke="#1A1A14" strokeWidth="1" />
      <ellipse cx="51" cy="36" rx="3.5" ry="4.5" fill="#3D2010" />
      <circle  cx="53" cy="33.5" r="1.2" fill="#fff" />
      <path d="M71 35 Q77 31 83 35" stroke="#3D2010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* lashes */}
      <path d="M46 28 Q51 25 56 28" stroke="#3D2010" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="42" cy="43" rx="6.5" ry="3.5" fill="#7BAF6E" opacity=".35" />
      <ellipse cx="84" cy="43" rx="6.5" ry="3.5" fill="#7BAF6E" opacity=".35" />
      {/* smile */}
      <path d="M50 49 Q63 59 76 49" stroke="#A0603A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
