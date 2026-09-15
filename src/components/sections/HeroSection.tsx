import { images } from "@/data/assets";
import styles from "./HeroSection.module.css";
import { MediaImage } from "@/components/ui/MediaImage";
import { HeroScrollScene } from "@/motion/hero/HeroScrollScene";
import { NorefestWordmark } from "@/components/ui/NorefestWordmark";

const HERO_WAVE_HEIGHTS = [
  150, 155, 158, 160, 160, 158, 153, 146, 137, 126, 116, 105, 97, 90, 85,
  83, 83, 86, 90, 94, 99, 102, 104, 104, 101, 95, 88, 78, 68, 57, 47, 39,
  32, 28, 26, 27, 30, 34, 38, 43, 46, 48,
] as const;

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
          {HERO_WAVE_HEIGHTS.map((height, i) => (
            <i key={i} style={{ height: `${height}px` }} />
          ))}
        </div>
        <p className={styles.belong}>A<br />PLACE<br />TO<br />BELONG</p>
        <div className={styles.goodTimes}>
          <span className={styles.compass} aria-hidden="true" />
          <p>GOOD<br />PEOPLE<br />BETTER<br />TIMES</p>
        </div>
        <div className={styles.center}>
          <p className={styles.eyebrow}>IRISH HOUSE</p>
          <h1 className={styles.wordmark} aria-label="Norefest">
            <NorefestWordmark id="norefest-fringe" />
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
