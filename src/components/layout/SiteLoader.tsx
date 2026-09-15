"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NorefestWordmark } from "@/components/ui/NorefestWordmark";
import { WalkingLonghorn } from "./WalkingLonghorn";
import styles from "./SiteLoader.module.css";

export function SiteLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delay = (ms: number) => new Promise<void>((resolve) => {
      timers.push(setTimeout(resolve, ms));
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroWordmark = document.querySelector<SVGElement>("#hero [data-brand-wordmark]");
    const originalVisibility = heroWordmark?.style.visibility ?? "";
    if (heroWordmark) heroWordmark.style.visibility = "hidden";
    const syncTarget = () => {
      if (!heroWordmark || !loaderRef.current) return;
      const rect = heroWordmark.getBoundingClientRect();
      loaderRef.current.style.setProperty("--wordmark-top", `${rect.top}px`);
      loaderRef.current.style.setProperty("--wordmark-left", `${rect.left}px`);
      loaderRef.current.style.setProperty("--wordmark-width", `${rect.width}px`);
    };
    window.addEventListener("resize", syncTarget);
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("#hero img, [data-loader-animal]"))
      .filter((img) => img.getBoundingClientRect().width > 0);
    const animalImage = new window.Image();
    animalImage.src = "/assets/restaurant/brand/loader-longhorn.png";
    const tasks = [document.fonts.ready, animalImage.decode(), ...images.map((img) => img.decode())];
    let completed = 0;
    const assets = Promise.allSettled(tasks.map(async (task) => {
      try { await task; } finally {
        completed += 1;
        if (!cancelled) setProgress(Math.round(completed / tasks.length * 100));
      }
    }));
    void (async () => {
      await Promise.all([delay(reduced ? 0 : 2800), Promise.race([assets, delay(6000)])]);
      if (cancelled) return;
      await delay(reduced ? 0 : 250);
      if (cancelled) return;
      syncTarget();
      setPhase("leaving");
      await delay(reduced ? 0 : 1650);
      if (cancelled) return;
      if (heroWordmark) heroWordmark.style.visibility = originalVisibility;
      await delay(reduced ? 120 : 650);
      if (!cancelled) setPhase("done");
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", syncTarget);
      if (heroWordmark) heroWordmark.style.visibility = originalVisibility;
    };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <div ref={loaderRef} className={styles.loader} data-site-loader data-phase={phase} data-lenis-prevent role="status" aria-label="Loading Norefest">
        <div className={styles.tiles} aria-hidden="true">
          {Array.from({ length: 240 }, (_, i) => (
            <span key={i} style={{ "--tile-delay": `${((19 - i % 20) * 22 + Math.floor(i / 20) * 13)}ms` } as CSSProperties} />
          ))}
        </div>
        <div className={styles.topCaption} aria-hidden="true">
          <svg viewBox="0 0 88 68" className={styles.mark} fill="none" stroke="currentColor">
            <path d="M8 52 30 14l14 24 14-24 22 38M18 52 37 20M70 52 51 20M8 58h72" />
          </svg>
          <p>A PLACE TO BELONG<br />SEE YOU IN THE EVENING</p>
        </div>
        <div className={styles.scene} aria-hidden="true">
          <WalkingLonghorn />
          <p className={styles.percent}>{progress}%<br /><span>loaded</span></p>
        </div>
        <div className={styles.bottomCaptions} aria-hidden="true">
          <p>IRISH HOUSE<br />AUSTIN, TEXAS</p>
          <p>LOADING THE WEBSITE<br />PLEASE WAIT</p>
        </div>
        <div className={styles.wordmark} aria-hidden="true">
          <NorefestWordmark id="norefest-loader-fringe" />
        </div>
      </div>
      <noscript><style>{"[data-site-loader]{display:none!important}"}</style></noscript>
    </>
  );
}
