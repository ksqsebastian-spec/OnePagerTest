"use client";

import { AnimatePresence, motion } from "framer-motion";

export type RenderTarget = "portfolio" | "booking" | "contact" | "about" | null;

// The "generative UI" surface: the chat/nav asks for a target and a panel
// builds itself into the canvas. This is the seam where richer model-driven
// components will plug in (CopilotKit / AI SDK generative UI) — the contract is
// just a render target string.
export default function GenerativePanel({
  target,
  onClose,
}: {
  target: RenderTarget;
  onClose: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {target && (
        <motion.div
          key={target}
          layout
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-ink/15 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              {TITLES[target]}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className="rounded-full px-2 text-xl leading-none text-ink/50 hover:text-ink"
            >
              ×
            </button>
          </div>
          <PanelBody target={target} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TITLES: Record<NonNullable<RenderTarget>, string> = {
  portfolio: "Portfolio",
  booking: "Termin buchen",
  contact: "Kontakt",
  about: "Über Seehafer",
};

function PanelBody({ target }: { target: NonNullable<RenderTarget> }) {
  switch (target) {
    case "portfolio":
      return (
        <div className="grid grid-cols-2 gap-3">
          {[
            "linear-gradient(135deg,#ff2d55,#ff9500)",
            "linear-gradient(135deg,#0a84ff,#5e5ce6)",
            "linear-gradient(135deg,#30d158,#0a84ff)",
            "linear-gradient(135deg,#ffd60a,#ff2d55)",
          ].map((bg, n) => (
            <div
              key={n}
              className="aspect-video rounded-lg"
              style={{ background: bg }}
            />
          ))}
        </div>
      );
    case "booking":
      return (
        <div className="space-y-3">
          <p className="text-ink/70">Wähl einen Slot:</p>
          {["Di · 10:00", "Mi · 14:30", "Do · 09:00"].map((slot) => (
            <button
              key={slot}
              className="w-full rounded-lg border border-ink/20 px-4 py-3 text-left hover:bg-ink hover:text-paper"
            >
              {slot}
            </button>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="space-y-2 text-lg">
          <p>
            <a className="underline" href="tel:+490000000000">
              +49 000 000 0000
            </a>
          </p>
          <p>
            <a className="underline" href="mailto:moin@seehafer.example">
              moin@seehafer.example
            </a>
          </p>
        </div>
      );
    case "about":
      return (
        <p className="text-ink/80">
          Seehafer ist ein kleines Studio für digitale Produkte. Wir bauen
          Websites, Tools und Markenauftritte mit Fokus auf klares,
          kontrastreiches Design — schwarz auf weiß, mit Mut zur Farbe.
        </p>
      );
  }
}
