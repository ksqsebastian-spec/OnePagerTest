"use client";

import { AnimatePresence, motion } from "framer-motion";

export type RenderTarget = "portfolio" | "booking" | "contact" | "about" | null;

const TITLES: Record<NonNullable<RenderTarget>, string> = {
  portfolio: "Portfolio",
  booking: "Termin buchen",
  contact: "Kontakt",
  about: "Über Seehafer",
};

// The generative-UI surface. Panels build themselves into the canvas; the chat
// or nav asks for a target. `booking` uses the single inverted dark surface —
// the system's one "look here" moment.
export default function GenerativePanel({
  target,
  onClose,
}: {
  target: RenderTarget;
  onClose: () => void;
}) {
  const dark = target === "booking";

  return (
    <AnimatePresence mode="wait">
      {target && (
        <motion.div
          key={target}
          layout
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className={[
            "pointer-events-auto w-full max-w-md rounded-xl border p-7",
            dark
              ? "border-transparent bg-surface-dark text-on-dark"
              : "border-hairline bg-surface text-ink",
          ].join(" ")}
        >
          <div className="mb-5 flex items-start justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {TITLES[target]}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className={[
                "-mr-1 -mt-1 rounded-full p-1 transition-colors",
                dark ? "text-white/50 hover:text-white" : "text-mute hover:text-ink",
              ].join(" ")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <PanelBody target={target} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PanelBody({ target }: { target: NonNullable<RenderTarget> }) {
  switch (target) {
    case "portfolio":
      return (
        <div className="grid grid-cols-2 gap-3">
          {["#ff2d55", "#0a84ff", "#30d158", "#ffd60a"].map((bg) => (
            <div key={bg} className="aspect-[4/3] rounded-lg" style={{ background: bg }} />
          ))}
        </div>
      );
    case "booking":
      return (
        <div className="space-y-2.5">
          <p className="mb-4 text-[15px] text-white/70">Wähl einen Slot, der dir passt.</p>
          {["Di · 10:00", "Mi · 14:30", "Do · 09:00"].map((slot) => (
            <button
              key={slot}
              className="w-full rounded-full border border-white/20 px-5 py-3 text-left text-[15px] transition-colors hover:bg-white hover:text-ink"
            >
              {slot}
            </button>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="space-y-3 text-[15px]">
          <a className="flex items-center justify-between rounded-lg border border-hairline px-4 py-3 hover:border-hairline-strong" href="tel:+490000000000">
            <span className="text-mute">Telefon</span>
            <span className="font-medium text-ink">+49 000 000 0000</span>
          </a>
          <a className="flex items-center justify-between rounded-lg border border-hairline px-4 py-3 hover:border-hairline-strong" href="mailto:moin@seehafer.example">
            <span className="text-mute">E-Mail</span>
            <span className="font-medium text-ink">moin@seehafer.example</span>
          </a>
        </div>
      );
    case "about":
      return (
        <p className="text-[15px] leading-relaxed text-charcoal">
          Seehafer ist ein kleines Studio für digitale Produkte. Wir bauen Websites,
          Tools und Markenauftritte mit Fokus auf klares, kontrastreiches Design —
          schwarz auf weiß, mit Mut zur Farbe.
        </p>
      );
  }
}
