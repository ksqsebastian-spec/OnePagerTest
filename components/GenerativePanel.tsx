"use client";

import { AnimatePresence, motion } from "framer-motion";
import Calendar from "./Calendar";

export type RenderTarget = "portfolio" | "booking" | "contact" | "about" | null;

const EASE = [0.22, 1, 0.36, 1] as const;

const META: Record<NonNullable<RenderTarget>, { title: string; sub: string }> = {
  portfolio: { title: "Portfolio", sub: "Ausgewählte Arbeiten" },
  booking: { title: "Termin buchen", sub: "Wähl Tag & Uhrzeit" },
  contact: { title: "Kontakt", sub: "So erreichst du uns" },
  about: { title: "Über Seehafer", sub: "Studio für digitale Produkte" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

// Builds directly onto the white canvas — no card, no border, no window. Just a
// title and content occupying the space the page makes for it.
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
    <div className="flex h-full w-full flex-col">
      <header className="mb-9 flex shrink-0 items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{meta.sub}</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{meta.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="-mr-1 flex h-10 w-10 items-center justify-center rounded-full text-mute transition-colors duration-300 hover:bg-black/5 hover:text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <div className={`scroll-slim flex min-h-0 flex-1 flex-col overflow-y-auto ${target === "portfolio" ? "justify-start" : "justify-center"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={target} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <Body target={target} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const PROJECTS = [
  { name: "Hafenliebe", tag: "Brand · Web", img: "/work/01.jpg" },
  { name: "Tidekraft", tag: "Produkt", img: "/work/02.jpg" },
  { name: "Nordlicht", tag: "Kampagne", img: "/work/03.jpg" },
  { name: "Werft 7", tag: "E-Commerce", img: "/work/04.jpg" },
  { name: "Kompass", tag: "App", img: "/work/05.jpg" },
  { name: "Möwe", tag: "Identity", img: "/work/06.jpg" },
];

function Body({ target }: { target: NonNullable<RenderTarget> }) {
  switch (target) {
    case "portfolio":
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <motion.a key={p.name} variants={item} href="#" className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#f0f0f0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-lg font-semibold tracking-tight text-ink">{p.name}</p>
              <p className="text-[13px] text-mute">{p.tag}</p>
            </motion.a>
          ))}
        </div>
      );

    case "booking":
      return (
        <motion.div variants={item}>
          <Calendar />
        </motion.div>
      );

    case "contact":
      return (
        <motion.div variants={item} className="w-full max-w-2xl">
          {[
            { k: "Anrufen", v: "+49 000 000 0000", href: "tel:+490000000000" },
            { k: "E-Mail", v: "moin@seehafer.example", href: "mailto:moin@seehafer.example" },
            { k: "Studio", v: "Hamburg, Hafencity", href: "#" },
          ].map((row) => (
            <a key={row.k} href={row.href} className="group flex items-center justify-between border-b border-hairline py-5 transition-colors last:border-0 hover:border-ink">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{row.k}</span>
              <span className="flex items-center gap-3 text-xl font-medium text-ink md:text-2xl">
                {row.v}
                <svg className="opacity-30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </a>
          ))}
        </motion.div>
      );

    case "about":
      return (
        <motion.div variants={item} className="max-w-2xl">
          <p className="text-2xl font-medium leading-[1.4] tracking-tight text-ink md:text-[2rem]">
            Ein kleines Studio für digitale Produkte. Wir bauen Websites, Tools und
            Markenauftritte mit Fokus auf klares, kontrastreiches Design — schwarz auf
            weiß, mit Mut zur Farbe.
          </p>
          <div className="mt-12 flex flex-wrap gap-x-16 gap-y-8">
            {[["12", "Jahre"], ["80+", "Projekte"], ["HH", "Hamburg"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-5xl font-semibold tracking-tight">{n}</p>
                <p className="mt-1 text-sm text-mute">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      );
  }
}
