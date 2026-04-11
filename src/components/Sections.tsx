"use client";
import Link from "next/link";
import { useQuoteModal } from "@/context/QuoteModalContext";

interface StatsItem {
  value: string;
  label: string;
}

export default function StatsStrip({ items }: { items: StatsItem[] }) {
  return (
    <div className="hm-stats-strip sr">
      {items.map((item, i) => (
        <div key={i} style={{ display: "contents" }}>
          <div className="hm-strip-item">
            <div className="hm-strip-n" dangerouslySetInnerHTML={{ __html: item.value }} />
            <div className="hm-strip-l">{item.label}</div>
          </div>
          {i < items.length - 1 && <div className="hm-strip-div" />}
        </div>
      ))}
    </div>
  );
}

interface TimelineStep {
  title: string;
  desc: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  heading?: string;
  headingEm?: string;
  sub?: string;
}

export function Timeline({ steps, heading, headingEm, sub }: TimelineProps) {
  return (
    <section style={{ padding: "clamp(48px,5vw,72px) 24px", background: "var(--white)" }}>
      {heading && (
        <div className="center" style={{ marginBottom: 36 }}>
          <p className="ch-label sr">How It Works</p>
          <h2 className="ch-h center sr" style={{ color: "var(--accent)" }}>{heading}<br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>{headingEm}</em></h2>
          {sub && <p className="sr" style={{ fontSize: ".97rem", color: "rgba(0,0,0,.7)", maxWidth: 560, margin: "12px auto 0", fontWeight: 300, lineHeight: 1.7 }}>{sub}</p>}
        </div>
      )}
      <div className="tl-wrap">
        <div className="tl-line" />
        <div className="tl-line-fill" />
        {steps.map((step, i) => (
          <div className="tl-step sr" key={i} style={{ transitionDelay: `${i * 0.15}s` }}>
            <div className="tl-dot">
              <span>{i + 1}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface DarkCTAProps {
  heading?: string;
  headingEm?: string;
  sub?: string;
  primaryText?: string;
  primaryHref?: string;
  ghostText?: string;
  ghostHref?: string;
}

export function DarkCTA({ heading, headingEm, sub, primaryText, primaryHref, ghostText, ghostHref }: DarkCTAProps = {}) {
  const { open } = useQuoteModal();
  return (
    <section
      style={{
        background: "var(--ink)",
        padding: "clamp(48px,6vw,72px) 24px",
        textAlign: "center",
      }}
    >
      <h2
        className="sr"
        style={{
          fontFamily: "var(--font-d)",
          fontSize: "clamp(2rem,4vw,3.2rem)",
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "-.02em",
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {heading || "Ready to Transform Your Space?"}
        {headingEm && <><br /><em style={{ color: "var(--accent)", fontStyle: "italic" }}>{headingEm}</em></>}
      </h2>
      <p
        className="sr"
        style={{
          fontSize: "1rem",
          color: "rgba(255,255,255,.7)",
          maxWidth: 480,
          margin: "0 auto 32px",
          fontWeight: 300,
          lineHeight: 1.7,
        }}
      >
        {sub || "Get your free estimate today. Factory-direct pricing, no middlemen."}
      </p>
      <div className="sr" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {primaryHref ? (
          <Link href={primaryHref} className="hm-cta-primary" style={{ fontSize: "1.1rem", padding: "16px 40px" }}>{primaryText || "Get a Free Estimate →"}</Link>
        ) : (
          <button className="hm-cta-primary" style={{ fontSize: "1.1rem", padding: "16px 40px" }} onClick={() => open()}>{primaryText || "Get Free Estimate"}</button>
        )}
        {ghostText && ghostHref && (
          <Link href={ghostHref} className="hm-cta-ghost" style={{ fontSize: "1.1rem", padding: "16px 40px", color: "#FFFFFF", borderColor: "rgba(255,255,255,.2)" }}>{ghostText}</Link>
        )}
      </div>
    </section>
  );
}

interface PageHeroProps {
  label: string;
  title: string;
  sub?: string;
  bgSrc: string;
  isVideo?: boolean;
}

export function PageHero({ label, title, sub, bgSrc, isVideo }: PageHeroProps) {
  return (
    <section className="ph">
      {isVideo ? (
        <video
          className="ph-bg"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          src={bgSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div className="ph-bg" style={{ backgroundImage: `url(${bgSrc})` }} />
      )}
      <div className="ph-grad" />
      <div className="ph-content">
        <p className="ph-label">{label}</p>
        <h1 className="ph-h">{title}</h1>
        {sub && <p className="ph-sub">{sub}</p>}
      </div>
    </section>
  );
}
