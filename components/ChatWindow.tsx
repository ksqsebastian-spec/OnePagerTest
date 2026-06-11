"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TypingText from "./TypingText";
import type { RenderTarget } from "./GenerativePanel";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const PROMPT = "Schreib hier rein, ich beantworte deine Frage";

// Height-flexible chat. Fills whatever cell the layout engine docks it into —
// a 2×2 card when idle, a tall right column when a tool takes the stage.
export default function ChatWindow({
  show,
  onRender,
}: {
  show: boolean;
  onRender: (target: RenderTarget) => void;
}) {
  const [promptDone, setPromptDone] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promptDone) inputRef.current?.focus();
  }, [promptDone]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const renderHint = (res.headers.get("X-Render") || "") as string;
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = {
              role: "assistant",
              text: next[next.length - 1].text + chunk,
            };
            return next;
          });
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
        }
      }
      if (renderHint) onRender(renderHint as RenderTarget);
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "assistant",
          text: "Hmm, da ging etwas schief. Versuch es nochmal.",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  const ready = promptDone || messages.length > 0;
  const dots = ["#ff5f56", "#ffbd2e", "#27c93f"];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface">
      {/* Terminal-style header — boots in dot by dot. */}
      <div className="flex shrink-0 items-center gap-2 border-b border-hairline px-4 py-3">
        {dots.map((c, i) => (
          <motion.span
            key={c}
            className="h-3 w-3 rounded-full"
            style={{ background: c }}
            initial={{ scale: 0 }}
            animate={show ? { scale: 1 } : {}}
            transition={{ delay: 0.6 + i * 0.09, type: "spring", stiffness: 600, damping: 18 }}
          />
        ))}
        <motion.span
          className="ml-2 font-mono text-xs text-mute"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 0.95 }}
        >
          seehafer — chat
        </motion.span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        {messages.length === 0 ? (
          <p className="text-lg text-body md:text-xl">
            <TypingText
              text={PROMPT}
              speed={34}
              start={show}
              startDelay={1050}
              onDone={() => setPromptDone(true)}
            />
          </p>
        ) : (
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={
                    m.role === "user"
                      ? "inline-block rounded-2xl bg-ink px-4 py-2 text-[15px] text-on-dark"
                      : "inline-block text-[15px] leading-relaxed text-charcoal"
                  }
                >
                  {m.text || <span className="caret" />}
                </span>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-auto flex shrink-0 items-center gap-2 border-t border-hairline pt-4"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!ready}
            placeholder="Frag mich etwas …"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-mute disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Senden"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-on-dark transition-opacity hover:bg-black disabled:opacity-25"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
