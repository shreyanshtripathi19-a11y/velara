"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/leads", label: "Leads", icon: "📋" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminShell({ children, unread = 0 }: { children: React.ReactNode; unread?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  const logout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f1a" }}>
      {/* Mobile overlay */}
      {sideOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 999 }} onClick={() => setSideOpen(false)} />}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#1a1a2e", borderRight: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", padding: "24px 0",
        position: "fixed", left: sideOpen ? 0 : "-240px", top: 0, bottom: 0, zIndex: 1000, transition: "left .25s ease",
        ...(typeof window !== "undefined" && window.innerWidth > 768 ? { position: "sticky", left: 0, top: 0, height: "100vh" } : {}),
      }}>
        <div style={{ padding: "0 24px", marginBottom: 32 }}>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>VELARA</div>
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".7rem", marginTop: 4, textTransform: "uppercase", letterSpacing: ".1em" }}>Admin Panel</p>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSideOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", color: active ? "#fff" : "rgba(255,255,255,.5)",
                background: active ? "rgba(108,60,224,.2)" : "transparent", borderLeft: active ? "3px solid #6c3ce0" : "3px solid transparent",
                textDecoration: "none", fontSize: ".9rem", fontWeight: active ? 600 : 400, transition: "all .15s",
              }}>
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                {item.label}
                {item.label === "Leads" && unread > 0 && (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: ".7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "0 24px" }}>
          <button onClick={logout} style={{
            width: "100%", padding: "10px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8,
            color: "rgba(255,255,255,.5)", fontSize: ".85rem", cursor: "pointer",
          }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.3rem", cursor: "pointer", display: "none" }} className="admin-menu-btn">☰</button>
          <h1 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
            {navItems.find(n => n.href === pathname)?.label || "Admin"}
          </h1>
        </div>
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
