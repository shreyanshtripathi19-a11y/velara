"use client";
import { useEffect, useState, useRef } from "react";

export default function NotificationBar() {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("notif_dismissed") === "1") return;
    fetch("/api/settings/notification")
      .then((r) => r.json())
      .then((d) => {
        if (d.enabled && d.text) {
          setText(d.text);
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  // Set CSS variable so navbar knows the offset
  useEffect(() => {
    if (visible && barRef.current) {
      const h = barRef.current.offsetHeight;
      document.documentElement.style.setProperty("--notif-h", `${h}px`);
    } else {
      document.documentElement.style.setProperty("--notif-h", "0px");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={barRef} id="notif-bar" style={{
      background: "linear-gradient(135deg, #6c3ce0 0%, #8b5cf6 100%)",
      color: "#fff",
      textAlign: "center",
      padding: "10px 48px 10px 24px",
      fontSize: "clamp(.78rem, 1.1vw, .88rem)",
      fontWeight: 600,
      letterSpacing: ".04em",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10001,
    }}>
      <span>{text}</span>
      <button
        onClick={() => {
          setVisible(false);
          sessionStorage.setItem("notif_dismissed", "1");
          document.documentElement.style.setProperty("--notif-h", "0px");
        }}
        style={{
          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", color: "rgba(255,255,255,.7)",
          fontSize: "1.1rem", cursor: "pointer", padding: "4px 8px", lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
