"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import HandDrawnBox from "./HandDrawnBox";
import TypingText from "./TypingText";
import type { RenderTarget } from "./GenerativePanel";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const PROMPT = "Schreib hier rein, ich beantworte deine Frage …";

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
        // Stream the reply into the last (assistant) message as it arrives.
        // eslint-disable-next-line no-constant-condition
        while (true) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-xl"
    >
      <HandDrawnBox className="pointer-events-none absolute inset-0 h-full w-full text-ink" />
      <div className="relative flex h-72 flex-col p-6 md:h-80">
        {messages.length === 0 ? (
          <p className="text-xl text-ink/80 md:text-2xl">
            {show && (
              <TypingText text={PROMPT} speed={40} onDone={() => setPromptDone(true)} />
            )}
          </p>
        ) : (
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={
                    m.role === "user"
                      ? "inline-block rounded-2xl bg-ink px-4 py-2 text-paper"
                      : "inline-block text-ink/90"
                  }
                >
                  {m.text || (
                    <span className="caret">&nbsp;</span>
                  )}
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
          className="mt-3 flex items-center gap-2 border-t border-ink/15 pt-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!promptDone && messages.length === 0}
            placeholder="…"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-ink/30 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-full bg-ink px-4 py-2 text-paper disabled:opacity-30"
          >
            →
          </button>
        </form>
      </div>
    </motion.div>
  );
}
