"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuoteModal } from "@/context/QuoteModalContext";

const garageMaterials = [
  { tag: "Most Popular", tagBg: "rgba(75,40,109,.1)", tagColor: "var(--accent)", title: "Steel", img: "/assets/garage/steel.png", desc: "Maximum security and insulation. Polyurethane foam core with reinforced steel panels. R-18 rated, wind and snow tested.", s1: "R-18", l1: "Insulation", s2: "20ga", l2: "Steel Skin", product: "Steel Garage Door" },
  { tag: "Premium", tagBg: "rgba(0,0,0,.06)", tagColor: "rgba(0,0,0,.5)", title: "Natural Wood", img: "/assets/garage/wood.png", desc: "Rich, genuine wood grain with hand-crafted geometric detailing. Warm, timeless curb appeal with natural character.", s1: "Solid", l1: "Hardwood", s2: "R-14", l2: "Insulation", product: "Natural Wood Garage Door" },
  { tag: "Modern", tagBg: "rgba(0,0,0,.06)", tagColor: "rgba(0,0,0,.5)", title: "Aluminum & Glass", img: "/assets/garage/aluminum.png", desc: "Full-view contemporary design. Anodized aluminum frames with tempered glass panels. Sleek, modern curb appeal.", s1: "Tempered", l1: "Glass", s2: "Anodized", l2: "Frame", product: "Aluminum & Glass Garage Door" },
];

const benefits = [
  "Increased home value",
  "Better insulation & energy efficiency",
  "Improved security",
  "Quieter & smoother operation",
  "Lower maintenance costs",
  "Smart tech integration",
  "Better functionality & safety",
];

const galleryImages = [
  "/assets/reviews/project-4.jpg","/assets/reviews/project-6.jpg","/assets/reviews/project-1.jpg",
  "/assets/reviews/project-3.jpg","/assets/reviews/project-2.jpg","/assets/reviews/project-5.jpg",
];

