"use client";
import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    // Standard scroll-reveal for .sr elements
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".sr:not(.vis)").forEach((el) => obs.observe(el));

    // Timeline step stagger reveal
    document.querySelectorAll(".tl-wrap").forEach((wrap) => {
      const steps = wrap.querySelectorAll(".tl-step");
      if (!steps.length) return;
      let triggered = false;
      const tlObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !triggered) {
              triggered = true;
              steps.forEach((step, idx) => {
                setTimeout(() => step.classList.add("vis"), idx * 350);
              });
              tlObs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      tlObs.observe(steps[0]);
    });

    return () => obs.disconnect();
  }, []);
}
