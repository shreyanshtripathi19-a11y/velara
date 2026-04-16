"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface GalleryImage { id: number; src: string; alt: string; category: string }

const fallbackImages: GalleryImage[] = [
  { id: 1, src: "/assets/reviews/project-1.jpg", alt: "Window installation — Oakville", category: "windows" },
  { id: 2, src: "/assets/doors/entry-door.jpg", alt: "Entry door — Vaughan", category: "doors" },
  { id: 3, src: "/assets/reviews/project-2.jpg", alt: "Casement windows — Mississauga", category: "windows" },
  { id: 4, src: "/assets/doors/patio-door.jpg", alt: "Patio door — Burlington", category: "doors" },
  { id: 5, src: "/assets/reviews/project-3.jpg", alt: "Garage door — Richmond Hill", category: "garage" },
  { id: 6, src: "/assets/reviews/project-4.jpg", alt: "Bay window — Markham", category: "windows" },
  { id: 7, src: "/assets/doors/double-door.jpg", alt: "Double entry — Toronto", category: "doors" },
  { id: 8, src: "/assets/reviews/project-5.jpg", alt: "Picture windows — Brampton", category: "windows" },
  { id: 9, src: "/assets/reviews/project-6.jpg", alt: "Modern garage — Newmarket", category: "garage" },
  { id: 10, src: "/assets/doors/sidelights.jpg", alt: "Sidelights — Etobicoke", category: "doors" },
];

const filters = ["all", "windows", "doors", "garage"] as const;
const filterLabels: Record<string, string> = { all: "All Projects", windows: "Windows", doors: "Doors", garage: "Garage Doors" };
const sizes = ["xl", "lg", "lg", "xl", "xl", "lg", "lg", "xl", "xl", "lg", "lg", "xl", "xl", "lg"];

/* Column stagger offsets (px) — cycles for visual variety */
const staggerOffsets = [40, 0, 70, 20, 90, 10, 55];

export default function GalleryPage() {
  useScrollReveal();
  const [activeCat, setActiveCat] = useState<string>("all");
  const [galImages, setGalImages] = useState<GalleryImage[]>(fallbackImages);

  useEffect(() => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => { if (d.images?.length > 0) setGalImages(d.images); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => activeCat === "all" ? galImages : galImages.filter(i => i.category === activeCat),
    [activeCat, galImages],
  );

  /* ── Build columns dynamically: every image gets a slot, order preserved ── */
  const CARDS_PER_COL = 2;
  const columns = useMemo(() => {
    if (filtered.length === 0) return [];
    // At minimum 7 columns (looks good visually); otherwise enough to fit every image
    const neededCols = Math.max(7, Math.ceil(filtered.length / CARDS_PER_COL));
    const cols: { src: string; alt: string; size: string }[][] = [];
    for (let c = 0; c < neededCols; c++) {
      const col: { src: string; alt: string; size: string }[] = [];
      for (let r = 0; r < CARDS_PER_COL; r++) {
        const imgIdx = c * CARDS_PER_COL + r;
        if (imgIdx >= filtered.length) break; // don't repeat — show only real images
        const img = filtered[imgIdx];
        const sz = sizes[(c * CARDS_PER_COL + r) % sizes.length];
        col.push({ src: img.src, alt: img.alt, size: sz });
      }
      if (col.length > 0) cols.push(col);
    }
    return cols;
  }, [filtered]);

  /* Scale scroll speed so it doesn't fly when there are many columns */
  const scrollDuration = useMemo(() => {
    const baseDuration = 60; // seconds for 7 cols
    return Math.max(baseDuration, columns.length * (baseDuration / 7));
  }, [columns.length]);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="gal-hero">
        <div className="gal-hero-badge sr">Portfolio</div>
        <h1 className="sr d1">
          Our finest<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>work.</em>
        </h1>
        <p className="sr d2">Every window. Every door. Installed with precision<br className="hide-mobile" /> and pride across Ontario homes.</p>
      </section>

      {/* ── Filter Tabs ── */}
      <div className="gal-filters">
        {filters.map(f => (
          <span
            key={f}
            className={`gal-filter${activeCat === f ? " active" : ""}`}
            onClick={() => setActiveCat(f)}
          >
            {filterLabels[f]}
          </span>
        ))}
      </div>

      {/* ── Mosaic ── */}
      <div className="gal-mosaic" id="gal-mosaic">
        <div className="gal-fade-l" />
        <div className="gal-fade-r" />
        <div
          className="gal-mosaic-drift"
          key={activeCat}
          style={{ animationDuration: `${scrollDuration}s` }}
        >
          {/* Original columns — shows every image */}
          {columns.map((col, ci) => (
            <div
              className="gal-mosaic-col"
              key={`a-${ci}`}
              style={{ paddingTop: staggerOffsets[ci % staggerOffsets.length] }}
            >
              {col.map((card, ri) => (
                <div className={`gal-m-card gal-m-${card.size}`} key={ri}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.src} alt={card.alt} loading="lazy" />
                </div>
              ))}
            </div>
          ))}
          {/* Duplicate for seamless infinite loop */}
          {columns.map((col, ci) => (
            <div
              className="gal-mosaic-col"
              key={`b-${ci}`}
              style={{ paddingTop: staggerOffsets[ci % staggerOffsets.length] }}
            >
              {col.map((card, ri) => (
                <div className={`gal-m-card gal-m-${card.size}`} key={ri}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.src} alt={card.alt} loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="gal-cta">
        <h2>Your home could<br />be next.</h2>
        <p>See what Velara can do for your space.</p>
        <Link href="/contact" className="hm-cta-primary" style={{ display: "inline-block" }}>Get a free estimate ›</Link>
      </section>
    </div>
  );
}
