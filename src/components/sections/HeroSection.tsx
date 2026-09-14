import { images } from "@/data/assets";
import styles from "./HeroSection.module.css";
import { MediaImage } from "@/components/ui/MediaImage";
import { HeroScrollScene } from "@/motion/hero/HeroScrollScene";

export function HeroSection() {
  return (
    <HeroScrollScene
      fallback={
        <>
          <div className="sd-hero__bg sd-only-desk">
            <MediaImage
              src={images.hero.desktop}
              alt=""
              priority
              sizes="100vw"
            />
          </div>
          <div className="sd-hero__bg sd-only-mob">
            <MediaImage
              src={images.hero.mobile}
              alt=""
              priority
              sizes="100vw"
            />
          </div>
          <div className="sd-hero__grad-top" />
          <div className="sd-hero__grad-bot" />
        </>
      }
    >
      <div className={styles.overlay}>
        <div className={styles.wave} aria-hidden="true">
          {Array.from({ length: 42 }, (_, i) => <i key={i} style={{ height: `${Math.max(8, 150 - i * 3 + Math.sin(i / 3) * 23)}px` }} />)}
        </div>
        <p className={styles.belong}>A<br />PLACE<br />TO<br />BELONG</p>
        <div className={styles.goodTimes}>
          <span className={styles.compass} aria-hidden="true" />
          <p>GOOD<br />PEOPLE<br />BETTER<br />TIMES</p>
        </div>
        <div className={styles.center}>
          <p className={styles.eyebrow}>IRISH HOUSE</p>
          <h1 className={styles.wordmark} aria-label="Norefest">
            <svg viewBox="0 0 1240 200" aria-hidden="true">
              <defs>
                <filter id="norefest-fringe" x="-2%" y="-20%" width="104%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.12 0.002" numOctaves="1" seed="8" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <text x="20" y="166" textLength="1200" lengthAdjust="spacingAndGlyphs" filter="url(#norefest-fringe)">NOREFEST</text>
            </svg>
          </h1>
          <p className={styles.tagline}>IRISH SOUL. AUSTIN SPIRIT.</p>
        </div>
        <p className={styles.wallWords}>FOOD<br />DRINK<br />MUSIC<br />PEOPLE</p>
        <div className={styles.bottom}>
          <span className={styles.locationMark} aria-hidden="true" />
          <p>AUSTIN, TEXAS</p>
          <span className={styles.rule} aria-hidden="true" />
          <p>FOOD &middot; DRINK &middot; MUSIC</p>
          <span className={styles.endRule} aria-hidden="true" />
        </div>
        <div className={`${styles.wave} ${styles.waveBottom}`} aria-hidden="true">
          {Array.from({ length: 22 }, (_, i) => <i key={i} style={{ height: `${12 + i * 4}px` }} />)}
        </div>
      </div>
    </HeroScrollScene>
  );
}
