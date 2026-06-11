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

// Black pills that pop in on intro, then physically reflow between a vertical
// stack (idle) and a horizontal row (when a tool claims the stage).
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
        "flex gap-2.5",
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
            initial={{ opacity: 0, y: 12 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{
              opacity: { delay: 0.15 + 0.09 * i, duration: 0.4 },
              y: { delay: 0.15 + 0.09 * i, type: "spring", stiffness: 480, damping: 30 },
              layout: { type: "spring", stiffness: 380, damping: 34 },
            }}
            whileTap={{ scale: 0.97 }}
            className={[
              "rounded-full px-5 py-2.5 text-base font-medium transition-colors md:text-lg",
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
