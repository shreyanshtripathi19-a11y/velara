"use client";
import Link from "next/link";
import { useRef, useCallback, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuoteModal } from "@/context/QuoteModalContext";

const materials = [
  { tag: "Most Popular", tagBg: "rgba(75,40,109,.1)", tagColor: "var(--accent)", title: "Steel", img: "/assets/doors/steel.png", desc: "Maximum security and durability. Polyurethane foam core for superior insulation. Dent-resistant and low maintenance.", s1: "R-16", l1: "Insulation", s2: "20ga", l2: "Steel Skin" },
  { tag: "Low Maintenance", tagBg: "rgba(0,0,0,.06)", tagColor: "rgba(0,0,0,.5)", title: "Fibreglass", img: "/assets/doors/fibreglass.png", desc: "Authentic woodgrain texture without the upkeep. Won't warp, crack, or rot. Holds paint and stain beautifully for years.", s1: "R-16", l1: "Insulation", s2: "UV", l2: "Resistant" },
  { tag: "Premium", tagBg: "rgba(0,0,0,.06)", tagColor: "rgba(0,0,0,.5)", title: "Solid Wood", img: "/assets/doors/wood.png", desc: "Timeless craftsmanship in mahogany, oak, or knotty alder. The warmth and character only real wood delivers.", s1: "Custom", l1: "Stains", s2: "Solid", l2: "Core" },
];

const collection = [
  { label: "Classic", title: "Single Door", sub: "Premium single entry in steel, fibreglass, or wood. The foundation of your home's first impression.", img: "/assets/doors/entry-door.jpg" },
  { label: "Grand", title: "Double Doors", sub: "Wider entryways deserve grandeur. With or without sidelights and transoms.", img: "/assets/doors/double-door.jpg" },
  { label: "Seamless", title: "Patio Doors", sub: "Sliding or hinged with floor-to-ceiling glass. Bring the outdoors in.", img: "/assets/doors/patio-door.jpg" },
  { label: "Elegant", title: "With Sidelights", sub: "Glass panels flanking your entry flood the foyer with light and elegance.", img: "/assets/doors/sidelights.jpg" },
  { label: "Bespoke", title: "Custom Glass", sub: "One-of-a-kind glass inserts with custom ironwork — your vision, executed.", img: "/assets/doors/Custom Glass 2.png" },
];

const galleryImages = [
  "/assets/reviews/project-5.jpg","/assets/reviews/project-2.jpg","/assets/reviews/project-3.jpg",
  "/assets/reviews/project-1.jpg","/assets/reviews/project-6.jpg","/assets/reviews/project-4.jpg",
];

