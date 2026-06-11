"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Bold, high-contrast placeholder "images" (gradients) that swap every 10s.
// Swap these for real <Image> sources later — the rotation logic stays the same.
const SLIDES = [
  "linear-gradient(135deg, #ff2d55 0%, #ff9500 100%)",
  "linear-gradient(135deg, #0a84ff 0%, #5e5ce6 100%)",
  "linear-gradient(135deg, #30d158 0%, #0a84ff 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #3a3a3c 100%)",
  "linear-gradient(135deg, #ffd60a 0%, #ff2d55 100%)",
];

export default function RotatingImage({ show }: { show: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 10_000);
    return () => clearInterval(id);
  }, [show]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={show ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative h-32 w-44 overflow-hidden rounded-xl md:h-44 md:w-60"
    >
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0"
          style={{ background: SLIDES[i] }}
        />
      </AnimatePresence>
    </motion.div>
  );
}
