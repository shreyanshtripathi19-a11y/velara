"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuoteModal } from "@/context/QuoteModalContext";

const ringColors = [
  "#FFFFFF","#F8F4EE","#F5F0E8","#EDE4D4","#D6C6A5","#C4B9A0","#C19A6B","#B08D6A",
  "#A0522D","#8B7D6B","#7A6652","#6B4C3B","#5C3D2E","#4A3728","#3E2B1C",
  "#556B2F","#355E3B","#2C3E50","#4682B4","#708090",
  "#8B8B8B","#B0B0B0","#969696","#6E6E6E","#555555","#3C3C3C","#2A2A2A","#1A1A1A",
];

const seasons = [
  { key: "winter", icon: "❄️", title: "Winter", temp: "-30°C", bg: "linear-gradient(180deg,#1a2133 0%,#0f1419 100%)", border: "rgba(147,197,253,.15)", list: ["Triple-pane argon gas insulation traps heat inside","Low-E coatings reflect radiant heat back into your home","Multi-chambered frames eliminate cold bridging","Warm-edge spacers prevent condensation and frost"], statN: "0.18", statL: "U-Factor rating" },
  { key: "spring", icon: "🌱", title: "Spring", temp: "5–18°C", bg: "linear-gradient(180deg,#152118 0%,#0f1419 100%)", border: "rgba(134,239,172,.15)", list: ["Full perimeter weatherstripping seals out rain and pollen","Advanced drainage channels prevent water infiltration","Casement and awning styles offer controlled ventilation","UV filtering protects floors and furniture from fading"], statN: "100%", statL: "Sealed perimeter" },
  { key: "summer", icon: "☀️", title: "Summer", temp: "+35°C", bg: "linear-gradient(180deg,#211c14 0%,#0f1419 100%)", border: "rgba(253,186,116,.15)", list: ["Solar Heat Gain Coefficient blocks excessive heat","Low-E glass reduces cooling costs by up to 25%","Tinted and reflective glass options for south-facing walls","Smooth operation for cross-ventilation on cooler evenings"], statN: "0.22", statL: "SHGC rating" },
  { key: "fall", icon: "🍂", title: "Fall", temp: "0–15°C", bg: "linear-gradient(180deg,#231a12 0%,#0f1419 100%)", border: "rgba(251,146,60,.15)", list: ["Acoustic insulation dampens wind and rain noise","Triple seal system blocks drafts as temperatures swing","Condensation resistance keeps glass clear and dry","Durable hardware withstands repeated temperature cycling"], statN: "STC 34", statL: "Sound rating" },
];

