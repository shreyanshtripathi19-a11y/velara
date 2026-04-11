"use client";
import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DarkCTA, Timeline } from "@/components/Sections";

/* ── data ── */
const comparisonRows = [
  { velara: "Factory-direct pricing", label: "Price", them: "Retail markup (30-50%)" },
  { velara: "4-8 days", label: "Lead Time", them: "8-12 weeks" },
  { velara: "25-year comprehensive", label: "Warranty", them: "5-10 years limited" },
  { velara: "Unlimited custom options", label: "Custom", them: "Limited stock sizes" },
  { velara: "Direct from our team", label: "Support", them: "Call centre runaround" },
  { velara: "Visit our showroom", label: "Experience", them: "Online catalogue only" },
];

const qualityPerks = [
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "25-Year Warranty", desc: "Glass, frame, hardware, and seal failure — all covered. One of the most comprehensive warranties in the Canadian fenestration industry. We stand behind every product we build." },
  { icon: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4l-10 10.01-3-3", title: "Pre-Delivery Inspection", desc: "Every single unit is inspected before it leaves the factory. We check seals, hardware operation, glass clarity, and frame integrity. Defects don't make it to your doorstep." },
  { icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5", title: "Energy Star Certified", desc: "Every window meets or exceeds Energy Star standards for Canadian climate zones. Lower energy bills, smaller carbon footprint, and a home that stays comfortable year-round." },
  { icon: "M12 12a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z", title: "Custom Everything", desc: "Any size. Any colour. Any configuration. Because we manufacture in-house, there's no \"standard catalogue\" limiting your choices. If you can dream it, we can build it." },
  { icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 3a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", title: "Expert Installation Crew", desc: "Our certified installers are Velara employees — not subcontractors. They know our products inside and out. Clean work, on schedule, and they don't leave until you sign off." },
  { icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.34 12 19.79 19.79 0 011.27 3.36 2 2 0 013.26 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z", title: "Same-Day Response", desc: "Call, text, or email — we respond the same day. No automated phone trees, no ticket numbers. You talk to real people who know your project and care about getting it done right." },
];

const timelineSteps = [
  { title: "Free consultation & estimate", desc: "Visit our showroom or book a home consultation. We measure, assess, and provide a detailed quote — no pressure, no hidden fees, no obligation." },
  { title: "Custom manufacturing", desc: "Your order goes straight to our Canadian factory. Every window and door is built to your exact specifications — custom sizes, colours, glass types, and hardware." },
  { title: "Quality inspection & delivery", desc: "Every unit is inspected before it leaves the factory. We deliver directly to your home or job site — no damaged products from long supply chains." },
  { title: "Professional installation", desc: "Our certified installation crew handles everything. Clean, efficient, and backed by our 25-year warranty. We don't leave until you're completely satisfied." },
];

const statCards = [
  { value: "20-40%", desc: "Less than retail\npricing" },
  { value: "0", desc: "Middlemen\ninvolved" },
  { value: "100%", desc: "Canadian\nmanufactured" },
  { value: "1", desc: "Source for\neverything" },
];

/* ── component ── */
export default function WhyUsPage() {
  useScrollReveal();

  /* word-by-word hero animation */
  const heroRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.querySelectorAll(".whyus-hero-word").forEach(w => w.classList.add("animate")); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* comparison row animation */
  const compRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = compRef.current;
    if (!wrap) return;
    const rows = wrap.querySelectorAll<HTMLElement>(".whyus-compare-row");
    rows.forEach((el, i) => { el.style.setProperty("--delay", `${Math.floor(i / 3) * 0.1}s`); });
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("in-view"); obs.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    rows.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* progress bar fill */
  const barsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = barsRef.current;
    if (!wrap) return;
    const bars = wrap.querySelectorAll<HTMLElement>(".whyus-bar-fill");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("in-view"); obs.unobserve(e.target); } }),
      { threshold: 0.3 }
    );
    bars.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* stat cards stagger + float */
  const statCardsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = statCardsRef.current;
    if (!wrap) return;
    const cards = wrap.querySelectorAll<HTMLElement>(".whyus-stat-card");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const all = Array.from((e.target as HTMLElement).parentElement!.querySelectorAll(".whyus-stat-card"));
          const idx = all.indexOf(e.target as HTMLElement);
          setTimeout(() => {
            (e.target as HTMLElement).classList.add("in-view");
            setTimeout(() => (e.target as HTMLElement).classList.add("floating"), 500);
          }, idx * 80);
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    cards.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* trust count-up */
  const trustRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef(new Set<Element>());
  const animateCount = useCallback((el: HTMLElement) => {
    const target = parseFloat(el.dataset.target || "0");
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = eased * target;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const wrap = trustRef.current;
    if (!wrap) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting && !countedRef.current.has(e.target)) {
          countedRef.current.add(e.target);
          const el = (e.target as HTMLElement).querySelector<HTMLElement>(".whyus-count");
          if (el) animateCount(el);
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.4 }
    );
    wrap.querySelectorAll(".whyus-trust-stat").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [animateCount]);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ padding: "110px 24px clamp(32px,4vw,48px)", background: "var(--white)", textAlign: "center" }}>
        <p className="ch-label sr">Why Velara</p>
        <h1
          ref={heroRef}
          className="sr whyus-hero-title"
          style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1.08, margin: "0 auto", maxWidth: 800 }}
        >
          <span className="whyus-hero-word" style={{ "--d": "0s" } as React.CSSProperties}>We</span>{" "}
          <span className="whyus-hero-word" style={{ "--d": "0.08s" } as React.CSSProperties}>don&apos;t</span>{" "}
          <span className="whyus-hero-word" style={{ "--d": "0.16s" } as React.CSSProperties}>just</span>{" "}
          <span className="whyus-hero-word" style={{ "--d": "0.24s" } as React.CSSProperties}>sell</span>{" "}
          <span className="whyus-hero-word" style={{ "--d": "0.32s" } as React.CSSProperties}>windows.</span>
          <br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
            <span className="whyus-hero-word" style={{ "--d": "0.4s" } as React.CSSProperties}>We</span>{" "}
            <span className="whyus-hero-word" style={{ "--d": "0.48s" } as React.CSSProperties}>make</span>{" "}
            <span className="whyus-hero-word" style={{ "--d": "0.56s" } as React.CSSProperties}>them.</span>
          </em>
        </h1>
        <p className="sr" style={{ fontSize: "clamp(1rem,1.2vw,1.15rem)", color: "rgba(0,0,0,.7)", maxWidth: 620, margin: "20px auto 0", fontWeight: 300, lineHeight: 1.7 }}>
          Most companies are middlemen. We&apos;re the manufacturer. That means better prices, faster turnaround, and quality we stand behind — because our name is on every product.
        </p>
      </section>

      {/* ── Factory Direct ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="whyus-factory-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,5vw,72px)", alignItems: "center" }}>
          <div className="sr">
            <p className="ch-label">Direct From the Source</p>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 20 }}>
              Factory direct.<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>No middlemen.</em>
            </h2>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: 16 }}>Most window companies are resellers. They buy from a manufacturer, add their markup, and sell it to you at inflated prices. You&apos;re paying for their margins, their warehouse, their sales team — none of which improve your windows.</p>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: 16 }}>We cut all of that out. <span style={{ color: "var(--accent)", fontWeight: 500 }}>Velara</span> owns and operates the factory. Every window, every door, every component is manufactured in our Canadian facility by our team. When you buy from us, you&apos;re buying from the people who actually build the product.</p>
            <p style={{ fontSize: ".95rem", color: "var(--ink)", lineHeight: 1.8, fontWeight: 500 }}>The result? You save 20-40% compared to competitors selling the same quality through retail channels.</p>
          </div>
          <div ref={statCardsRef} className="sr d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {statCards.map((s) => (
              <div key={s.value} className="whyus-stat-card" style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-md)", padding: "32px 24px", textAlign: "center" }}>
                <span className="rv-stat-val" style={{ fontFamily: "var(--font-d)", fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", display: "block" }}>{s.value}</span>
                <p style={{ fontSize: ".78rem", color: "rgba(0,0,0,.6)", marginTop: 8, lineHeight: 1.4, whiteSpace: "pre-line" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 32 }}>
          <p className="ch-label sr">See the Difference</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>Velara vs.<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>everyone else.</em></h2>
        </div>
        <div ref={compRef} style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--rule)" }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", background: "var(--accent)", borderBottom: "1px solid rgba(255,255,255,.15)", fontWeight: 800, fontSize: ".85rem", color: "#fff", textAlign: "center", letterSpacing: ".08em", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/assets/velara-logo.png" alt="Velara" style={{ height: 22, filter: "brightness(0) invert(1)" }} /></div>
            <div style={{ padding: "20px 24px", background: "rgba(75,40,109,.06)", borderBottom: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)", borderRight: "1px solid var(--rule)", fontWeight: 600, fontSize: ".75rem", color: "rgba(0,0,0,.5)", textAlign: "center", display: "flex", alignItems: "center" }}>vs</div>
            <div style={{ padding: "20px 24px", background: "var(--white)", borderBottom: "1px solid var(--rule)", fontWeight: 600, fontSize: ".85rem", color: "rgba(0,0,0,.6)", textAlign: "center" }}>Typical Retailer</div>
            {/* Rows */}
            {comparisonRows.map((row, i) => {
              const isLast = i === comparisonRows.length - 1;
              return (
                <div key={row.label} style={{ display: "contents" }}>
                  <div className="whyus-compare-row" style={{ padding: "20px 24px", background: "var(--accent)", borderBottom: isLast ? undefined : "1px solid rgba(255,255,255,.15)", fontSize: ".88rem", color: "#fff", fontWeight: 500, textAlign: "center", borderRadius: isLast ? "0 0 0 var(--radius-lg)" : undefined }}>{row.velara}</div>
                  <div className="whyus-compare-row" style={{ padding: "20px 8px", background: "rgba(75,40,109,.06)", borderBottom: isLast ? undefined : "1px solid var(--rule)", borderLeft: "1px solid var(--rule)", borderRight: "1px solid var(--rule)", fontSize: ".75rem", color: "rgba(0,0,0,.5)", textAlign: "center" }}>{row.label}</div>
                  <div className="whyus-compare-row" style={{ padding: "20px 24px", background: "var(--white)", borderBottom: isLast ? undefined : "1px solid var(--rule)", fontSize: ".88rem", color: "rgba(0,0,0,.6)", textAlign: "center" }}>{row.them}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Turnaround ── */}
      <section style={{ padding: "clamp(48px,6vw,80px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="whyus-turnaround-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,5vw,72px)", alignItems: "center" }}>
          <div className="sr d2 rv-order-2" style={{ order: 2 }}>
            <p className="ch-label">Speed That Wins</p>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 20 }}>
              Industry-leading<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>turnaround.</em>
            </h2>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: 16 }}>Time is money — especially during a renovation. While other companies quote 8-12 weeks because they&apos;re waiting on overseas shipments and third-party manufacturers, your <span style={{ color: "var(--accent)", fontWeight: 500 }}>Velara</span> order goes from quote to factory floor the same week.</p>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: 16 }}>We control the entire production line. No waiting on distributors. No container ships. No customs delays. Your windows are manufactured right here in Canada, inspected by our team, and delivered directly to your door.</p>
            <p style={{ fontSize: ".95rem", color: "var(--ink)", lineHeight: 1.8, fontWeight: 500 }}>Standard orders ship in 4-8 days. Rush orders even faster.</p>
          </div>
          <div ref={barsRef} className="sr rv-order-1" style={{ order: 1, position: "relative", padding: "32px 0" }}>
            <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-lg)", padding: 32, marginBottom: 20 }}>
              <p style={{ fontSize: ".7rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 12 }}>Velara</p>
              <div style={{ background: "rgba(0,0,0,.04)", borderRadius: 100, height: 12, overflow: "hidden", marginBottom: 8 }}>
                <div className="whyus-bar-fill" style={{ "--target-width": "7%", height: "100%", background: "var(--accent)", borderRadius: 100 } as React.CSSProperties} />
              </div>
              <p style={{ fontSize: ".85rem", color: "var(--ink)", fontWeight: 600 }}>4-8 days <span style={{ color: "rgba(0,0,0,.5)", fontWeight: 300 }}>average</span></p>
            </div>
            <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-lg)", padding: 32 }}>
              <p style={{ fontSize: ".7rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(0,0,0,.5)", fontWeight: 600, marginBottom: 12 }}>Industry Average</p>
              <div style={{ background: "rgba(0,0,0,.04)", borderRadius: 100, height: 12, overflow: "hidden", marginBottom: 8 }}>
                <div className="whyus-bar-fill" style={{ "--target-width": "85%", height: "100%", background: "rgba(0,0,0,.12)", borderRadius: 100 } as React.CSSProperties} />
              </div>
              <p style={{ fontSize: ".85rem", color: "rgba(0,0,0,.6)", fontWeight: 600 }}>8-12 weeks <span style={{ fontWeight: 300 }}>average</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quality Promise Perks ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 32 }}>
          <p className="ch-label sr">Our Promise</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>Quality you can<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>count on.</em></h2>
          <p className="sr" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.7)", maxWidth: 600, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>Every <span style={{ color: "var(--accent)", fontWeight: 500 }}>Velara</span> product comes with guarantees that go far beyond the industry standard.</p>
        </div>
        <div className="perks-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
          {qualityPerks.map((p, i) => (
            <div key={p.title} className={`perk sr d${(i % 3) + 1}`}>
              <div className="perk-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={p.icon} /></svg></div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <Timeline heading="From quote to" headingEm="installed." sub="A seamless process designed around your schedule — not ours." steps={timelineSteps} />

      {/* ── Showroom ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="whyus-showroom-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,4vw,56px)", alignItems: "center" }}>
          <div className="sr">
            <p className="ch-label">Visit Us</p>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 20 }}>
              See it. Touch it.<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>Trust it.</em>
            </h2>
            <p style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", lineHeight: 1.7, fontWeight: 300, marginBottom: 24 }}>
              Pictures don&apos;t do our products justice. Visit our <span style={{ color: "var(--accent)", fontWeight: 500 }}>Velara</span> showroom in Concord to see every window style, touch every finish, test the hardware, and talk directly to the people who build them. No salespeople on commission — just experts who care about getting it right.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <div><strong style={{ fontSize: ".9rem", color: "var(--ink)" }}>200 Connie Crescent, Unit 7</strong><p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 2 }}>Concord, ON L4K 1L3</p></div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <div><strong style={{ fontSize: ".9rem", color: "var(--ink)" }}>Mon – Fri: 9AM – 7PM</strong><p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 2 }}>Sat: 10AM – 4PM &nbsp;|&nbsp; Sun: By Appointment</p></div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.34 12 19.79 19.79 0 011.27 3.36 2 2 0 013.26 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                <div><strong style={{ fontSize: ".9rem", color: "var(--ink)" }}>416-500-7610</strong><p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 2 }}>Call or text — we respond same day</p></div>
              </div>
            </div>
            <Link href="/contact" className="hm-cta-primary" style={{ display: "inline-block" }}>Book a Showroom Visit →</Link>
          </div>
          <div className="sr d2" style={{ borderRadius: "var(--radius-lg)", height: "clamp(320px,36vw,480px)", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/showroom.png" alt="Velara Showroom — Window displays" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── Trust Stats ── */}
      <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)", borderTop: "1px solid var(--rule)" }}>
        <div className="center" style={{ marginBottom: 32 }}>
          <p className="ch-label sr">Built on Trust</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>The numbers<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>speak.</em></h2>
        </div>
        <div ref={trustRef} className="whyus-trust-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          <div className="sr d1 whyus-trust-stat">
            <span className="whyus-count" data-target="10000" data-suffix="+" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>0</span>
            <p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 8, fontWeight: 400 }}>Windows installed</p>
          </div>
          <div className="sr d2 whyus-trust-stat">
            <span className="whyus-count" data-target="25" data-suffix="yr" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>0</span>
            <p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 8, fontWeight: 400 }}>Product warranty</p>
          </div>
          <div className="sr d3 whyus-trust-stat">
            <span style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.03em" }}>1-2wk</span>
            <p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 8, fontWeight: 400 }}>Average turnaround</p>
          </div>
          <div className="sr d1 whyus-trust-stat">
            <span className="whyus-count" data-target="5.0" data-suffix="★" data-decimals="1" style={{ fontFamily: "var(--font-d)", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>0</span>
            <p style={{ fontSize: ".8rem", color: "rgba(0,0,0,.6)", marginTop: 8, fontWeight: 400 }}>Google rating</p>
          </div>
        </div>
      </section>

      {/* ── Dark CTA ── */}
      <DarkCTA
        heading="Ready to see the"
        headingEm="difference?"
        sub="Get a free estimate or visit our showroom. No pressure, no obligation — just honest answers from the people who build your windows."
        primaryText="Get a Free Estimate →"
        primaryHref="/contact"
        ghostText="Explore Products →"
        ghostHref="/"
      />
    </div>
  );
}
