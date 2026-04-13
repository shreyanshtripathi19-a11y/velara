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

  if (loading) return <AdminShell><p style={{ color: "rgba(0,0,0,.4)" }}>Loading…</p></AdminShell>;

  return (
    <AdminShell>
      {/* Upload section */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3>Upload New Image</h3>
        </div>
        <div className="admin-card-body">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label className="admin-label">File</label>
              <input ref={fileRef} type="file" accept="image/*" className="admin-input" style={{ padding: 8 }} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label className="admin-label">Alt Text / Description</label>
              <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Window install — Toronto" className="admin-input" />
            </div>
            <div style={{ flex: "0 0 150px" }}>
              <label className="admin-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                <option value="windows">Windows</option>
                <option value="doors">Doors</option>
                <option value="garage">Garage</option>
              </select>
            </div>
            <button onClick={upload} disabled={uploading} className="admin-btn admin-btn-primary" style={{ whiteSpace: "nowrap", opacity: uploading ? 0.6 : 1 }}>
              {uploading ? "Uploading…" : "Upload →"}
            </button>
          </div>
        </div>
      </div>

      {/* Image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {images.map((img) => (
          <div key={img.id} className="admin-card" style={{ overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} loading="lazy" />
            <div style={{ padding: 14 }}>
              <p style={{ color: "var(--ink)", fontSize: ".82rem", margin: "0 0 8px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.alt || "Untitled"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="admin-product-badge">{img.category}</span>
                <button onClick={() => deleteImage(img.id)} className="admin-btn admin-btn-danger" style={{ padding: "4px 12px", fontSize: ".75rem" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p style={{ textAlign: "center", color: "rgba(0,0,0,.3)", padding: 40 }}>No images yet. Upload one above.</p>}
    </AdminShell>
  );
}
