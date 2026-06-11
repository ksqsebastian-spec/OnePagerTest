"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export type RenderTarget = "portfolio" | "booking" | "contact" | "about" | null;

const EASE = [0.16, 1, 0.3, 1] as const;

const META: Record<NonNullable<RenderTarget>, { title: string; sub: string }> = {
  portfolio: { title: "Portfolio", sub: "Ausgewählte Arbeiten" },
  booking: { title: "Termin buchen", sub: "Wähl einen Slot, der dir passt" },
  contact: { title: "Kontakt", sub: "So erreichst du uns am schnellsten" },
  about: { title: "Über Seehafer", sub: "Studio für digitale Produkte" },
};

// The generative-UI stage. Fills the priority cell the layout engine hands it
// and renders real, space-filling content. Switching tools crossfades in place.
export default function GenerativePanel({
  target,
  onClose,
}: {
  target: RenderTarget;
  onClose: () => void;
}) {
  if (!target) return null;
  const meta = META[target];

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface p-7 md:p-9"
    >
      <header className="mb-6 flex shrink-0 items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">{meta.sub}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {meta.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-mute transition-colors hover:border-hairline-strong hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={target}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="h-full"
          >
            <Body target={target} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

const PROJECTS = [
  { name: "Hafenliebe", tag: "Brand · Web", color: "#ff2d55" },
  { name: "Tidekraft", tag: "Produkt", color: "#0a84ff" },
  { name: "Nordlicht", tag: "Kampagne", color: "#30d158" },
  { name: "Werft 7", tag: "E-Commerce", color: "#ffd60a" },
  { name: "Kompass", tag: "App", color: "#5e5ce6" },
  { name: "Möwe", tag: "Identity", color: "#0a0a0a" },
];

function Body({ target }: { target: NonNullable<RenderTarget> }) {
  switch (target) {
    case "portfolio":
      return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <div key={p.name} className="group">
              <div
                className="aspect-[4/3] w-full rounded-lg"
                style={{ background: p.color }}
              />
              <div className="mt-2.5">
                <p className="font-display text-base font-semibold tracking-tight text-ink">
                  {p.name}
                </p>
                <p className="text-[13px] text-mute">{p.tag}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case "booking":
      return <Booking />;

    case "contact":
      return (
        <div className="grid gap-3 md:max-w-2xl">
          {[
            { k: "Anrufen", v: "+49 000 000 0000", href: "tel:+490000000000" },
            { k: "E-Mail", v: "moin@seehafer.example", href: "mailto:moin@seehafer.example" },
            { k: "Studio", v: "Hamburg, Hafencity", href: "#" },
          ].map((row) => (
            <a
              key={row.k}
              href={row.href}
              className="flex items-center justify-between rounded-lg border border-hairline px-5 py-4 transition-colors hover:border-hairline-strong"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-mute">{row.k}</span>
              <span className="font-display text-lg font-medium text-ink">{row.v}</span>
            </a>
          ))}
        </div>
      );

    case "about":
      return (
        <div className="max-w-2xl">
          <p className="font-display text-xl font-medium leading-relaxed tracking-tight text-ink md:text-2xl">
            Seehafer ist ein kleines Studio für digitale Produkte. Wir bauen Websites,
            Tools und Markenauftritte mit Fokus auf klares, kontrastreiches Design —
            schwarz auf weiß, mit Mut zur Farbe.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
            {[
              ["12", "Jahre"],
              ["80+", "Projekte"],
              ["HH", "Hamburg"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl font-semibold tracking-tight">{n}</p>
                <p className="text-sm text-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>
      );
  }
}

// Booking uses the system's single inverted dark surface for the summary —
// the one "look here" moment per view.
function Booking() {
  const slots = ["Di · 10:00", "Di · 14:30", "Mi · 09:00", "Mi · 16:00", "Do · 11:00", "Fr · 13:00"];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_18rem]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slots.map((s) => {
          const on = selected === s;
          return (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={[
                "rounded-lg border px-4 py-4 text-[15px] transition-colors",
                on
                  ? "border-ink bg-ink text-on-dark"
                  : "border-hairline text-ink hover:border-hairline-strong",
              ].join(" ")}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-dark p-6 text-on-dark">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">Dein Termin</p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
            {selected ?? "—"}
          </p>
          <p className="mt-1 text-sm text-white/60">30 Min · Video oder Telefon</p>
        </div>
        <button
          disabled={!selected}
          className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition-opacity disabled:opacity-30"
        >
          Termin bestätigen
        </button>
      </div>
    </div>
  );
}
