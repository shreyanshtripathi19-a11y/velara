"use client";
import { useEffect } from "react";

export function usePanelAnimations() {
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 900;
    let ticking = false;

    function hmScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        /* Panel reveal + parallax */
        document.querySelectorAll(".hm-panel").forEach((p) => {
          const r = p.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.85 && r.bottom > 0)
            p.classList.add("vis");
          if (!isMobile()) {
            const bg = p.querySelector<HTMLElement>(".hm-panel-bg");
            if (bg) {
              const progress =
                (window.innerHeight - r.top) / (window.innerHeight + r.height);
              const clampedProgress = Math.min(Math.max(progress, 0), 1);
              const shift = (clampedProgress - 0.5) * -4;
              bg.style.transform = `scale(1.03) translateY(${shift}%)`;
            }
          }
        });

        /* Gallery stagger */
        document.querySelectorAll(".hm-gt:not(.vis)").forEach((el, i) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.93)
            setTimeout(() => el.classList.add("vis"), i * 50);
        });
        ticking = false;
      });
    }

    window.addEventListener("scroll", hmScroll, { passive: true });
    setTimeout(hmScroll, 200);
    return () => window.removeEventListener("scroll", hmScroll);
  }, []);
}
