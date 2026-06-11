"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Bold, fully-saturated colour tiles that swap every 10s. Flat solids read as
// intentional brand art against the paper canvas (and swap cleanly for real
// <Image> sources later). No gradients, no shadow — per the system.
const SLIDES = [
  "#ff2d55", // red
  "#0a84ff", // blue
  "#30d158", // green
  "#ffd60a", // yellow
  "#0a0a0a", // ink
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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={show ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-32 w-44 overflow-hidden rounded-xl md:h-44 md:w-64"
    >
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
          style={{ background: SLIDES[i] }}
        />
      </AnimatePresence>
    </motion.div>
  );
}
