"use client";
import { useEffect, useState, useRef } from "react";
import AdminShell from "@/components/AdminShell";
import { useRouter } from "next/navigation";

interface GalleryImage { id: number; src: string; alt: string; category: string; createdAt: string }

export default function GalleryAdminPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState("windows");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => setImages(d.images || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt);
    fd.append("category", category);
    try {
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [data.image, ...prev]);
        setAlt("");
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this image? It will be permanently removed from the server.")) return;
    const res = await fetch("/api/admin/images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.status === 401) { router.push("/admin"); return; }
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) return <AdminShell><p style={{ color: "rgba(255,255,255,.5)" }}>Loading…</p></AdminShell>;

  return (
    <AdminShell>
      {/* Upload section */}
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ color: "#fff", fontSize: ".95rem", fontWeight: 600, margin: "0 0 16px" }}>Upload New Image</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ color: "rgba(255,255,255,.4)", fontSize: ".75rem", display: "block", marginBottom: 4 }}>File</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ width: "100%", padding: "8px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: ".85rem" }} />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ color: "rgba(255,255,255,.4)", fontSize: ".75rem", display: "block", marginBottom: 4 }}>Alt Text / Description</label>
            <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Window install — Toronto" style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: ".85rem", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: "0 0 150px" }}>
            <label style={{ color: "rgba(255,255,255,.4)", fontSize: ".75rem", display: "block", marginBottom: 4 }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: ".85rem" }}>
              <option value="windows">Windows</option>
              <option value="doors">Doors</option>
              <option value="garage">Garage</option>
            </select>
          </div>
          <button onClick={upload} disabled={uploading} style={{ padding: "10px 24px", background: "linear-gradient(135deg, #6c3ce0, #8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: ".85rem", fontWeight: 600, cursor: "pointer", opacity: uploading ? 0.6 : 1, whiteSpace: "nowrap" }}>
            {uploading ? "Uploading…" : "Upload →"}
          </button>
        </div>
      </div>

      {/* Image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {images.map((img) => (
          <div key={img.id} style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} loading="lazy" />
            <div style={{ padding: "12px" }}>
              <p style={{ color: "#fff", fontSize: ".8rem", margin: "0 0 4px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.alt || "Untitled"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "rgba(108,60,224,.15)", color: "#8b5cf6", padding: "2px 8px", borderRadius: 4, fontSize: ".7rem", fontWeight: 500 }}>{img.category}</span>
                <button onClick={() => deleteImage(img.id)} style={{ background: "none", border: "none", color: "rgba(239,68,68,.7)", fontSize: ".78rem", cursor: "pointer", padding: "4px 8px" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p style={{ textAlign: "center", color: "rgba(255,255,255,.3)", padding: 40 }}>No images yet. Upload one above.</p>}
    </AdminShell>
  );
}