export default function GaragePage() {
  useScrollReveal();
  const { open: openQuote } = useQuoteModal();
  const benefitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = benefitsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.querySelectorAll(".ben-item").forEach((item, i) => {
          const htmlItem = item as HTMLElement;
          setTimeout(() => { htmlItem.style.opacity = "1"; htmlItem.style.transform = "translateY(0)"; }, 200 + i * 100);
        });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hm-hero" style={{ minHeight: "auto", paddingBottom: 0 }}>
        <div className="hm-hero-text" style={{ padding: "20px 24px 0", marginBottom: 0 }}>
          <div className="hm-hero-badge sr">Premium Garage Doors</div>
          <h1 className="sr d1" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(3rem,9vw,7rem)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: .9, color: "var(--accent)", marginBottom: 20 }}>
            Curb appeal,<br />elevated.
          </h1>
          <p className="sr d2" style={{ fontSize: "1.1rem", color: "rgba(0,0,0,.6)", maxWidth: 520, margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            Modern design, R-18 insulation, and whisper-quiet operation — garage doors that transform your home from the street.
          </p>
        </div>
        <div className="rv-hero-vid-garage" style={{ position: "relative", marginTop: 24, background: "var(--white)", overflow: "hidden" }}>
          <video autoPlay muted playsInline loop style={{ display: "block", width: "88%", height: "65vh", objectFit: "contain", background: "var(--white)", margin: "0 auto" }}>
            <source src="/assets/garage-page-hero.mp4" type="video/mp4" />
          </video>
          {/* Blend gradients — top, bottom, left, right */}
          <div className="rv-blend-tb" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to bottom,#FFFFFF 0%,transparent 100%)" }} />
          <div className="rv-blend-tb" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to top,#FFFFFF 0%,transparent 100%)" }} />
          <div className="rv-blend-side" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 60, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to right,#FFFFFF 0%,transparent 100%)" }} />
          <div className="rv-blend-side" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 60, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to left,#FFFFFF 0%,transparent 100%)" }} />
        </div>
        <div className="sr d3" style={{ textAlign: "center", padding: "20px 24px 32px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <a className="hm-cta-ghost" onClick={() => document.getElementById("garage-styles")?.scrollIntoView({ behavior: "smooth" })} style={{ cursor: "pointer" }}>Explore styles ›</a>
        </div>
      </section>

      {/* ── Material Cards ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p className="ch-label sr">Choose Your Material</p>
          <h2 className="ch-h sr d1" style={{ color: "var(--ink)" }}>Same uncompromising quality.<br /><em style={{ color: "var(--accent)" }}>Three distinct characters.</em></h2>
        </div>
        <div className="door-pillars" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {garageMaterials.map((g, i) => (
            <div key={g.title} className={`door-mat-card sr d${i + 1}`} style={{ cursor: "pointer" }} onClick={() => openQuote(g.product, "Garage Doors")}>
              <div className="rv-card-img" style={{ height: 300, background: "transparent", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src={g.img} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center bottom", maxHeight: 280 }} />
              </div>
              <span style={{ fontSize: ".65rem", padding: "4px 10px", borderRadius: 20, background: g.tagBg, color: g.tagColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", width: "fit-content" }}>{g.tag}</span>
              <h3 style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", margin: "12px 0 8px" }}>{g.title}</h3>
              <p style={{ fontSize: ".88rem", color: "rgba(0,0,0,.6)", lineHeight: 1.7, fontWeight: 300, marginBottom: 20, flex: 1 }}>{g.desc}</p>
              <div style={{ display: "flex", gap: 28, borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
                <div><span style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>{g.s1}</span><br /><span style={{ fontSize: ".65rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>{g.l1}</span></div>
                <div><span style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>{g.s2}</span><br /><span style={{ fontSize: ".65rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>{g.l2}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 0", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: "clamp(56px,7vw,80px)" }}>
          {/* Panel Styles */}
          <div className="sr garage-feat" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,4vw,64px)", alignItems: "center" }}>
            <div>
              <p className="ch-label">Panel Styles</p>
              <h3 className="ch-h" style={{ color: "var(--ink)", marginBottom: 16 }}>Classic to<br /><em style={{ color: "var(--accent)" }}>contemporary.</em></h3>
              <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>From raised-panel traditional to sleek full-view glass — every architectural style covered. Short, long, and flush panel configurations with optional window inserts.</p>
              <div style={{ fontSize: ".85rem", color: "rgba(0,0,0,.55)", lineHeight: 2, fontWeight: 300 }}>
                <span style={{ display: "inline-block", marginRight: 16 }}>• Two Panel</span>
                <span style={{ display: "inline-block", marginRight: 16 }}>• Three Panel</span>
                <span style={{ display: "inline-block", marginRight: 16 }}>• Four Panel</span><br />
                <span style={{ display: "inline-block", marginRight: 16 }}>• Full-View Glass</span>
                <span style={{ display: "inline-block", marginRight: 16 }}>• Flush</span>
                <span style={{ display: "inline-block" }}>• Carriage House</span>
              </div>
            </div>
            <div className="garage-vid" style={{ borderRadius: "var(--radius-lg)", aspectRatio: "3/4", overflow: "hidden" }}>
              <video autoPlay muted playsInline loop style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
                <source src="/assets/garage/panel-styles.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Benefits Card + Text */}
          <div className="op-section" style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "clamp(36px,5vw,64px)", margin: "0 -8px" }}>
            <div className="garage-benefits-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,5vw,80px)", alignItems: "center" }}>
              <div ref={benefitsRef} className="benefits-card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", padding: 4, boxShadow: "0 20px 60px rgba(0,0,0,.10),0 4px 16px rgba(0,0,0,.06)", position: "relative", opacity: 0, transform: "translateY(28px)", transition: "all .6s var(--ease-out)" }}>
                <div className="led-border" />
                <div style={{ background: "linear-gradient(150deg,#f8f7ff 0%,#ffffff 60%)", borderRadius: "calc(var(--radius-lg) - 4px)", display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "40px 44px", position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                    <span style={{ color: "var(--accent)", fontSize: "1.1rem", letterSpacing: 2, lineHeight: 1 }}>★★★★★</span>
                    <div style={{ width: 1, height: 14, background: "rgba(0,0,0,.1)" }} />
                    <span style={{ fontSize: ".72rem", color: "rgba(0,0,0,.38)", fontWeight: 500 }}>5.0 · 200+ homeowner reviews</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {benefits.map((b, i) => (
                      <div key={i} className="ben-item" style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 0", borderBottom: i < benefits.length - 1 ? "1px solid rgba(0,0,0,.06)" : "none", opacity: 0, transform: "translateY(12px)", transition: `all .4s ${.2 + i * .1}s var(--ease-out)` }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="8" fill="rgba(75,40,109,.15)" />
                          <path d="M5 8L7 10.5L11 5.5" stroke="#4b286d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: ".88rem", color: "rgba(0,0,0,.82)", fontWeight: 500 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 1, background: "var(--accent)", opacity: .5 }} />
                  <span style={{ fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>The Velara Difference</span>
                </div>
                <h3 className="ch-h" style={{ color: "var(--ink)", marginBottom: 20 }}>More than<br />a door.<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>An upgrade.</em></h3>
                <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.5)", lineHeight: 1.85, fontWeight: 300, marginBottom: 36 }}>A new Velara garage door adds real value to your home — better curb appeal, lower energy bills, stronger security, and the quiet confidence of knowing it&apos;ll work flawlessly every single day.</p>
                <div className="garage-mini-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(0,0,0,.07)", borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
                  {[{ n: "5%", l: "Home value" }, { n: "R-18", l: "Insulation" }, { n: "25yr", l: "Warranty" }].map((s) => (
                    <div key={s.l} style={{ background: "#fff", padding: "18px 16px", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(0,0,0,.35)", marginTop: 4, fontWeight: 500 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Factory-direct — no middleman markup", "Ontario-made, installed by our team", "25-year warranty, parts & labour"].map((b) => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="8" fill="rgba(75,40,109,.15)" /><path d="M5 8L7 10.5L11 5.5" stroke="#4b286d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span style={{ fontSize: ".83rem", color: "rgba(0,0,0,.6)", fontWeight: 400 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colours */}
          <div className="sr garage-feat" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "clamp(32px,4vw,64px)", alignItems: "center" }}>
            <div>
              <p className="ch-label">Customization</p>
              <h3 className="ch-h" style={{ color: "var(--ink)", marginBottom: 16 }}>Your home.<br /><em style={{ color: "var(--accent)" }}>Your colour.</em></h3>
              <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>Over 50 colours and finishes including realistic woodgrain textures that look like real wood but need zero maintenance.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 320 }}>
                <div style={{ padding: 16, background: "rgba(75,40,109,.04)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>50+</span>
                  <span style={{ fontSize: ".68rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Colours</span>
                </div>
                <div style={{ padding: 16, background: "rgba(75,40,109,.04)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>6</span>
                  <span style={{ fontSize: ".68rem", color: "rgba(0,0,0,.45)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Woodgrains</span>
                </div>
              </div>
            </div>
            <div className="garage-vid" style={{ borderRadius: "var(--radius-lg)", aspectRatio: "7/3", overflow: "hidden" }}>
              <video autoPlay muted playsInline loop style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
                <source src="/assets/garage/colours.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="garage-styles" style={{ padding: "clamp(48px,6vw,80px) 24px", background: "rgba(75,40,109,.03)" }}>
        <div className="garage-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          {[{ n: "R-18", l: "Insulation Rating" }, { n: "50+", l: "Colours & Finishes" }, { n: "25yr", l: "Warranty" }, { n: "100%", l: "Canadian Made" }].map((s, i) => (
            <div key={s.l} className={`sr${i > 0 ? ` d${i}` : ""}`}>
              <span className="rv-stat-n" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--accent)", display: "block" }}>{s.n}</span>
              <span style={{ fontSize: ".78rem", color: "rgba(0,0,0,.5)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 36 }}>
          <p className="ch-label sr">Our Process</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>From consultation to <em style={{ color: "var(--accent)", fontStyle: "italic" }}>installation.</em></h2>
          <p className="sr" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.7)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>A seamless process designed around your schedule — not ours.</p>
        </div>
        <div className="tl-wrap">
          <div className="tl-line" /><div className="tl-line-fill" data-tl="" />
          {[
            { n: 1, h: "Choose your style", p: "Explore panel styles, colours, and window options with a dedicated garage door specialist." },
            { n: 2, h: "Transparent quote", p: "Clear pricing with no hidden fees. Factory-direct means no middleman markups." },
            { n: 3, h: "Precision measurement", p: "We measure at your home to ensure a perfect fit for your opening." },
            { n: 4, h: "Expert installation", p: "Professional install with full system testing, spring balancing, and cleanup." },
          ].map((s) => (
            <div key={s.n} className="tl-step"><div className="tl-dot"><span>{s.n}</span></div><h3>{s.h}</h3><p>{s.p}</p></div>
          ))}
        </div>
      </section>

      {/* ── Work Gallery ── */}
      <section className="pg-gallery">
        <div className="pg-gallery-head sr"><p className="ch-label">Our Work</p><h2 className="ch-h">Installs we&apos;re <em style={{ color: "var(--accent)" }}>proud of.</em></h2></div>
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
        <h2 className="sr" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: "var(--white)", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 12 }}>Upgrade your <em style={{ color: "var(--accent)" }}>curb appeal.</em></h2>
        <p className="sr d1" style={{ fontSize: "1rem", color: "rgba(255,255,255,.5)", maxWidth: 480, margin: "0 auto 32px", fontWeight: 300, lineHeight: 1.7 }}>Book a free consultation and we&apos;ll help you find the perfect garage door for your home&apos;s style and climate.</p>
        <div className="sr d2" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <a href="tel:4165007610" className="hm-cta-ghost" style={{ borderColor: "rgba(255,255,255,.2)", color: "var(--white)" }}>Call 416-500-7610 ›</a>
        </div>
      </section>
    </div>
  );
}