const perks = [
  { icon: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6", title: "Factory-Direct Pricing", desc: "No middlemen, no retail markup. Buy directly from the manufacturer and save 20–40% compared to big-box stores." },
  { icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z", title: "Custom Built to Order", desc: "Every window is made to your exact specifications — size, style, colour, and glass. No off-the-shelf compromises." },
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "25-Year Warranty", desc: "One of the most comprehensive warranties in Canada. Covers glass, frame, hardware, and seal failure — total peace of mind." },
  { icon: "M12 2a10 10 0 100 20 10 10 0 000-20z M12 6v6l4 2", title: "Fast Turnaround", desc: "Canadian-manufactured for speed. Standard orders ship in weeks, not months — so your renovation stays on schedule." },
  { icon: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4l-10 10.01-3-3", title: "Energy Star® Certified", desc: "Every window meets or exceeds Energy Star® standards. Lower energy bills and a more comfortable home, year-round." },
  { icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 3a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", title: "Expert Consultation", desc: "A dedicated window specialist guides you from selection to installation. No pressure, no upselling — just honest advice." },
];

const galleryImages = [
  { src: "/assets/reviews/project-1.jpg", alt: "Window installation", size: "xl" },
  { src: "/assets/reviews/project-4.jpg", alt: "Townhouse project", size: "lg" },
  { src: "/assets/reviews/project-2.jpg", alt: "Victorian windows", size: "lg" },
  { src: "/assets/reviews/project-5.jpg", alt: "Entry door", size: "xl" },
  { src: "/assets/reviews/project-3.jpg", alt: "King Henry Drive", size: "xl" },
  { src: "/assets/reviews/project-6.jpg", alt: "Garage install", size: "lg" },
];

export default function WindowsPage() {
  useScrollReveal();
  const { open: openQuote } = useQuoteModal();
  const dotsRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const originalMatsRef = useRef<Record<number, { color: number[]; isGlass: boolean }>>({});
  const pendingColorRef = useRef<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  /* ── Save original materials from 3D model ── */
  const saveOriginalMats = () => {
    const mv = modelRef.current as unknown as { model?: { materials: Array<{ name?: string; pbrMetallicRoughness: { baseColorFactor: number[]; metallicFactor?: number; roughnessFactor?: number; setBaseColorFactor: (c: number[]) => void }; extensions?: Record<string, unknown> }> } };
    if (!mv?.model) return;
    const saved: Record<number, { color: number[]; isGlass: boolean }> = {};
    const mats = mv.model.materials;
    for (let i = 0; i < mats.length; i++) {
      const mat = mats[i];
      const name = (mat.name || "").toLowerCase();
      let isGlass = name.includes("glass") || name.includes("glazing") || name.includes("transparent") || name.includes("clear") || name.includes("pane") || name.includes("lite");
      try {
        const f = mat.pbrMetallicRoughness.baseColorFactor;
        if (f && f[3] < 0.95) isGlass = true;
        if (mat.extensions && ("KHR_materials_transmission" in mat.extensions || "KHR_materials_ior" in mat.extensions)) isGlass = true;
        const m = mat.pbrMetallicRoughness.metallicFactor ?? 0;
        const r = mat.pbrMetallicRoughness.roughnessFactor ?? 1;
        if (m > 0.5 && r < 0.3) isGlass = true;
        saved[i] = { color: [f[0], f[1], f[2], f[3]], isGlass };
      } catch {
        saved[i] = { color: [1, 1, 1, 1], isGlass };
      }
    }
    originalMatsRef.current = saved;
  };

  /* ── Apply chosen colour to non-glass materials ── */
  const applyRingColor = (hex: string) => {
    const mv = modelRef.current as unknown as { model?: { materials: Array<{ pbrMetallicRoughness: { baseColorFactor: number[]; setBaseColorFactor: (c: number[]) => void } }> } };
    if (!mv?.model) {
      pendingColorRef.current = hex;
      return;
    }
    if (!Object.keys(originalMatsRef.current).length) saveOriginalMats();
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const mats = mv.model.materials;
    for (let i = 0; i < mats.length; i++) {
      const orig = originalMatsRef.current[i];
      if (orig?.isGlass) {
        mats[i].pbrMetallicRoughness.setBaseColorFactor(orig.color);
        continue;
      }
      mats[i].pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
    }
  };

  /* ── Listen for model-viewer load event ── */
  useEffect(() => {
    if (!mounted) return;
    const checkModel = () => {
      const mv = modelRef.current;
      if (!mv) return;
      const handler = () => {
        saveOriginalMats();
        if (pendingColorRef.current) {
          applyRingColor(pendingColorRef.current);
          pendingColorRef.current = null;
        }
      };
      mv.addEventListener("load", handler);
      return () => mv.removeEventListener("load", handler);
    };
    // small delay so ref is set
    const t = setTimeout(checkModel, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    const container = dotsRef.current;
    if (!container || container.children.length > 0) return;
    const total = ringColors.length;
    ringColors.forEach((color, i) => {
      const angle = (i / total) * 360 - 90;
      const rad = angle * (Math.PI / 180);
      const dot = document.createElement("div");
      dot.className = "color-ring-dot" + (i === 0 ? " active" : "");
      dot.style.background = color;
      dot.style.left = (50 + 46 * Math.cos(rad)) + "%";
      dot.style.top = (50 + 46 * Math.sin(rad)) + "%";
      dot.style.transform = "translate(-50%,-50%)";
      dot.title = color;
      dot.addEventListener("click", () => {
        container.querySelectorAll(".color-ring-dot").forEach((d) => { d.classList.remove("active"); });
        dot.classList.add("active");
        applyRingColor(color);
      });
      container.appendChild(dot);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hm-hero" style={{ minHeight: "auto", paddingBottom: 0 }}>
        <div className="hm-hero-text" style={{ padding: "20px 24px 0", marginBottom: 0 }}>
          <div className="hm-hero-badge sr">Premium Windows</div>
          <h1 className="sr d1" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(3rem,9vw,7rem)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: .9, color: "var(--accent)", marginBottom: 20 }}>
            Built for<br />Canadian weather.
          </h1>
          <p className="sr d2" style={{ fontSize: "1.1rem", color: "rgba(0,0,0,.5)", maxWidth: 520, margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            Engineered for Canadian climate. Designed to transform your home with light, comfort, and silence.
          </p>
        </div>
        <div className="rv-hero-vid" style={{ position: "relative", marginTop: 24, background: "var(--white)", overflow: "hidden" }}>
          <video autoPlay muted playsInline loop style={{ display: "block", width: "100%", height: "75vh", objectFit: "contain", background: "var(--white)", transform: "scale(1.05)" }}>
            <source src="/assets/windows-weather.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="sr d3" style={{ textAlign: "center", padding: "24px 24px 48px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <a className="hm-cta-ghost" onClick={() => document.getElementById("win-products")?.scrollIntoView({ behavior: "smooth" })} style={{ cursor: "pointer" }}>Explore styles ›</a>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="hm-stats-strip sr" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        {[
          { n: <><span className="hm-count" data-target="1000000">1,000,000</span><sup>+</sup></>, l: "Windows Supplied" },
          { n: "Fastest", l: "Turnaround" },
          { n: <span style={{ color: "var(--accent)" }}>Energy Star</span>, l: "Certified" },
          { n: "Zero!", l: "Delays. Ever." },
        ].map((s, i) => (
          <div key={i} className={`hm-strip-item sr d${i + 1}`}>
            <div className="hm-strip-n" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>{s.n}</div>
            <div className="hm-strip-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Series Grid ── */}
      <section id="win-products" style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", overflow: "hidden" }}>
        <div className="center" style={{ marginBottom: 48 }}>
          <p className="ch-label sr">Unbeatable Technology</p>
          <h2 className="ch-h sr" style={{ color: "var(--ink)" }}>Best windows on the <em style={{ color: "var(--accent)" }}>market.</em></h2>
          <p className="sr d1" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>We don&apos;t compromise quality. Every Velara window is built with the most advanced LoĒ® glass options and Energy Star® certification — the most advanced glazing technology available.</p>
        </div>
        <div className="series-grid sr d2">
          {[
            { tag: "Most Advanced", title: "V Series", img: "/assets/v-series.png", desc: "Our most advanced, modern design. Engineered with the latest technology for unmatched performance, sleek aesthetics, and the cleanest sightlines available. Built for homeowners who demand the very best.", product: "V Series Window" },
            { tag: "Most Popular", title: "Signature Series", img: "/assets/signature-series.png", desc: "Our most popular option for Canadian homes. Classic styling with proven durability, premium features, and exceptional value. The trusted choice for renovations and new builds across Ontario.", product: "Signature Series Window" },
            { tag: "Aluminum Division", title: "Lumina Series", img: "/assets/lumina-series.png", desc: "Built for our Canadian division and CSA Certified to Canadian standards. Premium thermal-break aluminum windows with slimmer sightlines, stronger frames, and PA66 nylon insulation strips engineered to meet Canadian climate codes.", product: "Lumina Series Window", wide: true },
          ].map((s) => (
            <div key={s.title} className={`series-card${s.wide ? " series-card-wide" : ""}`} style={{ cursor: "pointer" }} onClick={() => openQuote(s.product, "Windows")}>
              <div className="series-img"><img src={s.img} alt={s.title} /></div>
              <div className="series-body">
                <span className="series-tag">{s.tag}</span>
                <h3 className="series-title">{s.title}</h3>
                <p className="series-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LoĒ Glass ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", overflow: "hidden" }}>
        <div className="center" style={{ marginBottom: 48 }}>
          <p className="ch-label sr">Glass Technology</p>
          <h2 className="ch-h sr" style={{ color: "var(--ink)" }}>Premium <em style={{ color: "var(--accent)" }}>LoĒ® glass.</em></h2>
          <p className="sr d1" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>Choose from four advanced Cardinal LoĒ® glass options — engineered to maximize comfort, energy savings, and clarity for any climate or orientation.</p>
        </div>
        <div className="glass-layout sr d2">
          <div className="glass-corner glass-tl">
            <div className="glass-corner-num">01</div>
            <h3 className="glass-corner-title">LoĒ-180®</h3>
            <p className="glass-corner-desc">High solar gain Low-E coating. Perfect for north-facing windows — captures free winter heat while reducing UV damage.</p>
          </div>
          <div className="glass-corner glass-tr">
            <div className="glass-corner-num">02</div>
            <h3 className="glass-corner-title">LoĒ²-272®</h3>
            <p className="glass-corner-desc">The industry standard for year-round comfort. Balanced solar control and insulation for any climate, any orientation.</p>
          </div>
          <div className="glass-center">
            <img src="/assets/loe-glass-pane.png" alt="LoĒ Glass Pane" />
          </div>
          <div className="glass-corner glass-bl">
            <div className="glass-corner-num">03</div>
            <h3 className="glass-corner-title">LoĒ³-366®</h3>
            <p className="glass-corner-desc">Triple-silver-layer coating. The ultimate in solar heat rejection — keeps homes cooler in summer with maximum clarity.</p>
          </div>
          <div className="glass-corner glass-br">
            <div className="glass-corner-num">04</div>
            <h3 className="glass-corner-title">LoĒ-i89®</h3>
            <p className="glass-corner-desc">Inboard fourth-surface coating. Adds an extra performance layer for unmatched thermal efficiency in extreme climates.</p>
          </div>
        </div>
      </section>

      {/* ── Colour Ring ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", overflow: "hidden" }}>
        <div className="center" style={{ marginBottom: 36 }}>
          <p className="ch-label sr">Customization</p>
          <h2 className="ch-h sr" style={{ color: "var(--ink)" }}>Endless colour <em style={{ color: "var(--accent)" }}>designs &amp; sizes.</em></h2>
          <p className="sr d1" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 520, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>Match any home. From classic white to bold black and every shade between — 60+ colours, dual-tone options, and custom sizes built to order.</p>
        </div>
        <div className="color-ring-wrap sr d2" style={{ position: "relative" }}>
          <div className="color-ring">
            <div className="color-ring-dots" ref={dotsRef} />
            <div className="color-ring-window">
              {mounted && (
                /* @ts-expect-error model-viewer custom element */
                <model-viewer
                  ref={(el: HTMLElement | null) => { modelRef.current = el; }}
                  src="/assets/windows/picture/PictureWindow_Model_1.gltf"
                  alt="Picture window 3D"
                  camera-controls
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="30deg"
                  camera-orbit="0deg 90deg 3.7m"
                  min-camera-orbit="auto auto 3.7m"
                  max-camera-orbit="auto auto 3.7m"
                  disable-zoom
                  environment-image="neutral"
                  shadow-intensity="0"
                  exposure="1.2"
                  style={{ width: "100%", height: "100%", "--poster-color": "transparent" } as React.CSSProperties}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Showcase Video ── */}
      <section style={{ background: "var(--ink)", textAlign: "center", paddingTop: "clamp(48px,6vw,72px)" }}>
        <p className="ch-label sr" style={{ color: "rgba(255,255,255,.4)" }}>Crafted With Precision</p>
        <h2 className="ch-h sr" style={{ color: "var(--white)" }}>See the <em style={{ color: "var(--accent)", fontStyle: "italic" }}>difference.</em></h2>
        <div style={{ position: "relative", marginTop: 24, maxWidth: 1200, marginLeft: "auto", marginRight: "auto", overflow: "hidden" }}>
          <video autoPlay muted playsInline loop style={{ display: "block", width: "100%", height: "auto", maxHeight: "80vh", objectFit: "contain" }}>
            <source src="/assets/window-showcase.mp4" type="video/mp4" />
          </video>
          <div className="rv-blend-side" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to right,var(--ink) 0%,transparent 100%)" }} />
          <div className="rv-blend-side" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to left,var(--ink) 0%,transparent 100%)" }} />
          <div className="rv-blend-tb" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to bottom,var(--ink) 0%,transparent 100%)" }} />
          <div className="rv-blend-tb" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to top,var(--ink) 0%,transparent 100%)" }} />
        </div>
      </section>

      {/* ── Seasons ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 0", background: "var(--ink)" }}>
        <div style={{ textAlign: "center", marginBottom: 36, padding: "0 max(24px,calc((100vw - 1200px)/2))" }}>
          <p className="ch-label sr" style={{ color: "rgba(255,255,255,.4)" }}>Performance Year-Round</p>
          <h2 className="ch-h sr" style={{ color: "var(--white)" }}>Built for <em style={{ color: "var(--accent)" }}>every season.</em></h2>
          <p className="sr d1" style={{ fontSize: ".97rem", color: "rgba(255,255,255,.5)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>Canadian weather doesn&apos;t take a day off. Neither do our windows.</p>
        </div>
        <div className="season-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, padding: "0 max(24px,calc((100vw - 1200px)/2))" }}>
          {seasons.map((s, i) => (
            <div key={s.key} className={`season-card season-${s.key} sr d${i + 1}`} style={{ background: s.bg, borderColor: s.border }}>
              <div className="season-particles">
                {Array.from({ length: 12 }).map((_, j) => <span key={j} />)}
              </div>
              <div className="season-icon">{s.icon}</div>
              <h3 className="season-title">{s.title}</h3>
              <p className="season-temp">{s.temp}</p>
              <ul className="season-list">
                {s.list.map((item, li) => <li key={li}>{item}</li>)}
              </ul>
              <div className="season-stat">
                <span className="season-stat-n">{s.statN}</span>
                <span className="season-stat-l">{s.statL}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Advantage ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)" }}>
        <div className="center" style={{ marginBottom: 0 }}>
          <p className="ch-label">The Velara Advantage</p>
          <h2 className="ch-h center" style={{ color: "var(--accent)" }}>Built for<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>homeowners.</em></h2>
          <p style={{ fontSize: ".97rem", color: "rgba(0,0,0,.5)", maxWidth: 580, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>We&apos;re not a big-box retailer. We&apos;re a Canadian manufacturer who builds every window with your comfort, savings, and home value in mind.</p>
        </div>
        <div className="perks-grid">
          {perks.map((p, i) => (
            <div key={i} className={`perk sr d${(i % 3) + 1}`}>
              <div className="perk-ico"><svg viewBox="0 0 24 24"><path d={p.icon} /></svg></div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)" }}>
        <div className="center" style={{ marginBottom: 36 }}>
          <p className="ch-label sr">Our Process</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>Four steps to <em style={{ color: "var(--accent)", fontStyle: "italic" }}>perfection.</em></h2>
          <p className="sr" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.7)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>A seamless process designed around your schedule — not ours.</p>
        </div>
        <div className="tl-wrap">
          <div className="tl-line" />
          <div className="tl-line-fill" data-tl="" />
          {[
            { n: 1, h: "Choose your style", p: "Customize colour, style and design with help from our window experts. Explore every option in our showroom." },
            { n: 2, h: "Approve estimate", p: "Transparent pricing that fits your budget — no hidden fees, no surprises. Factory-direct means no middleman markups." },
            { n: 3, h: "We measure & manufacture", p: "Precise measurements taken at your home. Your windows custom built at our Ontario facility to the exact millimetre." },
            { n: 4, h: "Professional installation", p: "We work around your schedule. Clean, professional, with full cleanup included. Backed by our 25-year warranty." },
          ].map((s) => (
            <div key={s.n} className="tl-step">
              <div className="tl-dot"><span>{s.n}</span></div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
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
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <div key={col} className="hm-test-col">
                <div className={`hm-test-card hm-test-card-img hm-test-card-${col % 2 === 0 ? "xl" : "lg"}`}>
                  <img src={galleryImages[col % galleryImages.length].src} alt={galleryImages[col % galleryImages.length].alt} loading="lazy" />
                </div>
                <div className={`hm-test-card hm-test-card-img hm-test-card-${col % 2 === 0 ? "lg" : "xl"}`}>
                  <img src={galleryImages[(col + 3) % galleryImages.length].src} alt={galleryImages[(col + 3) % galleryImages.length].alt} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA ── */}
      <section className="rv-dark-cta" style={{ background: "var(--ink)", padding: "clamp(48px,6vw,72px) 24px", textAlign: "center", borderRadius: "var(--radius-lg)", maxWidth: 1200, margin: "0 auto clamp(36px,5vw,64px)" }}>
        <h2 className="sr" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: "var(--white)", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 12 }}>Your perfect window <em style={{ color: "var(--accent)" }}>awaits.</em></h2>
        <p className="sr d1" style={{ fontSize: "1rem", color: "rgba(255,255,255,.5)", maxWidth: 480, margin: "0 auto 32px", fontWeight: 300, lineHeight: 1.7 }}>Book a free consultation and a window expert will help you find the right style, glass, and frame for your home.</p>
        <div className="sr d2" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="hm-cta-primary">Get a free estimate ›</Link>
          <a href="tel:4165007610" className="hm-cta-ghost" style={{ borderColor: "rgba(255,255,255,.2)", color: "var(--white)" }}>Call 416-500-7610 ›</a>
        </div>
      </section>
    </div>
  );
}
