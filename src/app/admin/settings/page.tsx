"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => { if (r.status === 401) { router.push("/admin"); return null; } return r.json(); })
      .then((d) => { if (d) { setText(d.text); setEnabled(d.enabled); } })
      .catch(() => router.push("/admin"));
  }, [router]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, enabled }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 640 }}>
        {/* Notification Bar */}
        <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: "#fff", fontSize: ".95rem", fontWeight: 600, margin: "0 0 20px" }}>Notification Bar</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "rgba(255,255,255,.4)", fontSize: ".75rem", display: "block", marginBottom: 6 }}>Banner Text</label>
            <input
              type="text" value={text} onChange={(e) => setText(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: ".9rem", boxSizing: "border-box" }}
              placeholder="SPRING SPECIAL – 25% OFF THIS MONTH!"
            />
          </div>

          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ color: "rgba(255,255,255,.4)", fontSize: ".8rem" }}>Enabled</label>
            <button
              onClick={() => setEnabled(!enabled)}
              style={{
                width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
                background: enabled ? "#6c3ce0" : "rgba(255,255,255,.1)", position: "relative", transition: "background .2s",
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3,
                left: enabled ? 25 : 3, transition: "left .2s",
              }} />
            </button>
          </div>

          {/* Preview */}
          {enabled && text && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".72rem", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>Preview</p>
              <div style={{
                background: "linear-gradient(135deg, #6c3ce0 0%, #8b5cf6 100%)",
                color: "#fff", textAlign: "center", padding: "10px 24px", borderRadius: 8,
                fontSize: ".85rem", fontWeight: 600, letterSpacing: ".04em",
              }}>
                {text}
              </div>
            </div>
          )}

          <button onClick={save} disabled={saving} style={{
            padding: "12px 28px", background: saved ? "#10b981" : "linear-gradient(135deg, #6c3ce0, #8b5cf6)", color: "#fff",
            border: "none", borderRadius: 8, fontSize: ".88rem", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1,
          }}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
