"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useRouter } from "next/navigation";

interface Contact { id: number; firstName: string; lastName: string; phone: string; email: string; product: string; message: string; isRead: number; createdAt: string }

export default function LeadsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    fetch("/api/admin/contacts")
      .then((r) => { if (r.status === 401) { router.push("/admin"); return null; } return r.json(); })
      .then((d) => { if (d) setContacts(d.contacts); })
      .catch(() => router.push("/admin"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number, isRead: boolean) => {
    await fetch("/api/admin/contacts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isRead }) });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: isRead ? 1 : 0 } : c)));
  };

  const deleteLead = async (id: number) => {
    if (!confirm("Delete this lead?")) return;
    await fetch("/api/admin/contacts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const exportCSV = () => {
    const headers = "Name,Email,Phone,Product,Message,Date\n";
    const rows = contacts.map((c) => `"${c.firstName} ${c.lastName}","${c.email}","${c.phone}","${c.product}","${(c.message || "").replace(/"/g, '""')}","${c.createdAt}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `velara-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const unread = contacts.filter((c) => !c.isRead).length;

  if (loading) return <AdminShell><p style={{ color: "rgba(0,0,0,.4)" }}>Loading…</p></AdminShell>;

  return (
    <AdminShell unread={unread}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: "rgba(0,0,0,.45)", fontSize: ".85rem" }}>{contacts.length} total leads · {unread} unread</p>
        <button onClick={exportCSV} className="admin-btn admin-btn-ghost">Export CSV ↓</button>
      </div>

      <div className="admin-card">
        {contacts.map((c) => (
          <div key={c.id} className="admin-lead-row">
            <div
              className="admin-lead-header"
              onClick={() => { setExpanded(expanded === c.id ? null : c.id); if (!c.isRead) markRead(c.id, true); }}
            >
              <span className="admin-unread-dot" style={{ background: c.isRead ? "transparent" : "var(--accent)" }} />
              <span style={{ color: "var(--ink)", fontWeight: c.isRead ? 400 : 600, fontSize: ".9rem", minWidth: 160 }}>{c.firstName} {c.lastName}</span>
              <span style={{ color: "rgba(0,0,0,.4)", fontSize: ".84rem", flex: 1 }}>{c.email}</span>
              <span className="admin-product-badge">{c.product}</span>
              <span style={{ color: "rgba(0,0,0,.3)", fontSize: ".78rem", minWidth: 90 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            {expanded === c.id && (
              <div className="admin-lead-detail">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><span className="admin-label" style={{ marginBottom: 2 }}>Phone</span><p style={{ margin: 0, fontSize: ".9rem" }}><a href={`tel:${c.phone}`} style={{ color: "var(--accent)", textDecoration: "none" }}>{c.phone}</a></p></div>
                  <div><span className="admin-label" style={{ marginBottom: 2 }}>Email</span><p style={{ margin: 0, fontSize: ".9rem" }}><a href={`mailto:${c.email}`} style={{ color: "var(--accent)", textDecoration: "none" }}>{c.email}</a></p></div>
                </div>
                {c.message && (
                  <div><span className="admin-label" style={{ marginBottom: 2 }}>Message</span><p style={{ margin: "4px 0 0", color: "rgba(0,0,0,.6)", fontSize: ".88rem", lineHeight: 1.6 }}>{c.message}</p></div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => markRead(c.id, !c.isRead)} className="admin-btn admin-btn-ghost">{c.isRead ? "Mark Unread" : "Mark Read"}</button>
                  <button onClick={() => deleteLead(c.id)} className="admin-btn admin-btn-danger">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {contacts.length === 0 && (
          <p style={{ padding: 40, textAlign: "center", color: "rgba(0,0,0,.3)" }}>No leads yet. They will appear here when someone submits the contact form.</p>
        )}
      </div>
    </AdminShell>
  );
}
