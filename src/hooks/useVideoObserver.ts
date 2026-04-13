"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Video controller.
 *
 * Home / Builders pages:
 *   - Hero video (hm-hero-bg):  autoplays immediately, plays once.
 *   - Panel videos (hm-scroll-video): play ONLY when user scrolls
 *     the video into view. Plays once, no loop.
 *
 * All other pages:
 *   - Videos autoplay with loop, force-retry as fallback.
 */
export function useVideoObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const isPlayOncePage = pathname === "/" || pathname === "/builders";

    if (isPlayOncePage) {
      // ── HOME / BUILDERS ──

      // Hero video: plays immediately, remove loop after start
      const heroVid = document.querySelector<HTMLVideoElement>("video.hm-hero-bg");
      let heroCleanup: (() => void) | null = null;
      if (heroVid) {
        const onPlaying = () => {
          setTimeout(() => {
            heroVid.loop = false;
            heroVid.removeAttribute("loop");
          }, 500);
          heroVid.removeEventListener("playing", onPlaying);
        };
        heroVid.addEventListener("playing", onPlaying);
        heroCleanup = () => heroVid.removeEventListener("playing", onPlaying);

        if (heroVid.paused) {
          heroVid.play().catch(() => {
            setTimeout(() => heroVid.play().catch(() => { }), 300);
          });
        }
      }

      // Panel videos: scroll-triggered, play once
      // Wait for first user scroll before enabling the observer
      // so videos visible on initial paint don't autoplay
      let hasScrolled = false;
      let observer: IntersectionObserver | null = null;
      const panelVideos = new Set<HTMLVideoElement>();

      const createObserver = () => {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const vid = entry.target as HTMLVideoElement;
              if (entry.isIntersecting && hasScrolled) {
                vid.currentTime = 0;
                vid.muted = true;
                vid.playsInline = true;
                vid.play().catch(() => {
                  setTimeout(() => vid.play().catch(() => { }), 300);
                });
                observer?.unobserve(vid);
              }
            });
          },
          { threshold: 0.25 }
        );
      };

      const setupPanels = () => {
        createObserver();
        document.querySelectorAll<HTMLVideoElement>("video.hm-scroll-video").forEach((vid) => {
          vid.muted = true;
          vid.playsInline = true;
          vid.setAttribute("muted", "");
          vid.setAttribute("playsinline", "");
          panelVideos.add(vid);
          observer?.observe(vid);
        });
      };

      // Track user scroll
      const onScroll = () => {
        if (!hasScrolled) {
          hasScrolled = true;
          // Re-check all observed videos now that scroll is confirmed
          panelVideos.forEach((vid) => {
            const rect = vid.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
              vid.currentTime = 0;
              vid.muted = true;
              vid.playsInline = true;
              vid.play().catch(() => {
                setTimeout(() => vid.play().catch(() => { }), 300);
              });
              observer?.unobserve(vid);
            }
          });
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      const t1 = setTimeout(setupPanels, 100);

      return () => {
        clearTimeout(t1);
        observer?.disconnect();
        window.removeEventListener("scroll", onScroll);
        if (heroCleanup) heroCleanup();
      };
    } else {
      // ── OTHER PAGES: simple force-autoplay with loop ──
      const forceAutoplay = () => {
        document.querySelectorAll("video").forEach((vid) => {
          vid.muted = true;
          vid.playsInline = true;
          vid.setAttribute("playsinline", "");
          vid.setAttribute("muted", "");
          vid.setAttribute("autoplay", "");
          if (vid.paused) vid.play().catch(() => { });
        });
      };

      forceAutoplay();
      const t1 = setTimeout(forceAutoplay, 300);
      const t2 = setTimeout(forceAutoplay, 1000);
      const t3 = setTimeout(forceAutoplay, 2500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname]);
}
