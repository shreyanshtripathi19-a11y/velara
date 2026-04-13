"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) { setError("Invalid credentials"); return; }
      router.push("/admin/dashboard");
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 40, background: "#1a1a2e", borderRadius: 16, border: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>VELARA</div>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".85rem", marginTop: 8 }}>Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,.5)", fontSize: ".8rem", marginBottom: 6, fontWeight: 500 }}>Username</label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: ".95rem", outline: "none", boxSizing: "border-box" }}
              placeholder="admin" required autoFocus
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,.5)", fontSize: ".8rem", marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: ".95rem", outline: "none", boxSizing: "border-box" }}
              placeholder="••••••••" required
            />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: ".85rem", marginBottom: 12 }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6c3ce0, #8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: ".95rem", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
