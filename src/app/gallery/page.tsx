"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const galImages = [
  { src: "/assets/reviews/project-1.jpg", cat: "windows", alt: "Window installation — Oakville", size: "xl" },
  { src: "/assets/doors/entry-door.jpg", cat: "doors", alt: "Entry door — Vaughan", size: "lg" },
  { src: "/assets/reviews/project-2.jpg", cat: "windows", alt: "Casement windows — Mississauga", size: "lg" },
  { src: "/assets/doors/patio-door.jpg", cat: "doors", alt: "Patio door — Burlington", size: "xl" },
  { src: "/assets/reviews/project-3.jpg", cat: "garage", alt: "Garage door — Richmond Hill", size: "xl" },
  { src: "/assets/reviews/project-4.jpg", cat: "windows", alt: "Bay window — Markham", size: "lg" },
  { src: "/assets/doors/double-door.jpg", cat: "doors", alt: "Double entry — Toronto", size: "lg" },
  { src: "/assets/reviews/project-5.jpg", cat: "windows", alt: "Picture windows — Brampton", size: "xl" },
  { src: "/assets/reviews/project-6.jpg", cat: "garage", alt: "Modern garage — Newmarket", size: "xl" },
  { src: "/assets/doors/sidelights.jpg", cat: "doors", alt: "Sidelights — Etobicoke", size: "lg" },
  { src: "/assets/reviews/project-1.jpg", cat: "windows", alt: "Full home — Concord", size: "lg" },
  { src: "/assets/reviews/project-4.jpg", cat: "garage", alt: "Townhouse project", size: "xl" },
  { src: "/assets/reviews/project-2.jpg", cat: "doors", alt: "Victorian windows", size: "xl" },
  { src: "/assets/reviews/project-6.jpg", cat: "windows", alt: "Garage install", size: "lg" },
];

const filters = ["all", "windows", "doors", "garage"] as const;
const filterLabels: Record<string, string> = { all: "All Projects", windows: "Windows", doors: "Doors", garage: "Garage Doors" };
const sizes = ["xl", "lg", "lg", "xl", "xl", "lg", "lg", "xl", "xl", "lg", "lg", "xl", "xl", "lg"];

export default function GalleryPage() {
  useScrollReveal();
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = activeCat === "all" ? galImages : galImages.filter(i => i.cat === activeCat);

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
