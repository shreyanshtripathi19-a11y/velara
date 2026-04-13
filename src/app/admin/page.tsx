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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7fc" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "48px 40px", background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,.06)", boxShadow: "0 8px 32px rgba(0,0,0,.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src="/assets/velara-logo.png" alt="Velara" style={{ height: 28, marginBottom: 12 }} />
          <p style={{ color: "rgba(0,0,0,.4)", fontSize: ".85rem", marginTop: 8 }}>Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="admin-label">Username</label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              placeholder="admin" required autoFocus
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="admin-label">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="••••••••" required
            />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: ".85rem", marginBottom: 12 }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", padding: 14, fontSize: ".95rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
