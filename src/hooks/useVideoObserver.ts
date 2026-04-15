"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Robust video autoplay controller — handles iOS Low Power Mode.
 *
 * iOS Low Power Mode blocks video.play() UNLESS called inside a genuine
 * user-gesture handler (touchstart, click). setTimeout/setInterval retries
 * do NOT count as user gestures.
 *
 * Strategy:
 *   1. IntersectionObserver tracks which videos are in the viewport.
 *   2. When a video enters the viewport → attempt play().
 *   3. If play() is blocked (iOS LPM) → register touchstart/click
 *      listeners that will retry play() for all paused, in-view videos.
 *      These fire inside a real gesture and WILL succeed.
 *   4. Also retry on visibilitychange (tab-refocus), loadeddata, and canplay.
 *
 * Behaviour:
 *   Home / Builders  → hero plays immediately; panel videos (hm-scroll-video)
 *                       play when scrolled into view. ALL play once, no loop.
 *   Other pages       → all videos loop, play when in viewport.
 */

function attemptPlay(vid: HTMLVideoElement): void {
  // Guarantee the attributes iOS needs
  vid.muted = true;
  vid.playsInline = true;
  vid.setAttribute("muted", "");
  vid.setAttribute("playsinline", "");

  if (!vid.paused) return;

  const p = vid.play();
  if (p) {
    p.catch(() => {
      // Reload the source and try once more (helps with cold-cache on iOS)
      vid.load();
      setTimeout(() => vid.play().catch(() => {}), 200);
    });
  }
}

export function useVideoObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const isPlayOncePage = pathname === "/" || pathname === "/builders";

    const inView = new Set<HTMLVideoElement>(); // currently visible
    const played = new Set<HTMLVideoElement>(); // finished (play-once tracking)
    const cleanups: (() => void)[] = [];

    /* ── helpers ─────────────────────────────────────────── */

    /** Play a video, respecting play-once rules */
    const playIfAllowed = (vid: HTMLVideoElement) => {
      if (isPlayOncePage && played.has(vid)) return;
      attemptPlay(vid);
    };

    /** Wire up "ended" listener so we know when a play-once video is done */
    const wirePlayOnce = (vid: HTMLVideoElement) => {
      if (!isPlayOncePage) return;
      // Remove loop so it actually ends
      vid.loop = false;
      vid.removeAttribute("loop");

      const onEnded = () => {
        played.add(vid);
        vid.removeEventListener("ended", onEnded);
      };
      vid.addEventListener("ended", onEnded);
      cleanups.push(() => vid.removeEventListener("ended", onEnded));
    };

    /** Retry-play every paused + in-view video */
    const retryPausedInView = () => {
      inView.forEach((vid) => {
        if (vid.paused) playIfAllowed(vid);
      });
    };

    /* ── IntersectionObserver ────────────────────────────── */

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            inView.add(vid);

            // For play-once panel videos, start from the beginning
            if (isPlayOncePage && vid.classList.contains("hm-scroll-video")) {
              vid.currentTime = 0;
            }

            playIfAllowed(vid);
          } else {
            inView.delete(vid);
            // Pause out-of-view videos on loop pages to save battery/resources
            if (!isPlayOncePage && !vid.paused) {
              vid.pause();
            }
          }
        });
      },
      { threshold: isPlayOncePage ? 0.2 : 0.15 }
    );

    /* ── Setup ──────────────────────────────────────────── */

    const setup = () => {
      const videos = document.querySelectorAll<HTMLVideoElement>("video");

      videos.forEach((vid) => {
        // Guarantee required attributes
        vid.muted = true;
        vid.playsInline = true;
        vid.setAttribute("muted", "");
        vid.setAttribute("playsinline", "");

        // Wire play-once tracking
        wirePlayOnce(vid);

        // Observe visibility
        observer.observe(vid);

        // Also try playing on data-ready events (covers slow loads)
        const onReady = () => {
          if (inView.has(vid) && vid.paused) playIfAllowed(vid);
        };
        vid.addEventListener("loadeddata", onReady);
        vid.addEventListener("canplay", onReady);
        cleanups.push(() => {
          vid.removeEventListener("loadeddata", onReady);
          vid.removeEventListener("canplay", onReady);
        });
      });
    };

    /* ── iOS Low Power Mode fix ──────────────────────────
     * touchstart and click are the ONLY events that count as
     * "user activation" in Safari and can unlock video.play().
     * We listen persistently (not { once }) because on LPM a
     * video might fail again after pausing/tab-switching.
     * ──────────────────────────────────────────────────── */
    const onGesture = () => retryPausedInView();
    document.addEventListener("touchstart", onGesture, { passive: true });
    document.addEventListener("click", onGesture, { passive: true });
    cleanups.push(() => {
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    });

    /* ── Retry on tab re-focus ──────────────────────────── */
    const onVis = () => {
      if (document.visibilityState === "visible") retryPausedInView();
    };
    document.addEventListener("visibilitychange", onVis);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVis));

    /* ── Retry on first few scrolls (catch edge-cases) ─── */
    let scrollCount = 0;
    const onScroll = () => {
      if (scrollCount++ < 10) retryPausedInView();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    /* ── Init with small delay for DOM readiness ────────── */
    const t0 = setTimeout(setup, 50);
    // Timed retries — these won't work on iOS LPM but help on
    // normal browsers with slow network loads
    const t1 = setTimeout(retryPausedInView, 400);
    const t2 = setTimeout(retryPausedInView, 1200);
    const t3 = setTimeout(retryPausedInView, 3000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);
}
