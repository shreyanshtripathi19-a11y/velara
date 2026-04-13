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

function forcePlay(vid: HTMLVideoElement) {
  vid.muted = true;
  vid.playsInline = true;
  vid.setAttribute("muted", "");
  vid.setAttribute("playsinline", "");
  if (vid.paused) {
    const p = vid.play();
    if (p) p.catch(() => {
      // iOS sometimes needs the video to be loaded first
      vid.load();
      setTimeout(() => vid.play().catch(() => {}), 200);
    });
  }
}

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

        // Force play hero — very aggressive for iOS
        forcePlay(heroVid);
        setTimeout(() => forcePlay(heroVid), 300);
        setTimeout(() => forcePlay(heroVid), 800);
      }

      // Panel videos: scroll-triggered, play once
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
                forcePlay(vid);
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
          panelVideos.forEach((vid) => {
            const rect = vid.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
              vid.currentTime = 0;
              forcePlay(vid);
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
      const doAutoplay = () => {
        document.querySelectorAll<HTMLVideoElement>("video").forEach((vid) => {
          vid.setAttribute("autoplay", "");
          forcePlay(vid);
        });
      };

      // Aggressive retry — iOS Safari can be very slow
      doAutoplay();
      const t1 = setTimeout(doAutoplay, 200);
      const t2 = setTimeout(doAutoplay, 600);
      const t3 = setTimeout(doAutoplay, 1500);
      const t4 = setTimeout(doAutoplay, 3000);
      const t5 = setTimeout(doAutoplay, 5000);

      // Also listen for loadeddata events
      const handler = (e: Event) => {
        const vid = e.target as HTMLVideoElement;
        if (vid.paused) forcePlay(vid);
      };
      document.querySelectorAll<HTMLVideoElement>("video").forEach((vid) => {
        vid.addEventListener("loadeddata", handler);
      });

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        document.querySelectorAll<HTMLVideoElement>("video").forEach((vid) => {
          vid.removeEventListener("loadeddata", handler);
        });
      };
    }
  }, [pathname]);
}
