"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** delay before typing starts (ms) */
  startDelay?: number;
  /** only begin once this is true */
  start?: boolean;
  className?: string;
  showCaret?: boolean;
  onDone?: () => void;
}

// Types a string out character by character. Used for the greeting, the chat
// prompt, and streamed-in answers.
export default function TypingText({
  text,
  speed = 55,
  startDelay = 0,
  start = true,
  className,
  showCaret = true,
  onDone,
}: TypingTextProps) {
  const [count, setCount] = useState(0);
  const [begun, setBegun] = useState(startDelay === 0);

  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setBegun(true), startDelay);
    return () => clearTimeout(t);
  }, [start, startDelay]);

  useEffect(() => {
    if (!start || !begun) return;
    if (count >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, begun, start, text, speed]);

  const done = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCaret && !done && begun && <span className="caret">&nbsp;</span>}
    </span>
  );
}
