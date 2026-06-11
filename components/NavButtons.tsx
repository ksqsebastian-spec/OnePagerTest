"use client";

import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  /** maps to a generative-UI render target */
  action: "portfolio" | "contact" | "booking" | "about";
}

const ITEMS: NavItem[] = [
  { label: "Portfolio", action: "portfolio" },
  { label: "Call me", action: "contact" },
  { label: "Book an Appointment", action: "booking" },
  { label: "About us", action: "about" },
];

// Black pill buttons that pop in one after another (bottom-left of the canvas).
export default function NavButtons({
  show,
  onSelect,
}: {
  show: boolean;
  onSelect: (item: NavItem) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      {ITEMS.map((item, i) => (
        <motion.button
          key={item.action}
          type="button"
          onClick={() => onSelect(item)}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            delay: 0.12 * i,
            type: "spring",
            stiffness: 420,
            damping: 26,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="rounded-full bg-ink px-6 py-3 text-left text-lg font-medium text-paper shadow-sm transition-colors hover:bg-black md:text-2xl"
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}
