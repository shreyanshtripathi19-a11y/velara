"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useRouter } from "next/navigation";

interface Contact { id: number; firstName: string; lastName: string; phone: string; email: string; product: string; isRead: number; createdAt: string }

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalContacts: 0, unreadContacts: 0, weekContacts: 0, totalImages: 0, recentContacts: [] as Contact[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => { if (r.status === 401) { router.push("/admin"); return null; } return r.json(); })
      .then((d) => { if (d) setStats(d); })
      .catch(() => router.push("/admin"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <AdminShell><p style={{ color: "rgba(255,255,255,.5)" }}>Loading…</p></AdminShell>;

  const cards = [
    { label: "Total Leads", value: stats.totalContacts, color: "#6c3ce0" },
    { label: "New This Week", value: stats.weekContacts, color: "#10b981" },
    { label: "Unread", value: stats.unreadContacts, color: "#ef4444" },
    { label: "Gallery Images", value: stats.totalImages, color: "#3b82f6" },
  ];

  return (
    <AdminShell unread={stats.unreadContacts}>
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "24px 20px" }}>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".8rem", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: "2rem", fontWeight: 700 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "#fff", fontSize: ".95rem", fontWeight: 600, margin: 0 }}>Recent Leads</h3>
          <button onClick={() => router.push("/admin/leads")} style={{ background: "none", border: "none", color: "#6c3ce0", fontSize: ".85rem", cursor: "pointer", fontWeight: 500 }}>View All →</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                {["Name", "Email", "Product", "Date"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: "rgba(255,255,255,.35)", fontSize: ".75rem", textAlign: "left", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentContacts.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                  <td style={{ padding: "12px 16px", color: "#fff", fontSize: ".88rem", fontWeight: c.isRead ? 400 : 600 }}>{c.firstName} {c.lastName}</td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,.5)", fontSize: ".85rem" }}>{c.email}</td>
                  <td style={{ padding: "12px 16px" }}><span style={{ background: "rgba(108,60,224,.15)", color: "#8b5cf6", padding: "4px 10px", borderRadius: 6, fontSize: ".78rem", fontWeight: 500 }}>{c.product}</span></td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,.35)", fontSize: ".8rem" }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentContacts.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: ".85rem" }}>No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
