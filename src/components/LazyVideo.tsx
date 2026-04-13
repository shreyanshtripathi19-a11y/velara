"use client";
import { useRef, useEffect, useState } from "react";

interface LazyVideoProps {
  webm?: string;
  mp4?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean; // true = load immediately (hero videos)
}

export default function LazyVideo({
  webm, mp4, autoPlay = true, loop = true, muted = true,
  playsInline = true, className, style, priority = false,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(priority);

  useEffect(() => {
    if (priority || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before visible
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.load();
      if (autoPlay) ref.current.play().catch(() => {});
    }
  }, [visible, autoPlay]);

  return (
    <video
      ref={ref}
      autoPlay={priority && autoPlay}
      muted={muted}
      playsInline={playsInline}
      loop={loop}
      preload={priority ? "auto" : "none"}
      className={className}
      style={style}
    >
      {visible && webm && <source src={webm} type="video/webm" />}
      {visible && mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
}
