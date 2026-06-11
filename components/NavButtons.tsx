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
    <div className={["flex gap-3", orientation === "vertical" ? "flex-col items-start" : "flex-row flex-wrap items-center"].join(" ")}>
      {ITEMS.map((item, i) => {
        const isActive = active === item.action;
        return (
          <motion.button
            key={item.action}
            type="button"
            layout
            onClick={() => onSelect(item)}
            initial={{ opacity: 0, y: 8 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{
              opacity: { delay: 0.15 + 0.1 * i, duration: 0.6, ease: EASE },
              y: { delay: 0.15 + 0.1 * i, duration: 0.6, ease: EASE },
              layout: { duration: 0.7, ease: EASE },
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={[
              "rounded-full px-6 py-3 text-[15px] font-medium transition-colors duration-300 md:text-base",
              isActive
                ? "bg-canvas text-ink ring-1 ring-line"
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
