export default function Logo({ size = 20, showText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg width={size * 1.8} height={size} viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="10" width="22" height="6" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="6" y="6" width="14" height="4" rx="1" fill="currentColor" opacity="0.7"/>
        <circle cx="8" cy="17" r="2.5" fill="currentColor" opacity="0.8"/>
        <circle cx="18" cy="17" r="2.5" fill="currentColor" opacity="0.8"/>
        <rect x="24" y="11" width="4" height="5" rx="0.5" fill="currentColor" opacity="0.6"/>
        <rect x="28" y="8" width="2" height="8" rx="0.5" fill="currentColor" opacity="0.5"/>
        <rect x="30" y="5" width="1.5" height="11" rx="0.5" fill="currentColor" opacity="0.4"/>
        <rect x="31.5" y="3" width="1" height="13" rx="0.5" fill="currentColor" opacity="0.3"/>
      </svg>
      {showText && (
        <span style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.5px" }}>
          HaulitNG
        </span>
      )}
    </div>
  );
}
