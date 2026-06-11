"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TypingText from "./TypingText";
import type { RenderTarget } from "./GenerativePanel";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const PROMPT = "Schreib hier rein — ich beantworte deine Frage.";
const CHIPS = [
  { label: "Portfolio zeigen", send: "zeig mir euer portfolio" },
  { label: "Termin buchen", send: "ich will einen termin buchen" },
  { label: "Über euch", send: "wer seid ihr" },
];

// The chat is not a window — it's black text living on the white canvas, with a
// single underline for the input. One of the two elements the page builds
// itself around.
export default function ChatWindow({
  show,
  instant = false,
  onRender,
}: {
  show: boolean;
  instant?: boolean;
  onRender: (target: RenderTarget) => void;
}) {
  const [promptDone, setPromptDone] = useState(instant);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promptDone) inputRef.current?.focus();
  }, [promptDone]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const hint = (res.headers.get("X-Render") || "") as string;
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = { role: "assistant", text: next[next.length - 1].text + chunk };
            return next;
          });
        }
      }
      if (hint) setTimeout(() => onRender(hint as RenderTarget), 300);
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "assistant", text: "Hmm, da ging etwas schief. Versuch es nochmal." };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  const empty = messages.length === 0;
  const waiting = busy && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.text === "";

  return (
    <div className="flex h-full w-full flex-col justify-end">
      {/* Conversation */}
      <div ref={scrollRef} className="scroll-slim flex min-h-0 flex-col gap-4 overflow-y-auto pb-6">
        {empty ? (
          <div>
            <p className="text-2xl font-medium leading-snug tracking-tight text-ink md:text-[1.75rem]">
              <TypingText text={PROMPT} speed={34} start={show} startDelay={instant ? 0 : 250} instant={instant} onDone={() => setPromptDone(true)} />
            </p>
            <AnimatePresence>
              {promptDone && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mt-5 flex flex-col items-start gap-2">
                  {CHIPS.map((c) => (
                    <button key={c.label} onClick={() => send(c.send)} className="group flex items-center gap-2 text-[15px] text-mute transition-colors hover:text-ink">
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                      <span className="group-hover:underline">{c.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              {m.role === "user" ? (
                <p className="text-[17px] font-medium text-ink">{m.text}</p>
              ) : m.text === "" && waiting ? (
                <Thinking />
              ) : (
                <p className="max-w-[34rem] text-[17px] leading-relaxed text-body">{m.text}</p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Input — a single underline on the canvas, not a box */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex shrink-0 items-center gap-3 border-b border-ink pb-2"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!promptDone}
          placeholder="Frag mich etwas …"
          className="min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-mute disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Senden"
          className="text-ink transition-opacity duration-300 hover:opacity-60 disabled:opacity-20"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function Thinking() {
  return (
    <span className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-mute"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}
