const categoryGradients = {
  excavator: { gradient: "linear-gradient(135deg, #e67e22, #f39c12)", label: "Excavator" },
  crane: { gradient: "linear-gradient(135deg, #2980b9, #3498db)", label: "Crane" },
  dozer: { gradient: "linear-gradient(135deg, #c0392b, #e74c3c)", label: "Dozer" },
  grader: { gradient: "linear-gradient(135deg, #27ae60, #2ecc71)", label: "Grader" },
  "swamp-buggy": { gradient: "linear-gradient(135deg, #8e44ad, #9b59b6)", label: "Swamp Buggy" },
  forklift: { gradient: "linear-gradient(135deg, #d35400, #e67e22)", label: "Forklift" },
  trailer: { gradient: "linear-gradient(135deg, #2c3e50, #34495e)", label: "Trailer" },
};

const icons = {
  excavator: (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><rect x="2" y="18" width="30" height="8" rx="2" fill="white" opacity="0.9"/><rect x="8" y="10" width="18" height="8" rx="2" fill="white" opacity="0.7"/><circle cx="8" cy="28" r="4" fill="white" opacity="0.6"/><circle cx="26" cy="28" r="4" fill="white" opacity="0.6"/><rect x="32" y="18" width="6" height="8" rx="1" fill="white" opacity="0.5"/><rect x="38" y="14" width="3" height="12" rx="1" fill="white" opacity="0.4"/><rect x="41" y="10" width="2" height="16" rx="1" fill="white" opacity="0.3"/></svg>
  ),
  crane: (
    <svg width="40" height="50" viewBox="0 0 40 50" fill="none"><rect x="14" y="30" width="12" height="16" rx="2" fill="white" opacity="0.9"/><rect x="8" y="26" width="24" height="4" rx="1" fill="white" opacity="0.6"/><rect x="18" y="2" width="4" height="24" rx="1" fill="white" opacity="0.5"/><rect x="28" y="10" width="12" height="4" rx="1" fill="white" opacity="0.4" transform="rotate(-30 28 10)"/><rect x="26" y="18" width="10" height="3" rx="1" fill="white" opacity="0.3"/></svg>
  ),
  dozer: (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><rect x="2" y="18" width="40" height="10" rx="3" fill="white" opacity="0.9"/><rect x="36" y="10" width="20" height="8" rx="2" fill="white" opacity="0.7"/><circle cx="12" cy="30" r="4" fill="white" opacity="0.6"/><circle cx="28" cy="30" r="4" fill="white" opacity="0.6"/><rect x="44" y="28" width="14" height="4" rx="1" fill="white" opacity="0.4"/></svg>
  ),
  grader: (
    <svg width="60" height="35" viewBox="0 0 60 35" fill="none"><rect x="2" y="16" width="50" height="8" rx="3" fill="white" opacity="0.9"/><rect x="46" y="6" width="12" height="10" rx="2" fill="white" opacity="0.7"/><circle cx="14" cy="26" r="3.5" fill="white" opacity="0.6"/><circle cx="28" cy="26" r="3.5" fill="white" opacity="0.6"/><rect x="2" y="24" width="8" height="3" rx="1" fill="white" opacity="0.5"/></svg>
  ),
  "swamp-buggy": (
    <svg width="60" height="35" viewBox="0 0 60 35" fill="none"><rect x="2" y="12" width="44" height="12" rx="3" fill="white" opacity="0.9"/><rect x="34" y="4" width="18" height="8" rx="2" fill="white" opacity="0.7"/><rect x="8" y="24" width="20" height="6" rx="3" fill="white" opacity="0.5"/><rect x="32" y="24" width="20" height="6" rx="3" fill="white" opacity="0.5"/></svg>
  ),
  forklift: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="2" y="14" width="24" height="12" rx="2" fill="white" opacity="0.9"/><rect x="18" y="2" width="8" height="12" rx="1" fill="white" opacity="0.7"/><rect x="26" y="2" width="3" height="24" rx="1" fill="white" opacity="0.5"/><rect x="29" y="6" width="3" height="20" rx="1" fill="white" opacity="0.4"/><circle cx="8" cy="28" r="3.5" fill="white" opacity="0.6"/><circle cx="20" cy="28" r="3.5" fill="white" opacity="0.6"/></svg>
  ),
  trailer: (
    <svg width="60" height="30" viewBox="0 0 60 30" fill="none"><rect x="2" y="8" width="44" height="12" rx="2" fill="white" opacity="0.9"/><rect x="38" y="4" width="18" height="4" rx="1" fill="white" opacity="0.6"/><circle cx="10" cy="22" r="3.5" fill="white" opacity="0.6"/><circle cx="24" cy="22" r="3.5" fill="white" opacity="0.6"/><circle cx="40" cy="22" r="3.5" fill="white" opacity="0.6"/></svg>
  ),
};

export default function EquipmentImage({ category, image, height = 180, fontSize = "72px" }) {
  const info = categoryGradients[category] || categoryGradients.excavator;

  if (image) {
    return (
      <div style={{ height, overflow: "hidden", background: "#ddd" }}>
        <img src={image} alt={info.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div style={{
      height, background: info.gradient,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
    }}>
      {icons[category] || icons.excavator}
      <span style={{ color: "white", opacity: 0.7, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
        {info.label}
      </span>
    </div>
  );
}
