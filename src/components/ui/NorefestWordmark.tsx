/** Shared lettering keeps the loading-to-hero handoff visually identical. */
export function NorefestWordmark({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 1240 200" aria-hidden="true" data-brand-wordmark>
      <defs>
        <filter id={id} x="-2%" y="-20%" width="104%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.12 0.002" numOctaves="1" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <text x="20" y="166" textLength="1200" lengthAdjust="spacingAndGlyphs" filter={`url(#${id})`}
        style={{ fontFamily: '"Arial Black", Impact, sans-serif', fontSize: 200, fontWeight: 1000 }}>
        NOREFEST
      </text>
    </svg>
  );
}
