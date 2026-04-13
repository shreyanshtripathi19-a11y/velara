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

  if (loading) return <AdminShell><p style={{ color: "rgba(0,0,0,.4)" }}>Loading…</p></AdminShell>;

  const cards = [
    { label: "Total Leads", value: stats.totalContacts, color: "var(--accent)" },
    { label: "New This Week", value: stats.weekContacts, color: "#10b981" },
    { label: "Unread", value: stats.unreadContacts, color: "#ef4444" },
    { label: "Gallery Images", value: stats.totalImages, color: "#3b82f6" },
  ];

  return (
    <AdminShell unread={stats.unreadContacts}>
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card" style={{ borderTop: `3px solid ${card.color}` }}>
            <p className="admin-stat-label">{card.label}</p>
            <p className="admin-stat-value" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Recent Leads</h3>
          <button onClick={() => router.push("/admin/leads")} className="admin-btn admin-btn-ghost" style={{ fontSize: ".8rem" }}>View All →</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                {["Name", "Email", "Product", "Date"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentContacts.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: "var(--ink)", fontWeight: c.isRead ? 400 : 600 }}>{c.firstName} {c.lastName}</td>
                  <td style={{ color: "rgba(0,0,0,.5)" }}>{c.email}</td>
                  <td><span className="admin-product-badge">{c.product}</span></td>
                  <td style={{ color: "rgba(0,0,0,.35)", fontSize: ".82rem" }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentContacts.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: "center", color: "rgba(0,0,0,.3)" }}>No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
