"use client";
import { useEffect } from "react";

export function useCountUp() {
  useEffect(() => {
    function hmCountUp(el: Element) {
      const target = +(el as HTMLElement).dataset.target!;
      const dur = target > 1000 ? 3200 : 2400;
      const start = performance.now();
      (function step(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        (el as HTMLElement).textContent =
          target > 999
            ? Math.round(ease * target).toLocaleString()
            : String(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(step);
        else
          (el as HTMLElement).textContent =
            target > 999 ? target.toLocaleString() : String(target);
      })(start);
    }

    function checkCounts() {
      document
        .querySelectorAll(".hm-stat:not(.counted), .hm-strip-item:not(.counted)")
        .forEach((stat) => {
          if (stat.getBoundingClientRect().top < window.innerHeight * 0.88) {
            stat.classList.add("counted");
            stat.querySelectorAll(".hm-count").forEach((el) => hmCountUp(el));
          }
        });
    }

    window.addEventListener("scroll", checkCounts, { passive: true });
    setTimeout(checkCounts, 300);
    return () => window.removeEventListener("scroll", checkCounts);
  }, []);
}
