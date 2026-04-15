"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { useRouter } from "next/navigation";

interface UploadedImage { id: number; src: string; alt: string; category: string; sortOrder?: number; createdAt: string }

/* ── Static images used across pages ── */
const pageImages: Record<string, { src: string; label: string; section: string }[]> = {
  "Home": [
    { src: "/assets/v-series.png", label: "V Series Window", section: "Product Lineup" },
    { src: "/assets/signature-series.png", label: "Signature Series Window", section: "Product Lineup" },
    { src: "/assets/doors/steel.png", label: "Steel Entry Door", section: "Product Lineup" },
    { src: "/assets/doors/fibreglass.png", label: "Fibreglass Entry Door", section: "Product Lineup" },
    { src: "/assets/doors/wood.png", label: "Wood Entry Door", section: "Product Lineup" },
    { src: "/assets/garage/steel.png", label: "Steel Garage Door", section: "Product Lineup" },
    { src: "/assets/garage/wood.png", label: "Natural Wood Garage Door", section: "Product Lineup" },
    { src: "/assets/garage/aluminum.png", label: "Aluminum Glass Garage Door", section: "Product Lineup" },
    { src: "/assets/reviews/project-1.jpg", label: "Project 1", section: "Testimonials Gallery" },
    { src: "/assets/reviews/project-2.jpg", label: "Project 2", section: "Testimonials Gallery" },
    { src: "/assets/reviews/project-3.jpg", label: "Project 3", section: "Testimonials Gallery" },
    { src: "/assets/reviews/project-4.jpg", label: "Project 4", section: "Testimonials Gallery" },
    { src: "/assets/reviews/project-5.jpg", label: "Project 5", section: "Testimonials Gallery" },
    { src: "/assets/reviews/project-6.jpg", label: "Project 6", section: "Testimonials Gallery" },
  ],
  "Windows": [
    { src: "/assets/v-series.png", label: "V Series", section: "Series Grid" },
    { src: "/assets/signature-series.png", label: "Signature Series", section: "Series Grid" },
    { src: "/assets/lumina-series.png", label: "Lumina Series", section: "Series Grid" },
    { src: "/assets/loe-glass-pane.png", label: "LoĒ Glass Pane", section: "Glass Technology" },
    { src: "/assets/reviews/project-1.jpg", label: "Project 1", section: "Installs Gallery" },
    { src: "/assets/reviews/project-2.jpg", label: "Project 2", section: "Installs Gallery" },
    { src: "/assets/reviews/project-3.jpg", label: "Project 3", section: "Installs Gallery" },
    { src: "/assets/reviews/project-4.jpg", label: "Project 4", section: "Installs Gallery" },
    { src: "/assets/reviews/project-5.jpg", label: "Project 5", section: "Installs Gallery" },
    { src: "/assets/reviews/project-6.jpg", label: "Project 6", section: "Installs Gallery" },
  ],
  "Doors": [
    { src: "/assets/doors/steel.png", label: "Steel Door", section: "Materials" },
    { src: "/assets/doors/fibreglass.png", label: "Fibreglass Door", section: "Materials" },
    { src: "/assets/doors/wood.png", label: "Solid Wood Door", section: "Materials" },
    { src: "/assets/doors/entry-door.png", label: "Single Door", section: "Collection" },
    { src: "/assets/doors/double-door.png", label: "Double Doors", section: "Collection" },
    { src: "/assets/doors/patio-door.png", label: "Patio Door", section: "Collection" },
    { src: "/assets/doors/sidelights.png", label: "With Sidelights", section: "Collection" },
    { src: "/assets/doors/Custom Glass 2.png", label: "Custom Glass", section: "Collection" },
    { src: "/assets/reviews/project-1.jpg", label: "Project 1", section: "Installs Gallery" },
    { src: "/assets/reviews/project-2.jpg", label: "Project 2", section: "Installs Gallery" },
    { src: "/assets/reviews/project-3.jpg", label: "Project 3", section: "Installs Gallery" },
    { src: "/assets/reviews/project-4.jpg", label: "Project 4", section: "Installs Gallery" },
    { src: "/assets/reviews/project-5.jpg", label: "Project 5", section: "Installs Gallery" },
    { src: "/assets/reviews/project-6.jpg", label: "Project 6", section: "Installs Gallery" },
  ],
  "Garage": [
    { src: "/assets/garage/steel.png", label: "Steel Garage Door", section: "Materials" },
    { src: "/assets/garage/wood.png", label: "Natural Wood", section: "Materials" },
    { src: "/assets/garage/aluminum.png", label: "Aluminum & Glass", section: "Materials" },
    { src: "/assets/reviews/project-1.jpg", label: "Project 1", section: "Installs Gallery" },
    { src: "/assets/reviews/project-2.jpg", label: "Project 2", section: "Installs Gallery" },
    { src: "/assets/reviews/project-3.jpg", label: "Project 3", section: "Installs Gallery" },
    { src: "/assets/reviews/project-4.jpg", label: "Project 4", section: "Installs Gallery" },
    { src: "/assets/reviews/project-5.jpg", label: "Project 5", section: "Installs Gallery" },
    { src: "/assets/reviews/project-6.jpg", label: "Project 6", section: "Installs Gallery" },
  ],
  "Gallery Page": [
    { src: "/assets/reviews/project-1.jpg", label: "Project 1", section: "Gallery Mosaic" },
    { src: "/assets/reviews/project-2.jpg", label: "Project 2", section: "Gallery Mosaic" },
    { src: "/assets/reviews/project-3.jpg", label: "Project 3", section: "Gallery Mosaic" },
    { src: "/assets/reviews/project-4.jpg", label: "Project 4", section: "Gallery Mosaic" },
    { src: "/assets/reviews/project-5.jpg", label: "Project 5", section: "Gallery Mosaic" },
    { src: "/assets/reviews/project-6.jpg", label: "Project 6", section: "Gallery Mosaic" },
  ],
};

