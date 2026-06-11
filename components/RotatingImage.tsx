"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Real stock photography (served from /public so it always loads), switching
// every 10s. Lives directly on the canvas — no frame, no shadow.
const IMAGES = ["/art/01.jpg", "/art/02.jpg", "/art/03.jpg", "/art/04.jpg", "/art/05.jpg"];

export default function RotatingImage({ show }: { show: boolean }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!show || reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % IMAGES.length), 10_000);
    return () => clearInterval(id);
  }, [show, reduce]);

  return (
    <div className="relative h-44 w-60 overflow-hidden rounded-lg bg-[#f0f0f0] md:h-52 md:w-72">
      <AnimatePresence>
        <motion.img
          key={i}
          src={IMAGES[i]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
