"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type RefObject,
} from "react";
import { gsap, registerGsapPlugins, useGSAP } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import styles from "./motion-footer.module.css";

const marqueeItems = [
  "IRISH SOUL",
  "AUSTIN SPIRIT",
  "GOOD FOOD",
  "PROPER DRINKS",
  "LIVE MUSIC",
  "BETTER TIMES",
];

function useMagnetic<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const move = (event: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = element.getBoundingClientRect();
      gsap.to(element, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.2,
        y: (event.clientY - rect.top - rect.height / 2) * 0.2,
        duration: 0.35,
        ease: "power2.out",
      });
    };
    const leave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.35)",
      });
    };

    element.addEventListener("mousemove", move);
    element.addEventListener("mouseleave", leave);
    return () => {
      element.removeEventListener("mousemove", move);
      element.removeEventListener("mouseleave", leave);
    };
  }, []);

  return ref;
}

const MagneticLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ children, className = "", ...props }, forwardedRef) => {
  const magneticRef = useMagnetic<HTMLAnchorElement>();

  const setRef = (node: HTMLAnchorElement | null) => {
    magneticRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  return (
    <a ref={setRef} className={`${styles.pill} ${className}`} {...props}>
      {children}
    </a>
  );
});
MagneticLink.displayName = "MagneticLink";

function MarqueeTrack() {
  return (
    <div className={styles.marqueeSet} aria-hidden="true">
      {marqueeItems.map((item) => (
        <span key={item}>
          {item}<i>&#10022;</i>
        </span>
      ))}
    </div>
  );
}

export function MotionFooter({ onReserveClick }: { onReserveClick: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reserveRef = useMagnetic<HTMLButtonElement>();
  const { enhanced, ready } = useMotionContext();

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      if (!wrapper || !enhanced || !ready) return;
      registerGsapPlugins();

      gsap.fromTo(
        giantTextRef.current,
        { yPercent: 24, scale: 0.88, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
      gsap.fromTo(
        contentRef.current,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );
    },
    {
      scope: wrapperRef,
      dependencies: [enhanced, ready],
      revertOnUpdate: true,
    },
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div ref={wrapperRef} className={styles.reveal}>
      <footer
        id="contact"
        className={`${styles.footer} theme-dark`}
        data-theme="dark"
        data-header-theme="dark"
      >
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            <MarqueeTrack />
            <MarqueeTrack />
          </div>
        </div>

        <p ref={giantTextRef} className={styles.giantText} aria-hidden="true">
          NOREFEST
        </p>

        <div ref={contentRef} className={styles.content}>
          <p className={styles.eyebrow}>A PLACE TO BELONG / AUSTIN, TEXAS</p>
          <h2 className={styles.heading}>
            READY FOR A
            <br />
            GOOD NIGHT?
          </h2>
          <p className={styles.intro}>
            Pull up a chair for Irish food, proper drinks, live music, and the
            kind of night that runs long.
          </p>

          <div className={styles.primaryLinks}>
            <button
              ref={reserveRef}
              type="button"
              className={`${styles.pill} ${styles.primaryPill}`}
              onClick={onReserveClick}
            >
              RESERVE A TABLE <span aria-hidden="true">&nearr;</span>
            </button>
            <MagneticLink href="#apartments">
              VIEW THE MENU <span aria-hidden="true">&nearr;</span>
            </MagneticLink>
          </div>

          <div className={styles.secondaryLinks}>
            <MagneticLink href="#about">OUR STORY</MagneticLink>
            <MagneticLink href="#benefits">THE HOUSE</MagneticLink>
            <MagneticLink
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              INSTAGRAM
            </MagneticLink>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; 2026 NOREFEST. ALL RIGHTS RESERVED.</p>
          <p>IRISH SOUL. AUSTIN SPIRIT.</p>
          <button
            type="button"
            className={styles.backToTop}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span aria-hidden="true">&uarr;</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
