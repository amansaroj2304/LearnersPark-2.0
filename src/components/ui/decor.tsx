export function DiamondShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 760 800" fill="none" aria-hidden className={className}>
      <path
        d="M230 30 Q250 8 285 8 L690 8 Q750 8 735 70 L560 740 Q548 785 500 785 L70 785 Q15 785 45 735 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RankInsignia({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" fill="none" aria-hidden className={className}>
      <polygon
        points="50,4 58,26 82,26 63,40 70,63 50,49 30,63 37,40 18,26 42,26"
        fill="currentColor"
      />
      <polygon
        points="5,72 50,98 95,72 95,92 50,118 5,92"
        fill="currentColor"
      />
    </svg>
  );
}

export function TripleChevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 120" fill="none" aria-hidden className={className}>
      <polygon points="30,0 60,18 60,36 30,18 0,36 0,18" fill="currentColor" />
      <polygon points="30,40 60,58 60,76 30,58 0,76 0,58" fill="currentColor" />
      <polygon
        points="30,80 60,98 60,116 30,98 0,116 0,98"
        fill="currentColor"
      />
    </svg>
  );
}

export function HudRing({ className }: { className?: string }) {
  const ticks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={className}>
      <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="1" />
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="2 6"
      />
      <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="1" />
      {ticks.map((i) => {
        const a = (i / ticks.length) * Math.PI * 2;
        const r1 = 88;
        const r2 = i % 6 === 0 ? 72 : 82;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * r1}
            y1={100 + Math.sin(a) * r1}
            x2={100 + Math.cos(a) * r2}
            y2={100 + Math.sin(a) * r2}
            stroke="currentColor"
            strokeWidth="1"
          />
        );
      })}
      <path
        d="M100 16 V34 M100 166 V184 M16 100 H34 M166 100 H184"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function TopoLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {[
        "M-20 90 C120 40 300 150 460 80 C540 45 600 70 640 60",
        "M-20 160 C140 110 320 210 480 150 C560 118 620 140 660 130",
        "M-20 236 C120 190 340 280 500 220 C580 190 640 210 680 200",
        "M-20 320 C140 270 300 360 470 305 C560 275 620 300 660 288",
        "M-20 410 C120 360 340 450 500 395 C580 365 640 388 680 378",
        "M-20 500 C140 455 320 545 480 490 C560 462 620 485 660 474",
        "M-20 588 C120 540 300 630 460 575 C540 548 600 570 640 560",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
