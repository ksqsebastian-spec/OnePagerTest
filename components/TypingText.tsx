"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  speed?: number;
  startDelay?: number;
  start?: boolean;
  /** Render immediately (reduced motion / after first play). */
  instant?: boolean;
  className?: string;
  showCaret?: boolean;
  onDone?: () => void;
}

export default function TypingText({
  text,
  speed = 50,
  startDelay = 0,
  start = true,
  instant = false,
  className,
  showCaret = true,
  onDone,
}: Props) {
  const [count, setCount] = useState(instant ? text.length : 0);
  const [begun, setBegun] = useState(startDelay === 0);
  const done = useRef(false);

  // Fire onDone exactly once when finished.
  useEffect(() => {
    if (count >= text.length && !done.current) {
      done.current = true;
      onDone?.();
    }
  }, [count, text.length, onDone]);

  useEffect(() => {
    if (instant || !start) return;
    const t = setTimeout(() => setBegun(true), startDelay);
    return () => clearTimeout(t);
  }, [start, startDelay, instant]);

  useEffect(() => {
    if (instant || !start || !begun || count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, begun, start, instant, text.length, speed]);

  const finished = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCaret && !finished && begun && !instant && <span className="caret" />}
    </span>
  );
}
