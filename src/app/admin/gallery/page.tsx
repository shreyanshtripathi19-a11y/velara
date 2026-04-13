"use client";
import { useEffect, useState, useRef, useCallback } from "react";
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
  const [dragActive, setDragActive] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [replacing, setReplacing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => setImages(d.images || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt || file.name.replace(/\.[^.]+$/, ""));
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
  }, [alt, category, router]);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const replaceImage = async (id: number) => {
    const file = replaceRef.current?.files?.[0];
    if (!file) return;
    setReplacing(true);
    // Delete old, upload new with same category/alt
    const oldImg = images.find(i => i.id === id);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", oldImg?.alt || "");
    fd.append("category", oldImg?.category || "windows");
    try {
      await fetch("/api/admin/images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [data.image, ...prev.filter(i => i.id !== id)]);
        setEditId(null);
      }
    } catch {
      alert("Replace failed");
    } finally {
      setReplacing(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this image permanently?")) return;
    const res = await fetch("/api/admin/images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.status === 401) { router.push("/admin"); return; }
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    for (const file of files) {
      await uploadFile(file);
    }
  };

  if (loading) return <AdminShell><p style={{ color: "rgba(0,0,0,.4)" }}>Loading…</p></AdminShell>;

  return (
    <AdminShell>
      {/* Drag & Drop Zone */}
      <div
        className={`admin-dropzone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={dragActive ? "var(--accent)" : "rgba(0,0,0,.2)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p className="admin-dropzone-text">
          {dragActive ? "Drop images here…" : "Drag & drop images here"}
        </p>
        <p className="admin-dropzone-sub">or use the form below</p>
      </div>

      {/* Upload form */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3>Upload New Image</h3>
          <span style={{ color: "rgba(0,0,0,.35)", fontSize: ".78rem" }}>{images.length} images</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }} className="admin-upload-grid">
            <div>
              <label className="admin-label">File</label>
              <input ref={fileRef} type="file" accept="image/*" className="admin-input" style={{ padding: 8 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="admin-label">Description</label>
                <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Window install — Toronto" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                  <option value="windows">Windows</option>
                  <option value="doors">Doors</option>
                  <option value="garage">Garage</option>
                </select>
              </div>
            </div>
            <button onClick={upload} disabled={uploading} className="admin-btn admin-btn-primary" style={{ whiteSpace: "nowrap", opacity: uploading ? 0.6 : 1, height: 42 }}>
              {uploading ? "Uploading…" : "Upload →"}
            </button>
          </div>
        </div>
      </div>

      {/* Image grid */}
      <div className="admin-gallery-grid">
        {images.map((img) => (
          <div key={img.id} className="admin-gallery-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="admin-gallery-img" loading="lazy" />
            <div className="admin-gallery-info">
              <p className="admin-gallery-title">{img.alt || "Untitled"}</p>
              <span className="admin-product-badge" style={{ fontSize: ".7rem" }}>{img.category}</span>
            </div>
            <div className="admin-gallery-actions">
              <button onClick={() => { setEditId(img.id); setTimeout(() => replaceRef.current?.click(), 50); }} className="admin-btn admin-btn-ghost" style={{ padding: "4px 10px", fontSize: ".75rem" }}>
                Replace
              </button>
              <button onClick={() => deleteImage(img.id)} className="admin-btn admin-btn-danger" style={{ padding: "4px 10px", fontSize: ".75rem" }}>
                Delete
              </button>
            </div>
            {editId === img.id && (
              <div className="admin-gallery-replace">
                <input ref={replaceRef} type="file" accept="image/*" onChange={() => replaceImage(img.id)} style={{ display: "none" }} />
                <p style={{ fontSize: ".78rem", color: "rgba(0,0,0,.4)", margin: 0 }}>{replacing ? "Replacing…" : "Select a new image…"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {images.length === 0 && <p style={{ textAlign: "center", color: "rgba(0,0,0,.3)", padding: 40 }}>No images yet. Drag & drop or upload above.</p>}
    </AdminShell>
  );
}
