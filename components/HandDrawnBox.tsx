"use client";

import { useMemo } from "react";

// A hand-drawn, slightly wobbly rectangle border rendered as an SVG path.
// This gives the chat window its "not a regular window" feel from the sketch.
export default function HandDrawnBox({
  className,
  seed = 7,
}: {
  className?: string;
  seed?: number;
}) {
  const path = useMemo(() => roughRectPath(seed), [seed]);
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Deterministic pseudo-random so SSR and client render the same wobble.
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function roughRectPath(seed: number): string {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 3.2; // jitter amount
  // Slightly overshoot corners so lines look hand-drawn and "open".
  const p = (x: number, y: number) => `${(x + j()).toFixed(2)},${(y + j()).toFixed(2)}`;
  return [
    `M ${p(3, 6)}`,
    `L ${p(35, 4)} ${p(70, 5)} ${p(97, 3)}`, // top
    `L ${p(98, 35)} ${p(96, 70)} ${p(99, 97)}`, // right (with the little flick up-right from the sketch)
    `L ${p(65, 98)} ${p(35, 96)} ${p(2, 97)}`, // bottom
    `L ${p(4, 65)} ${p(2, 35)} ${p(3, 6)}`, // left
  ].join(" ");
}
