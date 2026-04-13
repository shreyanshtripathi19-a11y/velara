"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface GalleryImage { id: number; src: string; alt: string; category: string }

const fallbackImages = [
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

  const filtered = activeCat === "all" ? galImages : galImages.filter(i => i.category === activeCat);

  /* Build 7 columns × 2 cards, duplicated for seamless loop */
  const columns: { src: string; alt: string; size: string }[][] = [];
  for (let c = 0; c < 7; c++) {
    const col: { src: string; alt: string; size: string }[] = [];
    for (let r = 0; r < 2; r++) {
      if (filtered.length === 0) break;
      const img = filtered[(c * 2 + r) % filtered.length];
      const sz = sizes[(c * 2 + r) % sizes.length];
      col.push({ src: img.src, alt: img.alt, size: sz });
    }
    columns.push(col);
  }

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
        <div className="gal-mosaic-drift" key={activeCat}>
          {/* Original columns */}
          {columns.map((col, ci) => (
            <div className="gal-mosaic-col" key={`a-${ci}`}>
              {col.map((card, ri) => (
                <div className={`gal-m-card gal-m-${card.size}`} key={ri}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.src} alt={card.alt} loading="lazy" />
                </div>
              ))}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {columns.map((col, ci) => (
            <div className="gal-mosaic-col" key={`b-${ci}`}>
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
