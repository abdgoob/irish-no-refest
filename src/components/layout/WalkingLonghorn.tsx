"use client";

import { useEffect, useRef } from "react";
import styles from "./SiteLoader.module.css";

export function WalkingLonghorn() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => { /* Keep the poster if autoplay is blocked. */ });
    };
    syncPlayback();
    preference.addEventListener("change", syncPlayback);
    return () => {
      preference.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      data-loader-video
      src="/assets/video/Animate_Irish_longhorn_walking_20260915145835.mp4"
      poster="/assets/video/longhorn-poster.jpg"
      width={1280}
      height={720}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className={styles.animal}
    />
  );
}
