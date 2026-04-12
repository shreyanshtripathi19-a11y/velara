"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useVideoObserver } from "@/hooks/useVideoObserver";
import { usePanelAnimations } from "@/hooks/usePanelAnimations";

export default function HomePage() {
  useScrollReveal();
  useCountUp();
  useVideoObserver();
  usePanelAnimations();

  /* Testimonials mouse-tracking parallax */
  const driftRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const drift = driftRef.current;
    const vp = vpRef.current;
    if (!drift || !vp) return;
    let mx = 0.5, my = 0.5, cx = 0.5, cy = 0.5;
    const rangeX = 400, rangeY = 300;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      const r = vp.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { mx = 0.5; my = 0.5; };

    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const tx = -(cx - 0.5) * rangeX;
      const ty = -(cy - 0.5) * rangeY;
      drift.style.transform = `translate(${tx}px,${ty}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    vp.addEventListener("mousemove", onMove);
    vp.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      vp.removeEventListener("mousemove", onMove);
      vp.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="homepage">
      {/* HERO */}
      <section className="hm-hero">
        <div className="hm-hero-text">
          <div className="hm-hero-badge">Premium Windows &amp; Doors</div>
          <h1 className="hm-title">
            <span className="hm-word" id="hw0">Windows</span>{" "}
            <span className="hm-amp" id="hw1">&amp;</span>{" "}
            <span className="hm-word hm-word-purple" id="hw2">Doors.</span>
          </h1>
        </div>
        <video className="hm-hero-bg loaded" autoPlay muted playsInline>
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hm-hero-links" id="hm-links-bottom">
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <Link href="/windows" className="hm-cta-ghost">See our work ›</Link>
        </div>
      </section>

      {/* TICKER */}
      <div className="hm-ticker" aria-hidden="true">
        <div className="hm-ticker-track">
          <span>5-Star Rated</span><span className="hm-dot">·</span>
          <span>Made in Canada</span><span className="hm-dot">·</span>
          <span>BBB Accredited</span><span className="hm-dot">·</span>
          <span>From $49/Month</span><span className="hm-dot">·</span>
          <span>Ontario{"'"}s Best</span><span className="hm-dot">·</span>
          <span>Lifetime Quality</span><span className="hm-dot">·</span>
          <span>5-Star Rated</span><span className="hm-dot">·</span>
          <span>Made in Canada</span><span className="hm-dot">·</span>
          <span>BBB Accredited</span><span className="hm-dot">·</span>
          <span>From $49/Month</span><span className="hm-dot">·</span>
          <span>Ontario{"'"}s Best</span><span className="hm-dot">·</span>
          <span>Lifetime Quality</span><span className="hm-dot">·</span>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="hm-stats-strip sr">
        <div className="hm-strip-item sr d1">
          <div className="hm-strip-n"><span className="hm-count" data-target="10000">0</span><sup>+</sup></div>
          <div className="hm-strip-l">Installs Completed</div>
        </div>
        <div className="hm-strip-div"></div>
        <div className="hm-strip-item sr d2">
          <div className="hm-strip-n"><span className="hm-count" data-target="25">0</span><sup>yr</sup></div>
          <div className="hm-strip-l">Warranty Coverage</div>
        </div>
        <div className="hm-strip-div"></div>
        <div className="hm-strip-item sr d3">
          <div className="hm-strip-n"><span className="hm-count" data-target="5">0</span><sup>★</sup></div>
          <div className="hm-strip-l">Customer Rating</div>
        </div>
        <div className="hm-strip-div"></div>
        <div className="hm-strip-item sr d4">
          <div className="hm-strip-n"><span className="hm-count" data-target="1">0</span><sup>hr</sup></div>
          <div className="hm-strip-l">Quote Turnaround</div>
        </div>
      </div>

      {/* WINDOWS PANEL — video left, text right */}
      <section className="hm-panel hm-panel-txt-right" data-page="windows">
        <Link href="/windows" className="hm-panel-vid" style={{ cursor: "pointer", display: "block" }}>
          <video className="hm-scroll-video" muted playsInline>
            <source src="/assets/windows-seasons.mp4" type="video/mp4" />
          </video>
        </Link>
        <div className="hm-panel-txt">
          <p className="hm-panel-label">01</p>
          <h2 className="hm-panel-h">Let the<br /><em>light in.</em></h2>
          <Link href="/windows" className="hm-panel-link">Windows ›</Link>
        </div>
      </section>

      {/* DOORS PANEL — text left, video right */}
      <section className="hm-panel hm-panel-txt-left" data-page="doors">
        <Link href="/doors" className="hm-panel-vid" style={{ cursor: "pointer", display: "block" }}>
          <video className="hm-scroll-video" muted playsInline>
            <source src="/assets/doors-home.mp4" type="video/mp4" />
          </video>
        </Link>
        <div className="hm-panel-txt">
          <p className="hm-panel-label">02</p>
          <h2 className="hm-panel-h">Make an<br /><em>entrance.</em></h2>
          <Link href="/doors" className="hm-panel-link">Doors ›</Link>
        </div>
      </section>

      {/* GARAGE PANEL — video left, text right */}
      <section className="hm-panel hm-panel-txt-right" data-page="garage">
        <Link href="/garage" className="hm-panel-vid" style={{ cursor: "pointer", display: "block" }}>
          <video className="hm-scroll-video" muted playsInline>
            <source src="/assets/garage-hero.mp4" type="video/mp4" />
          </video>
        </Link>
        <div className="hm-panel-txt">
          <p className="hm-panel-label">03</p>
          <h2 className="hm-panel-h" style={{ whiteSpace: 'nowrap' }}>Curb appeal,<br /><em>elevated.</em></h2>
          <Link href="/garage" className="hm-panel-link">Garage Doors ›</Link>
        </div>
      </section>

      {/* VELARA ADVANTAGE */}
      <section className="sr win-advantage home-advantage" style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)" }}>
        <div className="center" style={{ marginBottom: "0" }}>
          <p className="ch-label">The Velara Advantage</p>
          <h2 className="ch-h center" style={{ color: "var(--accent)" }}>Why choose<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>Velara.</em></h2>
          <p style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: "580px", margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>From factory to front door — we{"'"}re the Canadian manufacturer homeowners and builders trust for quality, speed, and honest service.</p>
        </div>
        <div className="perks-grid">
          <div className="perk sr d1"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></div><h3>Factory-Direct Pricing</h3><p>No middlemen, no retail markup. Buy directly from the manufacturer and save 20–40% compared to big-box stores.</p></div>
          <div className="perk sr d2"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg></div><h3>Custom Built to Order</h3><p>Every window, door, and garage door is made to your exact specs — size, style, colour, and glass. No compromises.</p></div>
          <div className="perk sr d3"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div><h3>25-Year Warranty</h3><p>One of the most comprehensive warranties in Canada. Covers glass, frame, hardware, and seal failure — total peace of mind.</p></div>
          <div className="perk sr d1"><div className="perk-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div><h3>Fastest Turnaround</h3><p>Canadian-manufactured for speed. Standard orders ship in 1-2 weeks, not months — so your renovation stays on schedule.</p></div>
          <div className="perk sr d2"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div><h3>Energy Star® Certified</h3><p>Every product meets or exceeds Energy Star® standards. Lower energy bills and a more comfortable home, year-round.</p></div>
          <div className="perk sr d3"><div className="perk-ico"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg></div><h3>Expert Consultation</h3><p>A dedicated specialist guides you from selection to installation. No pressure, no upselling — just honest advice.</p></div>
        </div>
      </section>

      {/* EXPLORE OUR PRODUCT LINE */}
      <section style={{ padding: "clamp(48px,5vw,80px) 0 clamp(48px,5vw,80px)", background: "var(--white)" }}>
        <div style={{ textAlign: "center", padding: "0 24px", marginBottom: "clamp(32px,4vw,48px)" }}>
          <h2 className="ch-h sr" style={{ color: "var(--ink)", fontSize: "clamp(2rem,4vw,3.2rem)" }}><b>Explore Our Product Line</b></h2>
          <p className="sr d1" style={{ color: "var(--muted)", maxWidth: "680px", margin: "16px auto 0", fontSize: "1.05rem", lineHeight: 1.6 }}>As an Energy Star Partner, all of our windows are manufactured to meet and exceed Energy Star standards for the Canadian climate.</p>
        </div>

        {/* WINDOWS */}
        <p className="sr d1" style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginBottom: "24px", fontWeight: 600 }}>Windows</p>
        <div className="sr d2 hm-prodline-grid hm-prodline-windows" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "40px", maxWidth: "1360px", margin: "0 auto 48px", padding: "0 32px" }}>
          <div className="hm-prod-card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--white)", display: "flex", flexDirection: "column", border: "1px solid var(--rule)", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
            <div className="rv-card-img" style={{ position: "relative", background: "var(--white)", padding: "0", height: "480px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="hm-card-tag" style={{ position: "absolute", top: "32px", left: "24px", background: "#4a7c59", color: "white", fontSize: "1rem", fontWeight: 700, padding: "10px 24px", borderRadius: "6px", letterSpacing: "0.5px", zIndex: 2 }}>V Series</div>
              <img src="/assets/v-series.png" alt="V Series window" style={{ height: "85%", width: "100%", objectFit: "contain", mixBlendMode: "multiply", transform: "scale(1.15) translateY(10px)" }} />
            </div>
            <div className="rv-card-body" style={{ padding: "40px 48px 48px", display: "flex", flexDirection: "column", flex: 1 }}>
              <p className="hm-card-desc" style={{ color: "var(--ink)", fontSize: "1.05rem", lineHeight: 1.75, flex: 1 }}>The new modern, clean design built for new construction and stunning custom homes. Engineered with the latest technology for unmatched performance, sleek aesthetics, and the cleanest sightlines available.</p>
              <div className="hm-card-specs" style={{ display: "flex", gap: "40px", marginTop: "32px" }}>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.4rem", fontWeight: 800 }}>4-9/16″</span><br /><span className="hm-spec-label" style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Frame Depth</span></div>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.4rem", fontWeight: 800 }}>Energy Star®</span><br /><span className="hm-spec-label" style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Certified</span></div>
              </div>
            </div>
          </div>
          <div className="hm-prod-card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--white)", display: "flex", flexDirection: "column", border: "1px solid var(--rule)", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
            <div className="rv-card-img" style={{ position: "relative", background: "var(--white)", padding: "0", height: "480px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="hm-card-tag" style={{ position: "absolute", top: "32px", left: "24px", background: "#1a2744", color: "white", fontSize: "1rem", fontWeight: 700, padding: "10px 18px", borderRadius: "6px", letterSpacing: "0.5px", zIndex: 2 }}>Signature Series</div>
              <img src="/assets/signature-series.png" alt="Signature Series window" style={{ height: "85%", width: "100%", objectFit: "contain", mixBlendMode: "multiply", transform: "scale(1.05) translate(14px, 24px)" }} />
            </div>
            <div className="rv-card-body" style={{ padding: "40px 48px 48px", display: "flex", flexDirection: "column", flex: 1 }}>
              <p className="hm-card-desc" style={{ color: "var(--ink)", fontSize: "1.05rem", lineHeight: 1.75, flex: 1 }}>The popular design trusted by thousands of homes across Canada. Classic styling with proven durability, premium features, and exceptional value — the go-to choice for renovations and replacements.</p>
              <div className="hm-card-specs" style={{ display: "flex", gap: "40px", marginTop: "32px" }}>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.4rem", fontWeight: 800 }}>3-1/4″</span><br /><span className="hm-spec-label" style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Frame Depth</span></div>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.4rem", fontWeight: 800 }}>Energy Star®</span><br /><span className="hm-spec-label" style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Certified</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* DOORS */}
        <p className="sr" style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginBottom: "24px", fontWeight: 600 }}>Doors</p>
        <div className="sr d1 hm-prodline-grid hm-prodline-doors" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "40px", maxWidth: "1360px", margin: "0 auto 48px", padding: "0 32px" }}>
          <div className="door-mat-card">
            <div className="rv-card-img" style={{ height: "360px", background: "var(--white)", borderRadius: "var(--radius-md)", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src="/assets/doors/steel.png" alt="Steel entry door" style={{ maxHeight: "330px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </div>
            <div className="hm-card-badge-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span className="hm-card-badge" style={{ fontSize: ".75rem", padding: "6px 14px", borderRadius: "20px", background: "rgba(75,40,109,.1)", color: "var(--accent)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Most Popular</span>
            </div>
            <h3 className="hm-card-title" style={{ fontFamily: "var(--font-d)", fontSize: "1.8rem", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>Steel</h3>
            <p className="hm-card-desc" style={{ fontSize: "1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>Maximum security and durability. Polyurethane foam core for superior insulation. Dent-resistant and low maintenance.</p>
            <div className="hm-card-specs" style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
              <div style={{ textAlign: "center" }}><span className="hm-spec-val" style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", display: "block" }}>R-16</span><span className="hm-spec-label" style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Insulation</span></div>
              <div style={{ width: "1px", background: "var(--rule)" }}></div>
              <div style={{ textAlign: "center" }}><span className="hm-spec-val" style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", display: "block" }}>20ga</span><span className="hm-spec-label" style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Steel Skin</span></div>
            </div>
          </div>
          <div className="door-mat-card">
            <div className="rv-card-img" style={{ height: "360px", background: "var(--white)", borderRadius: "var(--radius-md)", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src="/assets/doors/fibreglass.png" alt="Fibreglass entry door" style={{ maxHeight: "330px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </div>
            <div className="hm-card-badge-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span className="hm-card-badge" style={{ fontSize: ".75rem", padding: "6px 14px", borderRadius: "20px", background: "rgba(0,0,0,.06)", color: "rgba(0,0,0,.5)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Low Maintenance</span>
            </div>
            <h3 className="hm-card-title" style={{ fontFamily: "var(--font-d)", fontSize: "1.8rem", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>Fibreglass</h3>
            <p className="hm-card-desc" style={{ fontSize: "1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>Authentic woodgrain texture without the upkeep. Won{"'"}t warp, crack, or rot. Holds paint and stain beautifully for years.</p>
            <div className="hm-card-specs" style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
              <div style={{ textAlign: "center" }}><span className="hm-spec-val" style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", display: "block" }}>R-16</span><span className="hm-spec-label" style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Insulation</span></div>
              <div style={{ width: "1px", background: "var(--rule)" }}></div>
              <div style={{ textAlign: "center" }}><span className="hm-spec-val" style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", display: "block" }}>UV</span><span className="hm-spec-label" style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Resistant</span></div>
            </div>
          </div>
          <div className="door-mat-card">
            <div className="rv-card-img" style={{ height: "360px", background: "var(--white)", borderRadius: "var(--radius-md)", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src="/assets/doors/wood.png" alt="Wood entry door" style={{ maxHeight: "330px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </div>
            <div className="hm-card-badge-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span className="hm-card-badge" style={{ fontSize: ".75rem", padding: "6px 14px", borderRadius: "20px", background: "rgba(0,0,0,.06)", color: "rgba(0,0,0,.5)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Premium</span>
            </div>
            <h3 className="hm-card-title" style={{ fontFamily: "var(--font-d)", fontSize: "1.8rem", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>Solid Wood</h3>
            <p className="hm-card-desc" style={{ fontSize: "1rem", color: "rgba(0,0,0,.6)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>Timeless craftsmanship in mahogany, oak, or knotty alder. The warmth and character only real wood delivers.</p>
            <div className="hm-card-specs" style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
              <div style={{ textAlign: "center" }}><span className="hm-spec-val" style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", display: "block" }}>Custom</span><span className="hm-spec-label" style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Stains</span></div>
              <div style={{ width: "1px", background: "var(--rule)" }}></div>
              <div style={{ textAlign: "center" }}><span className="hm-spec-val" style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", display: "block" }}>Solid</span><span className="hm-spec-label" style={{ fontSize: ".7rem", color: "rgba(0,0,0,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>Core</span></div>
            </div>
          </div>
        </div>

        {/* GARAGE DOORS */}
        <p className="sr" style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginBottom: "24px", fontWeight: 600 }}>Garage Doors</p>
        <div className="sr d1 hm-prodline-grid hm-prodline-garage" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "40px", maxWidth: "1360px", margin: "0 auto", padding: "0 32px" }}>
          {/* Steel */}
          <div className="hm-prod-card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--white)", border: "1px solid var(--rule)", boxShadow: "0 2px 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column" }}>
            <div className="rv-card-img" style={{ position: "relative", background: "var(--white)", padding: "32px 32px 0", height: "300px", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
              <div className="hm-card-tag" style={{ position: "absolute", top: "24px", left: "24px", background: "#1a2744", color: "white", fontSize: "0.85rem", fontWeight: 700, padding: "8px 16px", borderRadius: "6px", letterSpacing: "0.5px", zIndex: 2 }}>Steel</div>
              <img src="/assets/garage/steel.png" alt="Steel garage door" style={{ maxHeight: "260px", maxWidth: "100%", objectFit: "contain" }} />
            </div>
            <div className="rv-card-body" style={{ padding: "32px 36px 36px", display: "flex", flexDirection: "column", flex: 1 }}>
              <p className="hm-card-desc" style={{ color: "var(--ink)", fontSize: "1.05rem", lineHeight: 1.7, flex: 1 }}>Maximum security and insulation. Polyurethane foam core with reinforced steel panels. R-18 rated, wind and snow tested.</p>
              <div className="hm-card-specs" style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.3rem", fontWeight: 800 }}>R-18</span><br /><span className="hm-spec-label" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Insulation</span></div>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.3rem", fontWeight: 800 }}>20ga</span><br /><span className="hm-spec-label" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Steel Skin</span></div>
              </div>
            </div>
          </div>
          {/* Natural Wood */}
          <div className="hm-prod-card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--white)", border: "1px solid var(--rule)", boxShadow: "0 2px 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column" }}>
            <div className="rv-card-img" style={{ position: "relative", background: "var(--white)", padding: "32px 32px 0", height: "300px", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
              <div className="hm-card-tag" style={{ position: "absolute", top: "24px", left: "24px", background: "#6b4226", color: "white", fontSize: "0.85rem", fontWeight: 700, padding: "8px 16px", borderRadius: "6px", letterSpacing: "0.5px", zIndex: 2 }}>Natural Wood</div>
              <img src="/assets/garage/wood.png" alt="Natural wood garage door" style={{ maxHeight: "260px", maxWidth: "100%", objectFit: "contain" }} />
            </div>
            <div className="rv-card-body" style={{ padding: "32px 36px 36px", display: "flex", flexDirection: "column", flex: 1 }}>
              <p className="hm-card-desc" style={{ color: "var(--ink)", fontSize: "1.05rem", lineHeight: 1.7, flex: 1 }}>Rich, genuine wood grain with hand-crafted geometric detailing. Warm, timeless curb appeal with natural character.</p>
              <div className="hm-card-specs" style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.3rem", fontWeight: 800 }}>Solid</span><br /><span className="hm-spec-label" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Hardwood</span></div>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.3rem", fontWeight: 800 }}>R-14</span><br /><span className="hm-spec-label" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Insulation</span></div>
              </div>
            </div>
          </div>
          {/* Aluminum & Glass */}
          <div className="hm-prod-card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--white)", border: "1px solid var(--rule)", boxShadow: "0 2px 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column" }}>
            <div className="rv-card-img" style={{ position: "relative", background: "var(--white)", padding: "32px 32px 0", height: "300px", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
              <div className="hm-card-tag" style={{ position: "absolute", top: "24px", left: "24px", background: "#4a7c59", color: "white", fontSize: "0.85rem", fontWeight: 700, padding: "8px 16px", borderRadius: "6px", letterSpacing: "0.5px", zIndex: 2 }}>Aluminum &amp; Glass</div>
              <img src="/assets/garage/aluminum.png" alt="Aluminum glass garage door" style={{ maxHeight: "260px", maxWidth: "100%", objectFit: "contain" }} />
            </div>
            <div className="rv-card-body" style={{ padding: "32px 36px 36px", display: "flex", flexDirection: "column", flex: 1 }}>
              <p className="hm-card-desc" style={{ color: "var(--ink)", fontSize: "1.05rem", lineHeight: 1.7, flex: 1 }}>Full-view contemporary design. Anodized aluminum frames with tempered glass panels. Sleek, modern curb appeal.</p>
              <div className="hm-card-specs" style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.3rem", fontWeight: 800 }}>Tempered</span><br /><span className="hm-spec-label" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Glass</span></div>
                <div><span className="hm-spec-val" style={{ color: "var(--accent)", fontSize: "1.3rem", fontWeight: 800 }}>Anodized</span><br /><span className="hm-spec-label" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Frame</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="hm-stats">
        <div className="hm-stat">
          <div className="hm-stat-n"><span className="hm-count" data-target="5">0</span><sup>★</sup></div>
          <div className="hm-stat-l">Customer Rating</div>
        </div>
        <div className="hm-stat-div"></div>
        <div className="hm-stat">
          <div className="hm-stat-n">$<span className="hm-count" data-target="49">0</span></div>
          <div className="hm-stat-l">Monthly Financing</div>
        </div>
        <div className="hm-stat-div"></div>
        <div className="hm-stat">
          <div className="hm-stat-n"><span className="hm-count" data-target="100">0</span><sup>+</sup></div>
          <div className="hm-stat-l">Product Styles</div>
        </div>
        <div className="hm-stat-div"></div>
        <div className="hm-stat">
          <div className="hm-stat-n"><span className="hm-count" data-target="100">0</span><sup>%</sup></div>
          <div className="hm-stat-l">Made in Canada</div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="hm-testimonials sr">
        <div className="hm-test-head">
          <p className="ch-label">What Our Clients Say</p>
          <h2 className="ch-h">Trusted by homeowners<br /><em>across Ontario.</em></h2>
        </div>
        <div className="hm-test-viewport" ref={vpRef}>
          <div className="hm-test-fade-l"></div>
          <div className="hm-test-fade-r"></div>
          <div className="hm-test-drift" ref={driftRef}>
            <TestimonialColumns />
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="hm-cta-band">
        <h2 className="hm-cta-h">Free estimate.<br /><em>No commitment.</em></h2>
        <div className="hm-cta-form">
          <input type="text" placeholder="Name" />
          <input type="tel" placeholder="Phone" />
          <select defaultValue=""><option value="" disabled>Product</option><option>Windows</option><option>Doors</option><option>Garage Doors</option></select>
          <button type="button">Get Estimate →</button>
        </div>
      </section>
    </div>
  );
}

/* Testimonial card helper */
function TestCard({ type, size, children }: { type: string; size: string; children: React.ReactNode }) {
  return <div className={`hm-test-card hm-test-card-${type} hm-test-card-${size}`}>{children}</div>;
}
function TestQuote({ initials, name, role, quote, type }: { initials: string; name: string; role: string; quote: string; type: string }) {
  return (
    <TestCard type={type} size="md">
      <div className="hm-test-quote-mark">&ldquo;</div>
      <p className="hm-test-quote">{quote}</p>
      <div className="hm-test-author"><div className="hm-test-avatar">{initials}</div><div><p className="hm-test-name">{name}</p><p className="hm-test-role">{role}</p></div></div>
    </TestCard>
  );
}

function TestimonialColumns() {
  return (
    <>
      {/* Col 1 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-img hm-test-card-xl"><img src="/assets/reviews/project-1.jpg" alt="Bay window install" loading="lazy" /></div>
        <div className="hm-test-card hm-test-card-purple hm-test-card-md">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Best windows on the market. Period. Our entire building complex was fitted in under two weeks.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">RK</div><div><p className="hm-test-name">Robert K.</p><p className="hm-test-role">Property Manager, Brampton</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-white hm-test-card-sm">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">No pressure, no upselling. Just honest and clear recommendations.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">JL</div><div><p className="hm-test-name">Jennifer L.</p><p className="hm-test-role">Homeowner, Oakville</p></div></div>
        </div>
      </div>
      {/* Col 2 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-black hm-test-card-sm">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Professional installation, beautiful product. Couldn{"'"}t be happier.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">JR</div><div><p className="hm-test-name">James &amp; Linda R.</p><p className="hm-test-role">Homeowners, Mississauga</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-img hm-test-card-lg"><img src="/assets/reviews/project-2.jpg" alt="Victorian window install" loading="lazy" /></div>
        <div className="hm-test-card hm-test-card-light hm-test-card-md">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">I always use Velara for every project I manage. Top quality every time.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">CG</div><div><p className="hm-test-name">Carlos G.</p><p className="hm-test-role">Contractor, Burlington</p></div></div>
        </div>
      </div>
      {/* Col 3 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-white hm-test-card-lg">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">The team at Velara was incredible from start to finish. Already noticed a difference in energy bills.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">SM</div><div><p className="hm-test-name">Sarah M.</p><p className="hm-test-role">Homeowner, Toronto</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-purple hm-test-card-sm">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Fast scheduling and very professional installers.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">MP</div><div><p className="hm-test-name">Maria P.</p><p className="hm-test-role">Homeowner, Vaughan</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-img hm-test-card-xl"><img src="/assets/reviews/project-3.jpg" alt="King Henry Drive project" loading="lazy" /></div>
      </div>
      {/* Col 4 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-img hm-test-card-lg"><img src="/assets/reviews/project-4.jpg" alt="Townhouse windows and garage" loading="lazy" /></div>
        <div className="hm-test-card hm-test-card-white hm-test-card-md">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">On time, respectful, and very knowledgeable. I finally feel confident about my house.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">AH</div><div><p className="hm-test-name">Amanda H.</p><p className="hm-test-role">Homeowner, Kitchener</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-black hm-test-card-lg">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">They found issues with our old windows we would have never noticed. Worth every dollar.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">TW</div><div><p className="hm-test-name">Tom W.</p><p className="hm-test-role">Homeowner, Markham</p></div></div>
        </div>
      </div>
      {/* Col 5 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-light hm-test-card-md">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">As a contractor, Velara consistently delivers the best quality. Their builder program is effortless.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">DK</div><div><p className="hm-test-name">David K.</p><p className="hm-test-role">Builder, Oakville</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-img hm-test-card-xl"><img src="/assets/reviews/project-5.jpg" alt="Entry door with stone columns" loading="lazy" /></div>
        <div className="hm-test-card hm-test-card-purple hm-test-card-sm">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Clean install, zero mess left behind.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">KR</div><div><p className="hm-test-name">Karen R.</p><p className="hm-test-role">Homeowner, Guelph</p></div></div>
        </div>
      </div>
      {/* Col 6 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-black hm-test-card-xl">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Our condo board chose Velara for 200+ units. Flawless execution, great pricing.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">NB</div><div><p className="hm-test-name">Nathan B.</p><p className="hm-test-role">Condo Board, Toronto</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-white hm-test-card-sm">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Clear communication throughout the entire process.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">JS</div><div><p className="hm-test-name">Jenna S.</p><p className="hm-test-role">Property Manager, London</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-img hm-test-card-lg"><img src="/assets/reviews/project-6.jpg" alt="New construction windows" loading="lazy" /></div>
      </div>
      {/* Col 7 */}
      <div className="hm-test-col">
        <div className="hm-test-card hm-test-card-purple hm-test-card-lg">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Velara{"'"}s entry doors completely changed the curb appeal. Neighbors keep asking who did the work.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">LF</div><div><p className="hm-test-name">Lisa F.</p><p className="hm-test-role">Homeowner, Whitby</p></div></div>
        </div>
        <div className="hm-test-card hm-test-card-img hm-test-card-md"><img src="/assets/reviews/project-1.jpg" alt="Bay window install" loading="lazy" /></div>
        <div className="hm-test-card hm-test-card-white hm-test-card-xl">
          <div className="hm-test-quote-mark">&ldquo;</div>
          <p className="hm-test-quote">Seamless from quote to install. This is how every contractor should operate.</p>
          <div className="hm-test-author"><div className="hm-test-avatar">MK</div><div><p className="hm-test-name">Mike K.</p><p className="hm-test-role">Homeowner, Oshawa</p></div></div>
        </div>
      </div>
    </>
  );
}