const gallerySections = ["Testimonials Gallery", "Installs Gallery", "Gallery Mosaic"];
const pages = Object.keys(pageImages);

export default function GalleryAdminPage() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("Home");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const replaceRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string>("");
  const addSectionRef = useRef<string>("");
  const [addCategory, setAddCategory] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ── Drag-and-drop state ── */
  const [dragMode, setDragMode] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragSaving, setDragSaving] = useState(false);
  // Touch drag state
  const touchStartRef = useRef<{ idx: number; startY: number; startX: number } | null>(null);
  const touchCloneRef = useRef<HTMLDivElement | null>(null);
  const dragItemRects = useRef<DOMRect[]>([]);
  const dragContainerRef = useRef<HTMLDivElement | null>(null);

  const load = () => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => setUploadedImages(d.images || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  /* ── Replace a static image ── */
  const handleReplace = (src: string) => {
    replaceTargetRef.current = src;
    setReplacing(src);
    setTimeout(() => replaceRef.current?.click(), 50);
  };

  const doReplace = useCallback(async () => {
    const file = replaceRef.current?.files?.[0];
    if (!file) { setReplacing(null); return; }
    setReplacing("uploading");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("targetPath", replaceTargetRef.current);

    try {
      const res = await fetch("/api/admin/images/replace", { method: "POST", body: fd });
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
        alert("Image replaced successfully!");
      } else {
        alert("Replace failed: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Replace failed");
    } finally {
      setReplacing(null);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }, [router]);

  /* ── Add image to gallery/testimonials ── */
  const handleAdd = (section: string) => {
    addSectionRef.current = section;
    setAddCategory("pick");
  };

  const doAddWithCategory = (cat: string) => {
    setAddCategory(cat);
    setTimeout(() => addRef.current?.click(), 50);
  };

  const doAdd = useCallback(async () => {
    const file = addRef.current?.files?.[0];
    if (!file || !addCategory || addCategory === "pick") { setAddCategory(null); return; }
    setReplacing("uploading");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", file.name.replace(/\.[^.]+$/, ""));
    fd.append("category", addCategory);

    try {
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (data.success) {
        setUploadedImages(prev => [...prev, data.image]);
      }
    } catch {
      alert("Upload failed");
    } finally {
      setReplacing(null);
      setAddCategory(null);
      if (addRef.current) addRef.current.value = "";
    }
  }, [router, addCategory]);

  /* ── Remove uploaded image ── */
  const removeImage = async (id: number) => {
    if (!confirm("Remove this image?")) return;
    try {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) { router.push("/admin"); return; }
      setUploadedImages(prev => prev.filter(i => i.id !== id));
    } catch {
      alert("Remove failed");
    }
  };

  /* ── Toggle selection ── */
  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ── Bulk remove ── */
  const removeSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Remove ${selected.size} image${selected.size > 1 ? "s" : ""}?`)) return;
    setReplacing("uploading");
    try {
      for (const id of selected) {
        await fetch("/api/admin/images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      }
      setUploadedImages(prev => prev.filter(i => !selected.has(i.id)));
      setSelected(new Set());
      setSelectMode(false);
    } catch {
      alert("Some removals failed");
    } finally {
      setReplacing(null);
    }
  };

  /* ── Drag-and-drop handlers (HTML5 + touch) ── */
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (!dragMode) return;
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      setTimeout(() => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(idx);
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    const fromIdx = dragIndex;
    setDragIndex(null);
    setDragOverIndex(null);
    if (fromIdx === null || fromIdx === dropIdx) return;

    // Reorder the uploaded images
    const reordered = [...uploadedImages];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    setUploadedImages(reordered);
    saveOrder(reordered);
  };

  /* ── Touch drag handlers ── */
  const handleTouchStart = (e: React.TouchEvent, idx: number) => {
    if (!dragMode) return;
    const touch = e.touches[0];
    touchStartRef.current = { idx, startY: touch.clientY, startX: touch.clientX };

    // Store rects of all items for hit-testing
    const container = dragContainerRef.current;
    if (container) {
      const items = container.querySelectorAll("[data-drag-item]");
      dragItemRects.current = Array.from(items).map(el => el.getBoundingClientRect());
    }

    // Create visual clone
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clone = document.createElement("div");
    clone.style.cssText = `
      position:fixed; z-index:99999; pointer-events:none;
      width:${rect.width}px; height:${rect.height}px;
      left:${rect.left}px; top:${rect.top}px;
      opacity:0.85; transform:scale(1.05);
      border-radius:12px; overflow:hidden;
      box-shadow:0 12px 40px rgba(75,40,109,.35);
      transition: transform 0.1s;
    `;
    clone.innerHTML = target.innerHTML;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;

    setDragIndex(idx);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !touchCloneRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const clone = touchCloneRef.current;
    const startRect = dragItemRects.current[touchStartRef.current.idx];
    if (!startRect) return;

    const dx = touch.clientX - touchStartRef.current.startX;
    const dy = touch.clientY - touchStartRef.current.startY;
    clone.style.left = `${startRect.left + dx}px`;
    clone.style.top = `${startRect.top + dy}px`;

    // Find which item we're over
    const centerY = touch.clientY;
    let overIdx: number | null = null;
    for (let i = 0; i < dragItemRects.current.length; i++) {
      const r = dragItemRects.current[i];
      if (centerY >= r.top && centerY <= r.bottom) {
        overIdx = i;
        break;
      }
    }
    setDragOverIndex(overIdx);
  };

  const handleTouchEnd = () => {
    // Clean up clone
    if (touchCloneRef.current) {
      document.body.removeChild(touchCloneRef.current);
      touchCloneRef.current = null;
    }

    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...uploadedImages];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);
      setUploadedImages(reordered);
      saveOrder(reordered);
    }

    touchStartRef.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
  };

  /* ── Save order to server ── */
  const saveOrder = async (images: UploadedImage[]) => {
    setDragSaving(true);
    try {
      await fetch("/api/admin/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: images.map(i => i.id) }),
      });
    } catch {
      alert("Failed to save order");
    } finally {
      setDragSaving(false);
    }
  };

  if (loading) return <AdminShell><p style={{ color: "rgba(0,0,0,.4)" }}>Loading…</p></AdminShell>;

  /* ── Group active page images by section ── */
  const activeImages = pageImages[activePage] || [];
  const sections: Record<string, { src: string; label: string; section: string; isUploaded?: boolean; uploadId?: number; category?: string }[]> = {};
  activeImages.forEach(img => {
    if (!sections[img.section]) sections[img.section] = [];
    sections[img.section].push(img);
  });

  // Add uploaded images to gallery sections — filtered by category per page
  const isGallerySection = (s: string) => gallerySections.includes(s);
  const pageCategoryMap: Record<string, string[]> = {
    "Home": ["windows", "doors", "garage"],
    "Windows": ["windows"],
    "Doors": ["doors"],
    "Garage": ["garage"],
    "Gallery Page": ["windows", "doors", "garage"],
  };
  const allowedCats = pageCategoryMap[activePage] || ["windows", "doors", "garage"];
  Object.keys(sections).forEach(section => {
    if (isGallerySection(section)) {
      uploadedImages
        .filter(uimg => allowedCats.includes(uimg.category))
        .forEach(uimg => {
          sections[section].push({
            src: uimg.src,
            label: uimg.alt || "Uploaded",
            section,
            isUploaded: true,
            uploadId: uimg.id,
            category: uimg.category,
          });
        });
    }
  });

  // Check if current page has any gallery sections
  const hasGallerySections = Object.keys(sections).some(s => isGallerySection(s));

  return (
    <AdminShell>
      {/* Hidden file inputs */}
      <input ref={replaceRef} type="file" accept="image/*" onChange={doReplace} style={{ display: "none" }} />
      <input ref={addRef} type="file" accept="image/*" onChange={doAdd} style={{ display: "none" }} />

      {/* ── Page Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => { setActivePage(page); setDragMode(false); setSelectMode(false); }}
            className={`admin-btn ${activePage === page ? "admin-btn-primary" : "admin-btn-ghost"}`}
            style={{ padding: "8px 20px", fontSize: ".82rem", borderRadius: 980 }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* ── Page Images by Section ── */}
      {Object.entries(sections).map(([section, imgs]) => {
        const isGallery = isGallerySection(section);
        return (
          <div key={section} className="admin-card" style={{ marginBottom: 24 }}>
            <div className="admin-card-header">
              <h3>{section}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "rgba(0,0,0,.35)", fontSize: ".78rem" }}>
                  {imgs.length} images
                </span>
                {isGallery && hasGallerySections && (
                  <>
                    <button
                      onClick={() => {
                        setDragMode(!dragMode);
                        setSelectMode(false);
                        setSelected(new Set());
                      }}
                      className={`admin-btn ${dragMode ? "admin-btn-primary" : "admin-btn-ghost"}`}
                      style={{
                        padding: "6px 18px", fontSize: ".78rem", borderRadius: 980, fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
                        <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
                        <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
                      </svg>
                      {dragMode ? "Done" : "Reorder"}
                    </button>
                    <button
                      onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); setDragMode(false); }}
                      className={`admin-btn ${selectMode ? "admin-btn-primary" : "admin-btn-ghost"}`}
                      style={{ padding: "6px 18px", fontSize: ".78rem", borderRadius: 980, fontWeight: 600 }}
                    >
                      {selectMode ? "✕ Cancel" : "☐ Select"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="admin-card-body" style={{ padding: 16 }}>
              {/* ── Drag mode: show only uploaded images for reordering ── */}
              {dragMode && isGallery ? (
                <div>
                  {dragSaving && (
                    <div style={{
                      padding: "8px 16px", marginBottom: 12, borderRadius: 8,
                      background: "rgba(75,40,109,.06)", color: "var(--accent)",
                      fontSize: ".82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <div style={{
                        width: 14, height: 14, border: "2px solid rgba(75,40,109,.15)",
                        borderTopColor: "var(--accent)", borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }} />
                      Saving order…
                    </div>
                  )}
                  <p style={{ fontSize: ".78rem", color: "rgba(0,0,0,.4)", marginBottom: 16, fontWeight: 500 }}>
                    Drag images to reorder. Changes save automatically.
                  </p>
                  <div
                    ref={dragContainerRef}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {uploadedImages
                      .filter(uimg => allowedCats.includes(uimg.category))
                      .map((uimg, idx) => (
                      <div
                        key={uimg.id}
                        data-drag-item
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onTouchStart={(e) => handleTouchStart(e, idx)}
                        onTouchMove={(e) => handleTouchMove(e)}
                        onTouchEnd={() => handleTouchEnd()}
                        style={{
                          position: "relative",
                          borderRadius: 12,
                          overflow: "hidden",
                          cursor: "grab",
                          border: dragOverIndex === idx
                            ? "2px solid var(--accent)"
                            : dragIndex === idx
                              ? "2px solid rgba(75,40,109,.3)"
                              : "2px solid transparent",
                          transition: "all .15s ease",
                          background: "#f8f8f8",
                          transform: dragOverIndex === idx ? "scale(1.03)" : "scale(1)",
                          boxShadow: dragOverIndex === idx ? "0 4px 20px rgba(75,40,109,.2)" : "none",
                          opacity: dragIndex === idx ? 0.5 : 1,
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          touchAction: "none",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uimg.src}
                          alt={uimg.alt}
                          style={{
                            width: "100%", height: 130, objectFit: "cover",
                            display: "block", pointerEvents: "none",
                          }}
                          loading="lazy"
                          draggable={false}
                        />
                        {/* Drag handle + order number */}
                        <div style={{
                          position: "absolute", top: 0, left: 0, right: 0,
                          padding: "6px 10px",
                          background: "linear-gradient(to bottom, rgba(0,0,0,.5), transparent)",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          pointerEvents: "none",
                        }}>
                          <span style={{
                            color: "#fff", fontSize: ".7rem", fontWeight: 700,
                            background: "var(--accent)", padding: "2px 8px",
                            borderRadius: 980, minWidth: 20, textAlign: "center",
                          }}>{idx + 1}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="4" y1="8" x2="20" y2="8" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="16" x2="20" y2="16" />
                          </svg>
                        </div>
                        {/* Category badge */}
                        <span style={{
                          position: "absolute", bottom: 6, right: 6,
                          background: uimg.category === "doors" ? "rgba(139,92,246,.85)" : uimg.category === "garage" ? "rgba(245,158,11,.85)" : "rgba(59,130,246,.85)",
                          color: "#fff", fontSize: ".6rem", fontWeight: 700,
                          padding: "2px 8px", borderRadius: 980,
                          textTransform: "uppercase", letterSpacing: ".04em",
                        }}>{uimg.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Normal view ── */
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isGallery
                    ? "repeat(auto-fill, minmax(150px, 1fr))"
                    : "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 16,
                }}>
                  {imgs.map((img, idx) => (
                    <div
                      key={`${img.src}-${idx}`}
                      onClick={() => {
                        if (selectMode && img.isUploaded && img.uploadId) {
                          toggleSelect(img.uploadId);
                        } else if (!selectMode) {
                          handleReplace(img.src);
                        }
                      }}
                      style={{
                        position: "relative",
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: selectMode && img.isUploaded && img.uploadId && selected.has(img.uploadId)
                          ? "2px solid var(--accent)"
                          : "2px solid transparent",
                        transition: "all .2s ease",
                        background: "#f8f8f8",
                        boxShadow: selectMode && img.isUploaded && img.uploadId && selected.has(img.uploadId)
                          ? "0 4px 20px rgba(75,40,109,.2)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(75,40,109,.15)";
                        const ov = e.currentTarget.querySelector(".img-overlay") as HTMLElement;
                        if (ov) ov.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        const ov = e.currentTarget.querySelector(".img-overlay") as HTMLElement;
                        if (ov) ov.style.opacity = "0";
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${img.src}?t=${refreshKey}`}
                        alt={img.label}
                        style={{
                          width: "100%",
                          height: isGallery ? 130 : 180,
                          objectFit: isGallery ? "cover" : "contain",
                          display: "block",
                          background: "#f8f8f8",
                          opacity: selectMode && img.isUploaded && img.uploadId && selected.has(img.uploadId) ? .7 : 1,
                        }}
                        loading="lazy"
                      />
                      {/* Overlay */}
                      <div className="img-overlay" style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "12px 14px",
                        opacity: 0,
                        transition: "opacity .2s",
                        pointerEvents: "none",
                      }}>
                        <span style={{ color: "#fff", fontSize: ".78rem", fontWeight: 600, lineHeight: 1.3 }}>{img.label}</span>
                        <span style={{ color: "rgba(255,255,255,.6)", fontSize: ".68rem", marginTop: 2 }}>Click to replace</span>
                      </div>
                      {/* Remove button for uploaded images (non-select mode) */}
                      {img.isUploaded && img.uploadId && !selectMode && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(img.uploadId!); }}
                          style={{
                            position: "absolute", top: 6, right: 6,
                            width: 24, height: 24, borderRadius: "50%",
                            background: "rgba(220,38,38,.9)", border: "none",
                            color: "#fff", fontSize: ".75rem", fontWeight: 700,
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            zIndex: 2, lineHeight: 1,
                          }}
                          title="Remove image"
                        >✕</button>
                      )}
                      {/* Category badge for uploaded images */}
                      {img.isUploaded && img.category && !selectMode && (
                        <span style={{
                          position: "absolute", bottom: 6, right: 6,
                          background: img.category === "doors" ? "rgba(139,92,246,.85)" : img.category === "garage" ? "rgba(245,158,11,.85)" : "rgba(59,130,246,.85)",
                          color: "#fff", fontSize: ".6rem", fontWeight: 700,
                          padding: "2px 8px", borderRadius: 980,
                          textTransform: "uppercase", letterSpacing: ".04em",
                          zIndex: 2,
                        }}>{img.category}</span>
                      )}
                      {/* Selection checkmark */}
                      {selectMode && img.isUploaded && img.uploadId && (
                        <div style={{
                          position: "absolute", top: 6, left: 6,
                          width: 24, height: 24, borderRadius: "50%",
                          background: selected.has(img.uploadId) ? "var(--accent)" : "rgba(255,255,255,.8)",
                          border: selected.has(img.uploadId) ? "2px solid var(--accent)" : "2px solid rgba(0,0,0,.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          zIndex: 2, transition: "all .15s ease",
                        }}>
                          {selected.has(img.uploadId) && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      )}
                      {/* Replacing indicator */}
                      {replacing === img.src && (
                        <div style={{
                          position: "absolute", inset: 0, background: "rgba(75,40,109,.85)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: ".82rem", fontWeight: 600,
                        }}>
                          Select file…
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Image card — only for gallery sections */}
                  {isGallery && (
                    <div
                      onClick={() => handleAdd(section)}
                      style={{
                        borderRadius: 12,
                        border: "2px dashed rgba(75,40,109,.2)",
                        background: "rgba(75,40,109,.03)",
                        height: 130,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all .2s ease",
                        gap: 6,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(75,40,109,.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(75,40,109,.2)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(75,40,109,.03)";
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .5 }}>
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span style={{ fontSize: ".75rem", color: "var(--accent)", fontWeight: 600, opacity: .7 }}>Add Image</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Uploading overlay */}
      {replacing === "uploading" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "40px 48px", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          }}>
            <div style={{
              width: 40, height: 40, border: "3px solid rgba(75,40,109,.15)",
              borderTopColor: "var(--accent)", borderRadius: "50%",
              animation: "spin 1s linear infinite", margin: "0 auto 16px",
            }} />
            <p style={{ fontWeight: 600, color: "var(--accent)", fontSize: "1rem" }}>Processing…</p>
            <p style={{ color: "rgba(0,0,0,.4)", fontSize: ".85rem" }}>This may take a moment</p>
          </div>
        </div>
      )}

      {/* Floating action bar for bulk selection */}
      {selectMode && selected.size > 0 && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "var(--accent)", color: "#fff", borderRadius: 980,
          padding: "12px 28px", display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 8px 32px rgba(75,40,109,.4)", zIndex: 9998,
          fontSize: ".88rem", fontWeight: 600,
        }}>
          <span>{selected.size} selected</span>
          <button
            onClick={removeSelected}
            style={{
              background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.3)",
              color: "#fff", padding: "6px 18px", borderRadius: 980,
              cursor: "pointer", fontSize: ".82rem", fontWeight: 600,
            }}
          >
            Remove Selected
          </button>
        </div>
      )}

      {/* Category picker modal */}
      {addCategory === "pick" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setAddCategory(null)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "32px 36px", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,.2)", maxWidth: 340, width: "90%",
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>Select Category</h3>
            <p style={{ fontSize: ".82rem", color: "rgba(0,0,0,.4)", marginBottom: 24 }}>Choose where this image belongs</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { value: "windows", label: "🪟 Windows", color: "#3b82f6" },
                { value: "doors", label: "🚪 Doors", color: "#8b5cf6" },
                { value: "garage", label: "🏠 Garage", color: "#f59e0b" },
              ].map(cat => (
                <button
                  key={cat.value}
                  onClick={() => doAddWithCategory(cat.value)}
                  style={{
                    padding: "14px 20px", borderRadius: 12,
                    border: "1px solid rgba(0,0,0,.08)", background: "#fafafa",
                    cursor: "pointer", fontSize: ".9rem", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 10,
                    transition: "all .15s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(75,40,109,.06)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,.08)"; }}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setAddCategory(null)}
              style={{ marginTop: 16, padding: "8px 20px", borderRadius: 980, border: "none", background: "transparent", color: "rgba(0,0,0,.4)", cursor: "pointer", fontSize: ".82rem" }}
            >Cancel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </AdminShell>
  );
}
