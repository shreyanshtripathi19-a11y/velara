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
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h3>Notification Bar</h3>
          </div>
          <div className="admin-card-body">
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">Banner Text</label>
              <input
                type="text" value={text} onChange={(e) => setText(e.target.value)}
                className="admin-input"
                placeholder="SPRING SPECIAL – 25% OFF THIS MONTH!"
              />
            </div>

            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <label className="admin-label" style={{ marginBottom: 0 }}>Enabled</label>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`admin-toggle ${enabled ? "on" : "off"}`}
              >
                <span className="admin-toggle-knob" style={{ left: enabled ? 25 : 3 }} />
              </button>
            </div>

            {/* Preview */}
            {enabled && text && (
              <div style={{ marginBottom: 20 }}>
                <p className="admin-label">Preview</p>
                <div style={{
                  background: "linear-gradient(135deg, #6c3ce0 0%, #8b5cf6 100%)",
                  color: "#fff", textAlign: "center", padding: "10px 24px", borderRadius: 8,
                  fontSize: ".85rem", fontWeight: 600, letterSpacing: ".04em",
                }}>
                  {text}
                </div>
              </div>
            )}

            <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
