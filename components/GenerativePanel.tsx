"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export type RenderTarget = "portfolio" | "booking" | "contact" | "about" | null;

const EASE = [0.22, 1, 0.36, 1] as const;

const META: Record<NonNullable<RenderTarget>, { title: string; sub: string }> = {
  portfolio: { title: "Portfolio", sub: "Ausgewählte Arbeiten" },
  booking: { title: "Termin buchen", sub: "Wähl einen Slot, der dir passt" },
  contact: { title: "Kontakt", sub: "So erreichst du uns" },
  about: { title: "Über Seehafer", sub: "Studio für digitale Produkte" },
};

export default function GenerativePanel({
  target,
  onClose,
}: {
  target: RenderTarget;
  onClose: () => void;
}) {
  if (!target) return null;
  const meta = META[target];
  const align = target === "portfolio" ? "justify-start" : "justify-center";

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-9 md:p-12">
      <header className="mb-8 flex shrink-0 items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">{meta.sub}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {meta.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-mute transition-colors duration-300 hover:border-hairline-strong hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${align}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={target}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Body target={target} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const PROJECTS = [
  { name: "Hafenliebe", tag: "Brand · Web", color: "#e4572e" },
  { name: "Tidekraft", tag: "Produkt", color: "#3a5a9f" },
  { name: "Nordlicht", tag: "Kampagne", color: "#2a9d8f" },
  { name: "Werft 7", tag: "E-Commerce", color: "#e9c46a" },
  { name: "Kompass", tag: "App", color: "#6d6875" },
  { name: "Möwe", tag: "Identity", color: "#1d1d1f" },
];

function Body({ target }: { target: NonNullable<RenderTarget> }) {
  switch (target) {
    case "portfolio":
      return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <div key={p.name}>
              <div className="aspect-[4/3] w-full rounded-xl" style={{ background: p.color }} />
              <p className="mt-3 font-display text-base font-semibold tracking-tight text-ink">
                {p.name}
              </p>
              <p className="text-[13px] text-mute">{p.tag}</p>
            </div>
          ))}
        </div>
      );

    case "booking":
      return <Booking />;

    case "contact":
      return (
        <div className="grid w-full gap-4 md:max-w-2xl">
          {[
            { k: "Anrufen", v: "+49 000 000 0000", href: "tel:+490000000000" },
            { k: "E-Mail", v: "moin@seehafer.example", href: "mailto:moin@seehafer.example" },
            { k: "Studio", v: "Hamburg, Hafencity", href: "#" },
          ].map((row) => (
            <a
              key={row.k}
              href={row.href}
              className="flex items-center justify-between rounded-xl border border-hairline px-6 py-5 transition-colors duration-300 hover:border-hairline-strong"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">{row.k}</span>
              <span className="font-display text-lg font-medium text-ink">{row.v}</span>
            </a>
          ))}
        </div>
      );

    case "about":
      return (
        <div className="max-w-2xl">
          <p className="font-display text-2xl font-medium leading-[1.5] tracking-tight text-ink md:text-[1.75rem]">
            Seehafer ist ein kleines Studio für digitale Produkte. Wir bauen Websites,
            Tools und Markenauftritte mit Fokus auf klares, kontrastreiches Design —
            schwarz auf weiß, mit Mut zur Farbe.
          </p>
          <div className="mt-12 flex flex-wrap gap-x-16 gap-y-8">
            {[
              ["12", "Jahre"],
              ["80+", "Projekte"],
              ["HH", "Hamburg"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-4xl font-semibold tracking-tight">{n}</p>
                <p className="mt-1 text-sm text-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>
      );
  }
}

function Booking() {
  const slots = ["Di · 10:00", "Di · 14:30", "Mi · 09:00", "Mi · 16:00", "Do · 11:00", "Fr · 13:00"];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid w-full gap-8 md:grid-cols-[1fr_19rem]">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {slots.map((s) => {
          const on = selected === s;
          return (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={[
                "rounded-xl border px-4 py-5 text-[15px] transition-colors duration-300",
                on ? "border-ink bg-ink text-on-dark" : "border-hairline text-ink hover:border-hairline-strong",
              ].join(" ")}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col justify-between rounded-2xl bg-surface-dark p-7 text-on-dark">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">Dein Termin</p>
          <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{selected ?? "—"}</p>
          <p className="mt-1.5 text-sm text-white/55">30 Min · Video oder Telefon</p>
        </div>
        <button
          disabled={!selected}
          className="mt-8 rounded-full bg-white px-5 py-3.5 text-sm font-medium text-ink transition-opacity duration-300 disabled:opacity-30"
        >
          Termin bestätigen
        </button>
      </div>
    </div>
  );
}
