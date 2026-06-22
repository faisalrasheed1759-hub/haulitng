import { getEquipment } from "@/lib/equipment";
import Link from "next/link";
import EquipmentImage from "@/components/EquipmentImage";

const categoryLabels = {
  excavator: "Excavators", crane: "Cranes", "swamp-buggy": "Swamp Buggies",
  dozer: "Bulldozers", grader: "Graders", forklift: "Forklifts", trailer: "Lowbed Trailers",
};

const formatPrice = (p) => "₦" + p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function EquipmentPage({ searchParams }) {
  const cat = searchParams?.category || null;
  const all = getEquipment();
  const items = cat ? all.filter((e) => e.category === cat) : all;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px" }}>Heavy Equipment</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "14px" }}>Buy • Lease • Transport nationwide | {all.length} units available</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <a href="/dashboard" style={miniBtn}>Fleet</a>
          <a href="/" style={miniBtn}>Home</a>
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "24px", flexWrap: "wrap" }}>
        <Link href="/equipment" style={!cat ? activeChip : chip} key="all">All ({all.length})</Link>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = all.filter((e) => e.category === key).length;
          return (
            <Link key={key} href={`/equipment?category=${key}`}
              style={cat === key ? activeChip : chip}>
              {label} ({count})
            </Link>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {items.map((item) => (
          <Link key={item.id} href={`/equipment/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "white", borderRadius: "12px", overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "box-shadow 0.2s", cursor: "pointer",
            }}>
              <EquipmentImage category={item.category} image={item.image} height={120} fontSize="48px" />
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px" }}>
                  <div>
                    <strong style={{ fontSize: "14px" }}>{item.brand} {item.model}</strong>
                    <div style={{ fontSize: "12px", color: "#888" }}>{item.type} — {item.year}</div>
                  </div>
                  <span style={{
                    background: item.condition === "Excellent" ? "#27ae60" : item.condition === "Good" ? "#e67e22" : "#e74c3c",
                    color: "white", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 600, whiteSpace: "nowrap",
                  }}>{item.condition}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  {item.hours > 0 ? `${item.hours.toLocaleString()} hrs` : "New"} — 📍 {item.location}
                </div>
                <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(item.mode === "sale" || item.mode === "both") && (
                    <span style={tagStyle}>💰 {formatPrice(item.price)}</span>
                  )}
                  {(item.mode === "lease" || item.mode === "both") && (
                    <span style={{ ...tagStyle, background: "#eef2ff", color: "#2c3e50" }}>📅 ₦{(item.leaseDaily / 1000).toFixed(0)}k/day</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const chip = { display: "inline-block", padding: "6px 14px", background: "#eee", color: "#333", textDecoration: "none", borderRadius: "20px", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap" };
const activeChip = { display: "inline-block", padding: "6px 14px", background: "#2c3e50", color: "white", textDecoration: "none", borderRadius: "20px", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap" };
const miniBtn = { padding: "6px 14px", background: "#2c3e50", color: "white", textDecoration: "none", borderRadius: "6px", fontSize: "12px" };
const tagStyle = { padding: "4px 10px", background: "#f0fdf4", color: "#166534", borderRadius: "6px", fontSize: "12px", fontWeight: 600 };
