"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import TypingText from "@/components/TypingText";
import NavButtons, { type NavItem } from "@/components/NavButtons";
import RotatingImage from "@/components/RotatingImage";
import ChatWindow from "@/components/ChatWindow";
import GenerativePanel, { type RenderTarget } from "@/components/GenerativePanel";

type Stage = "moin" | "headline" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;
const GLIDE = { layout: { duration: 0.85, ease: EASE } };
const HEADLINE = "Willkommen bei Seehafer\nWie kann ich dir helfen";

// Calm composition: two stable columns. The left holds the hero/stage/nav, the
// right holds the chat (constant size — it only glides, never resizes, so its
// contents never distort). A tool fades into the left stage; the chat slides to
// vertical-centre to balance it. Everything moves on slow, gentle tweens.
export default function Home() {
  const [stage, setStage] = useState<Stage>("moin");
  const [panel, setPanel] = useState<RenderTarget>(null);

  const revealed = stage === "done";
  const tool = panel !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (item: NavItem) =>
    setPanel((p) => (p === item.action ? null : item.action));

  return (
    <main className="flex h-dvh w-screen gap-12 overflow-hidden p-10 md:gap-20 md:p-20">
      <LayoutGroup>
        {/* LEFT COLUMN — hero · stage · nav */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Hero ↔ wordmark (intro types once; never re-types) */}
          <motion.div layout transition={GLIDE} className="min-w-0">
            <AnimatePresence initial={false} mode="popLayout">
              {!tool ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <h1 className="font-display text-[3.25rem] font-semibold leading-none tracking-tight md:text-[4.5rem]">
                    {revealed ? "Moin" : <TypingText text="Moin" speed={170} onDone={() => setStage("headline")} />}
                  </h1>
                  {stage !== "moin" && (
                    <div className="mt-8 max-w-2xl font-display text-3xl font-medium leading-[1.16] tracking-tight text-charcoal md:mt-10 md:text-[2.6rem]">
                      {revealed ? (
                        <span className="whitespace-pre-line">{HEADLINE}</span>
                      ) : (
                        <TypingText
                          text={HEADLINE}
                          speed={48}
                          onDone={() => setStage("done")}
                          className="whitespace-pre-line"
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.button
                  key="brand"
                  onClick={() => setPanel(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="font-display text-2xl font-semibold tracking-tight transition-opacity duration-300 hover:opacity-60 md:text-3xl"
                >
                  Seehafer
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stage — the generated tool fades into the open space */}
          <div className="relative min-h-0 flex-1">
            <AnimatePresence>
              {tool && (
                <motion.div
                  key="stage"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-x-0 bottom-0 top-10 md:top-14"
                >
                  <GenerativePanel target={panel} onClose={() => setPanel(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav — glides between vertical stack and horizontal row */}
          <motion.div layout transition={GLIDE} className="shrink-0 pt-10">
            <NavButtons
              show={revealed}
              active={panel}
              orientation={tool ? "horizontal" : "vertical"}
              onSelect={toggle}
            />
          </motion.div>
        </div>

        {/* RIGHT COLUMN — art (idle, absolute so it never shifts the chat) + chat */}
        <div className="relative flex w-[20rem] shrink-0 flex-col md:w-[24rem]">
          <div className="absolute right-0 top-0">
            <AnimatePresence>
              {!tool && (
                <motion.div
                  key="art"
                  initial={{ opacity: 0 }}
                  animate={revealed ? { opacity: 1 } : {}}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <RotatingImage show={revealed} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat: constant height; only its vertical anchor changes → pure glide */}
          <div className={`flex h-full flex-col ${tool ? "justify-center" : "justify-end"}`}>
            <motion.div layout transition={GLIDE} className="h-[clamp(20rem,56vh,30rem)]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
                className="h-full"
              >
                <ChatWindow show={revealed} onRender={setPanel} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </LayoutGroup>
    </main>
  );
}
