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

// Pure-black pills (rounded-full) that pop in in sequence, bottom-left.
export default function NavButtons({
  show,
  active,
  onSelect,
}: {
  show: boolean;
  active: NavItem["action"] | null;
  onSelect: (item: NavItem) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2.5">
      {ITEMS.map((item, i) => {
        const isActive = active === item.action;
        return (
          <motion.button
            key={item.action}
            type="button"
            onClick={() => onSelect(item)}
            initial={{ opacity: 0, y: 12 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * i, type: "spring", stiffness: 460, damping: 30 }}
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
