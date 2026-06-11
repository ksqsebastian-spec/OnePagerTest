"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// A single calm colour accent that drifts slowly through a muted, grown-up
// palette. Long crossfade, unhurried interval — it should feel like light
// changing, not a slideshow. Swap for real <Image> sources later.
const SLIDES = ["#e4572e", "#2a9d8f", "#3a5a9f", "#e9c46a", "#1d1d1f"];

export default function RotatingImage({ show }: { show: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 12_000);
    return () => clearInterval(id);
  }, [show]);

  return (
    <div className="relative h-36 w-52 overflow-hidden rounded-2xl md:h-44 md:w-64">
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: SLIDES[i] }}
        />
      </AnimatePresence>
    </div>
  );
}
