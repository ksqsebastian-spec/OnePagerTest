"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const TIMES = ["09:00", "10:30", "13:00", "15:30"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;

// A working booking calendar — navigable months, real date logic (past days and
// weekends disabled), pick a day → pick a time → confirm.
export default function Calendar() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = mondayIndex(new Date(year, month, 1));
  const atFirstMonth = year === today.getFullYear() && month === today.getMonth();

  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, n) => new Date(year, month, n + 1)),
  ];

  const shift = (delta: number) => {
    setView(new Date(year, month + delta, 1));
  };

  return (
    <div className="grid w-full gap-x-14 gap-y-8 md:grid-cols-[auto_1fr]">
      {/* Month grid */}
      <div className="w-[19rem] max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            {MONTHS[month]} {year}
          </span>
          <div className="flex gap-1">
            <button onClick={() => shift(-1)} disabled={atFirstMonth} aria-label="Vorheriger Monat" className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 disabled:opacity-25">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={() => shift(1)} aria-label="Nächster Monat" className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1 text-center font-mono text-[11px] uppercase tracking-wider text-mute">{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, n) => {
            if (!d) return <div key={`x${n}`} />;
            const past = d < today;
            const weekend = d.getDay() === 0 || d.getDay() === 6;
            const disabled = past || weekend;
            const selected = date && sameDay(d, date);
            const isToday = sameDay(d, today);
            return (
              <button
                key={d.toISOString()}
                disabled={disabled}
                onClick={() => { setDate(d); setTime(null); setConfirmed(false); }}
                className={[
                  "flex aspect-square items-center justify-center rounded-full text-[15px] transition-colors",
                  disabled ? "cursor-not-allowed text-mute/40 line-through decoration-1" : "text-ink hover:bg-black/5",
                  selected ? "!bg-ink !text-on-dark" : "",
                  isToday && !selected ? "ring-1 ring-line" : "",
                ].join(" ")}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Times + confirm */}
      <div className="flex flex-col">
        {!date ? (
          <p className="self-center text-body">Wähl einen Tag im Kalender.</p>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
              {date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {TIMES.map((t) => {
                const on = time === t;
                return (
                  <button
                    key={t}
                    onClick={() => { setTime(t); setConfirmed(false); }}
                    className={[
                      "rounded-full border px-5 py-2.5 text-[15px] transition-colors",
                      on ? "border-ink bg-ink text-on-dark" : "border-line text-ink hover:border-ink",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {time && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setConfirmed(true)}
                className="mt-7 rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-on-dark transition-colors hover:bg-black"
              >
                {confirmed ? "✓ Termin gebucht" : `${date.toLocaleDateString("de-DE", { day: "numeric", month: "short" })} · ${time} bestätigen`}
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
