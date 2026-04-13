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

  if (loading) return <AdminShell><p style={{ color: "rgba(255,255,255,.5)" }}>Loading…</p></AdminShell>;

  return (
    <AdminShell unread={unread}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".85rem" }}>{contacts.length} total leads · {unread} unread</p>
        <button onClick={exportCSV} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: ".8rem", cursor: "pointer", fontWeight: 500 }}>
          Export CSV ↓
        </button>
      </div>

      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden" }}>
        {contacts.map((c) => (
          <div key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
            <div
              onClick={() => { setExpanded(expanded === c.id ? null : c.id); if (!c.isRead) markRead(c.id, true); }}
              style={{ padding: "16px 20px", cursor: "pointer", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.isRead ? "transparent" : "#6c3ce0", flexShrink: 0 }} />
              <span style={{ color: "#fff", fontWeight: c.isRead ? 400 : 600, fontSize: ".9rem", minWidth: 160 }}>{c.firstName} {c.lastName}</span>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: ".84rem", flex: 1 }}>{c.email}</span>
              <span style={{ background: "rgba(108,60,224,.15)", color: "#8b5cf6", padding: "3px 10px", borderRadius: 6, fontSize: ".75rem", fontWeight: 500 }}>{c.product}</span>
              <span style={{ color: "rgba(255,255,255,.25)", fontSize: ".78rem", minWidth: 90 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            {expanded === c.id && (
              <div style={{ padding: "0 20px 20px 44px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><span style={{ color: "rgba(255,255,255,.3)", fontSize: ".75rem" }}>Phone</span><p style={{ margin: 0, color: "#fff", fontSize: ".9rem" }}><a href={`tel:${c.phone}`} style={{ color: "#8b5cf6", textDecoration: "none" }}>{c.phone}</a></p></div>
                  <div><span style={{ color: "rgba(255,255,255,.3)", fontSize: ".75rem" }}>Email</span><p style={{ margin: 0, color: "#fff", fontSize: ".9rem" }}><a href={`mailto:${c.email}`} style={{ color: "#8b5cf6", textDecoration: "none" }}>{c.email}</a></p></div>
                </div>
                {c.message && (
                  <div><span style={{ color: "rgba(255,255,255,.3)", fontSize: ".75rem" }}>Message</span><p style={{ margin: "4px 0 0", color: "rgba(255,255,255,.7)", fontSize: ".88rem", lineHeight: 1.6 }}>{c.message}</p></div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => markRead(c.id, !c.isRead)} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", padding: "6px 14px", borderRadius: 6, fontSize: ".78rem", cursor: "pointer" }}>
                    {c.isRead ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button onClick={() => deleteLead(c.id)} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#ef4444", padding: "6px 14px", borderRadius: 6, fontSize: ".78rem", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {contacts.length === 0 && (
          <p style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,.3)" }}>No leads yet. They will appear here when someone submits the contact form.</p>
        )}
      </div>
    </AdminShell>
  );
}
