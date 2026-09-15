import styles from "./SiteLoader.module.css";

/** Articulated cutout: the original striped artwork remains on every limb. */
export function WalkingLonghorn() {
  return (
    <svg viewBox="0 0 1280 1280" className={styles.animal} aria-hidden="true">
      <defs>
        <image id="longhorn-art" href="/assets/restaurant/brand/loader-longhorn.png" width="1280" height="1280" />
        <clipPath id="longhorn-body"><path d="M0 0H1280V650L1010 670 925 655 850 680 720 700 540 720 400 700 300 660 160 700 0 700Z" /></clipPath>
        <clipPath id="longhorn-rear"><path d="M140 640 305 630 430 1040H130Z" /></clipPath>
        <clipPath id="longhorn-rear-far"><path d="M310 650 565 675 700 740 590 1050H410Z" /></clipPath>
        <clipPath id="longhorn-front-far"><path d="M700 645H925L905 1050H680Z" /></clipPath>
        <clipPath id="longhorn-front"><path d="M925 620 1030 630 1110 1040H905Z" /></clipPath>
        <clipPath id="longhorn-tail"><path d="M0 640H140V1050H0Z" /></clipPath>
      </defs>
      <g className={styles.walkBody}>
        <g className={styles.rearFar}><g clipPath="url(#longhorn-rear-far)"><use href="#longhorn-art" /></g></g>
        <g className={styles.frontFar}><g clipPath="url(#longhorn-front-far)"><use href="#longhorn-art" /></g></g>
        <g className={styles.tail}><g clipPath="url(#longhorn-tail)"><use href="#longhorn-art" /></g></g>
        <g clipPath="url(#longhorn-body)"><use href="#longhorn-art" /></g>
        <g className={styles.rearLeg}><g clipPath="url(#longhorn-rear)"><use href="#longhorn-art" /></g></g>
        <g className={styles.frontLeg}><g clipPath="url(#longhorn-front)"><use href="#longhorn-art" /></g></g>
      </g>
    </svg>
  );
}
