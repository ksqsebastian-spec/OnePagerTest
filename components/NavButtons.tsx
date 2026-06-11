"use client";

import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  action: "portfolio" | "contact" | "booking" | "about";
}

const ITEMS: NavItem[] = [
  { label: "Portfolio", action: "portfolio" },
  { label: "Call me", action: "contact" },
  { label: "Book an Appointment", action: "booking" },
  { label: "About us", action: "about" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// Black pills that fade in gently on intro, then glide between a vertical stack
// (idle) and a horizontal row (tool). Entrance is opacity-only so it never
// fights the layout transform — keeps the motion calm and clean.
export default function NavButtons({
  show,
  active,
  orientation,
  onSelect,
}: {
  show: boolean;
  active: NavItem["action"] | null;
  orientation: "vertical" | "horizontal";
  onSelect: (item: NavItem) => void;
}) {
  return (
    <div
      className={[
        "flex gap-3",
        orientation === "vertical" ? "flex-col items-start" : "flex-row flex-wrap items-center",
      ].join(" ")}
    >
      {ITEMS.map((item, i) => {
        const isActive = active === item.action;
        return (
          <motion.button
            key={item.action}
            type="button"
            layout
            onClick={() => onSelect(item)}
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{
              opacity: { delay: 0.2 + 0.12 * i, duration: 0.7, ease: EASE },
              layout: { duration: 0.8, ease: EASE },
            }}
            whileTap={{ scale: 0.98 }}
            className={[
              "rounded-full px-6 py-3 text-base font-medium transition-colors duration-300 md:text-lg",
              isActive
                ? "bg-white text-ink ring-1 ring-hairline-strong"
                : "bg-ink text-on-dark hover:bg-black",
            ].join(" ")}
          >
            {item.label}
          </motion.button>
        );
      })}
    </div>
  );
}