export default function DoorsPage() {
  useScrollReveal();
  const { open: openQuote } = useQuoteModal();
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  const scrollTrack = useCallback((dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const parent = track.parentElement;
    if (!parent) return;
    const maxScroll = track.scrollWidth - parent.clientWidth;
    const next = Math.min(Math.max(offsetRef.current + dir * 340, 0), maxScroll);
    offsetRef.current = next;
    track.style.transform = `translateX(-${next}px)`;
  }, []);

  /* Touch-swipe + horizontal trackpad support */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const parent = track.parentElement;
    if (!parent) return;

    const applyOffset = (v: number, smooth: boolean) => {
      const max = track.scrollWidth - parent.clientWidth;
      const clamped = Math.min(Math.max(v, 0), max);
      offsetRef.current = clamped;
      if (smooth) {
        track.style.transition = "transform .45s cubic-bezier(.25,.46,.45,.94)";
      } else {
        track.style.transition = "none";
      }
      track.style.transform = `translateX(-${clamped}px)`;
    };

    /* ── Touch drag ── */
    let startX = 0;
    let startOffset = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startOffset = offsetRef.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = startX - e.touches[0].clientX;
      applyOffset(startOffset + dx, false);
    };
    const onTouchEnd = () => {
      track.style.transition = "transform .45s cubic-bezier(.25,.46,.45,.94)";
    };

    /* ── Horizontal trackpad / mouse-wheel ── */
    const onWheel = (e: WheelEvent) => {
      // Only handle horizontal-dominant gestures (trackpad swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
        // Always prevent default to stop macOS back/forward swipe navigation
        e.preventDefault();
        e.stopPropagation();
        applyOffset(offsetRef.current + e.deltaX, false);
      }
      // Vertical scroll passes through to the page naturally
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    parent.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      parent.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hm-hero" style={{ minHeight: "auto", paddingBottom: 0 }}>
        <div className="hm-hero-text" style={{ padding: "12px 24px 0", marginBottom: 0 }}>
          <div className="hm-hero-badge sr">Premium Entry Doors</div>
          <h1 className="sr d1" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(3rem,9vw,7rem)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: .9, color: "var(--accent)", marginBottom: 20 }}>
            Make an<br />entrance.
          </h1>
          <p className="sr d2" style={{ fontSize: "1.2rem", color: "rgba(0,0,0,.6)", maxWidth: 560, margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            Steel, fibreglass, or wood — every Velara door is custom built in Ontario to your exact specifications.
          </p>
        </div>
        <div className="rv-hero-vid" style={{ position: "relative", marginTop: 16, background: "var(--white)", overflow: "hidden" }}>
          <video autoPlay muted playsInline loop style={{ display: "block", width: "100%", height: "85vh", objectFit: "contain", background: "var(--white)", transform: "translateX(-3%)" }}>
            <source src="/assets/doors-hero.mp4" type="video/mp4" />
          </video>
          {/* Blend gradients — top, bottom, left, right */}
          <div className="rv-blend-tb" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to bottom,#FFFFFF 0%,transparent 100%)" }} />
          <div className="rv-blend-tb" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to top,#FFFFFF 0%,transparent 100%)" }} />
          <div className="rv-blend-side" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 60, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to right,#FFFFFF 0%,transparent 100%)" }} />
          <div className="rv-blend-side" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 60, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to left,#FFFFFF 0%,transparent 100%)" }} />
        </div>
        <div className="sr d3" style={{ textAlign: "center", padding: "16px 24px 40px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <a className="hm-cta-ghost" onClick={() => document.getElementById("door-styles")?.scrollIntoView({ behavior: "smooth" })} style={{ cursor: "pointer" }}>Explore styles ›</a>
        </div>
      </section>

      {/* ── Materials ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="ch-label sr">Choose Your Material</p>
          <h2 className="ch-h sr d1" style={{ color: "var(--ink)" }}>Three materials. <em style={{ color: "var(--accent)" }}>One standard.</em></h2>
          <p className="sr d2" style={{ fontSize: "1.05rem", color: "rgba(0,0,0,.55)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>Each built to the same uncompromising specification — only the character changes.</p>
        </div>
        <div className="door-pillars" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {materials.map((d, i) => (
            <div key={d.title} className={`sr d${i + 1} door-mat-card`}>
              <div className="rv-card-img" style={{ height: 360, background: "var(--white)", borderRadius: "var(--radius-md)", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src={d.img} alt={d.title} style={{ height: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: ".75rem", padding: "5px 12px", borderRadius: 20, background: d.tagBg, color: d.tagColor, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>{d.tag}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-d)", fontSize: "1.7rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{d.title}</h3>
              <p style={{ fontSize: "1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.7, fontWeight: 300, marginBottom: 20 }}>{d.desc}</p>
              <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
                <div style={{ textAlign: "center" }}><span style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>{d.s1}</span><span style={{ fontSize: ".75rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>{d.l1}</span></div>
                <div style={{ width: 1, background: "var(--rule)" }} />
                <div style={{ textAlign: "center" }}><span style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>{d.s2}</span><span style={{ fontSize: ".75rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>{d.l2}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Custom Glass ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr door-glass-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "clamp(32px,4vw,56px)", alignItems: "center" }}>
            <div>
              <p className="ch-label">Custom Glass</p>
              <h2 className="ch-h" style={{ color: "var(--ink)", marginBottom: 16 }}>Your vision,<br /><em style={{ color: "var(--accent)" }}>in every pane.</em></h2>
              <p style={{ fontSize: "1.1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: 36, maxWidth: 460 }}>Decorative, frosted, textured, and custom ironwork glass inserts. Choose from over 100 designs or bring your own — we&apos;ll make it real.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 340 }}>
                <div style={{ padding: "24px 20px", background: "rgba(75,40,109,.04)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-d)", fontSize: "2.2rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>100+</span>
                  <span style={{ fontSize: ".82rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Glass Designs</span>
                </div>
                <div style={{ padding: "24px 20px", background: "rgba(75,40,109,.04)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-d)", fontSize: "2.2rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>Custom</span>
                  <span style={{ fontSize: ".82rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Ironwork</span>
                </div>
              </div>
            </div>
            <div className="rv-glass-vid" style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
              <video src="/assets/videos/custom-glass.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.1)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Security + Efficiency ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="door-twin-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Security */}
          <div className="sr" style={{ padding: "clamp(32px,4vw,48px)", border: "1px solid var(--rule)", borderRadius: "var(--radius-lg)" }}>
            <p className="ch-label">Security</p>
            <h3 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(1.6rem,2.5vw,2.1rem)", fontWeight: 700, color: "var(--ink)", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-.02em" }}>Locked down.<br /><em style={{ color: "var(--accent)" }}>Not locked in.</em></h3>
            <p style={{ fontSize: "1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: 28 }}>Commercial-grade multi-point locking systems come standard on every entry door.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, title: "Multi-point locking", desc: "3+ latch points on every entry door" },
                { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "Reinforced strike plates", desc: "Heavy-gauge steel at every lock point" },
                { icon: <><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2m-9-11h2m18 0h2m-4.2-6.8-1.4 1.4M6.6 17.4l-1.4 1.4m0-13.6 1.4 1.4m10.8 10.8 1.4 1.4" /></>, title: "Smart lock ready", desc: "Pre-drilled for all major smart lock brands" },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(75,40,109,.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">{item.icon}</svg>
                  </div>
                  <div>
                    <span style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 2 }}>{item.title}</span>
                    <span style={{ fontSize: ".88rem", color: "rgba(0,0,0,.5)", fontWeight: 300 }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Efficiency */}
          <div className="sr d1" style={{ padding: "clamp(32px,4vw,48px)", border: "1px solid var(--rule)", borderRadius: "var(--radius-lg)" }}>
            <p className="ch-label">Efficiency</p>
            <h3 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(1.6rem,2.5vw,2.1rem)", fontWeight: 700, color: "var(--ink)", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-.02em" }}>Keep the cold<br /><em style={{ color: "var(--accent)" }}>where it belongs.</em></h3>
            <p style={{ fontSize: "1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: 28 }}>Polyurethane foam core, magnetic weatherstripping, and triple-seal systems on every door.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Insulation Value", val: "R-16", w: "85%" },
                { label: "Air Infiltration", val: "0.01 CFM", w: "95%" },
                { label: "Seal System", val: "Triple", w: "100%" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>{bar.label}</span>
                    <span style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--accent)" }}>{bar.val}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(0,0,0,.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: bar.w, height: "100%", background: "var(--accent)", borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 4, padding: 16, background: "rgba(75,40,109,.04)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <span style={{ fontSize: ".82rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Energy Star Certified — All Climate Zones</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Door Collection ── */}
      <section id="door-styles" style={{ padding: "clamp(48px,6vw,80px) 0", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ textAlign: "left", marginBottom: 32, padding: "0 max(24px,calc((100vw - 1200px)/2))" }}>
          <p className="ch-label sr">Our Collection</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 16 }}>
            <h2 className="ch-h sr d1" style={{ color: "var(--ink)", textAlign: "left" }}>Every entrance. <em style={{ color: "var(--accent)" }}>Perfectly crafted.</em></h2>
            <Link href="/contact" className="ch-lnk sr d2" style={{ color: "var(--accent)" }}>Request a quote</Link>
          </div>
        </div>
        <div className="endure-scroll">
          <div className="endure-track" ref={trackRef}>
            {collection.map((c, i) => (
              <div key={c.title} className={`endure-card sr d${(i % 3) + 1}`} style={{ flex: "0 0 340px", background: "#fff", cursor: "pointer" }} onClick={() => openQuote(c.title, "Doors")}>
                <div className="endure-card-text">
                  <p className="endure-card-label">{c.label}</p>
                  <h3 className="endure-card-title">{c.title}</h3>
                  <p className="endure-card-sub">{c.sub}</p>
                </div>
                <div className="endure-card-img"><img src={c.img} alt={c.title} /></div>
              </div>
            ))}
          </div>
          <div className="endure-arrows">
            <button className="win-feat-arrow" onClick={() => scrollTrack(-1)} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button className="win-feat-arrow" onClick={() => scrollTrack(1)} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ padding: "clamp(40px,5vw,64px) 24px", background: "rgba(75,40,109,.03)", borderRadius: "var(--radius-lg)", maxWidth: 1200, margin: "0 auto" }}>
        <div className="door-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          {[
            { n: "200+", l: "Configurations" },
            { n: "60+", l: "Colours" },
            { n: "25yr", l: "Warranty" },
            { n: "100%", l: "Canadian Made" },
          ].map((s, i) => (
            <div key={s.l} className={`sr${i > 0 ? ` d${i}` : ""}`}>
              <span className="rv-stat-n" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--accent)", display: "block" }}>{s.n}</span>
              <span style={{ fontSize: ".85rem", color: "rgba(0,0,0,.5)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 36 }}>
          <p className="ch-label sr">Our Process</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>From consultation to <em style={{ color: "var(--accent)", fontStyle: "italic" }}>installation.</em></h2>
          <p className="sr" style={{ fontSize: "1.05rem", color: "rgba(0,0,0,.7)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>A seamless process designed around your schedule — not ours.</p>
        </div>
        <div className="tl-wrap">
          <div className="tl-line" /><div className="tl-line-fill" data-tl="" />
          {[
            { n: 1, h: "Design consultation", p: "Explore materials, styles, glass options, and colours with a dedicated door specialist." },
            { n: 2, h: "Transparent quote", p: "Clear pricing with no hidden fees. Factory-direct means no middleman markups." },
            { n: 3, h: "Precision measurement", p: "We measure at your home. Your door is custom built to the exact millimetre." },
            { n: 4, h: "Expert installation", p: "Professional install on your schedule. Sealed, levelled, tested — with full cleanup." },
          ].map((s) => (
            <div key={s.n} className="tl-step"><div className="tl-dot"><span>{s.n}</span></div><h3>{s.h}</h3><p>{s.p}</p></div>
          ))}
        </div>
      </section>

      {/* ── Work Gallery ── */}
      <section className="pg-gallery">
        <div className="pg-gallery-head sr">
          <p className="ch-label">Our Work</p>
          <h2 className="ch-h">Installs we&apos;re <em style={{ color: "var(--accent)" }}>proud of.</em></h2>
        </div>
        <div className="hm-test-viewport">
          <div className="hm-test-fade-l" /><div className="hm-test-fade-r" />
          <div className="hm-test-drift">
            {[0,1,2,3,4,5,6].map((col) => (
              <div key={col} className="hm-test-col">
                <div className={`hm-test-card hm-test-card-img hm-test-card-${col%2===0?"xl":"lg"}`}><img src={galleryImages[col%galleryImages.length]} alt="Project" loading="lazy" /></div>
                <div className={`hm-test-card hm-test-card-img hm-test-card-${col%2===0?"lg":"xl"}`}><img src={galleryImages[(col+3)%galleryImages.length]} alt="Project" loading="lazy" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA ── */}
      <section className="rv-dark-cta" style={{ background: "var(--ink)", padding: "clamp(48px,6vw,72px) 24px", textAlign: "center", borderRadius: "var(--radius-lg)", maxWidth: 1200, margin: "0 auto clamp(36px,5vw,64px)" }}>
        <h2 className="sr" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: "var(--white)", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 12 }}>Your perfect door <em style={{ color: "var(--accent)" }}>awaits.</em></h2>
        <p className="sr d1" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,.5)", maxWidth: 500, margin: "0 auto 32px", fontWeight: 300, lineHeight: 1.7 }}>Book a free consultation and a door specialist will help you find the right material, style, and glass for your home.</p>
        <div className="sr d2" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <a href="tel:4165007610" className="hm-cta-ghost" style={{ borderColor: "rgba(255,255,255,.2)", color: "var(--white)" }}>Call 416-500-7610 ›</a>
        </div>
      </section>
    </div>
  );
}
