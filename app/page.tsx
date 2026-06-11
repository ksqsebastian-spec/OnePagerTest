"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import TypingText from "@/components/TypingText";
import NavButtons, { type NavItem } from "@/components/NavButtons";
import RotatingImage from "@/components/RotatingImage";
import ChatWindow from "@/components/ChatWindow";
import GenerativePanel, { type RenderTarget } from "@/components/GenerativePanel";

type Stage = "moin" | "headline" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;
const HEADLINE = "Willkommen bei Seehafer.\nWie kann ich dir helfen?";

// Everything lives on a single white canvas — no windows. The page builds
// itself around two anchors (the chat and the buttons), which reposition as a
// generated tool claims space.
export default function Home() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("moin");
  const [panel, setPanel] = useState<RenderTarget>(null);

  useEffect(() => {
    if (reduce) setStage("done");
  }, [reduce]);

  const revealed = stage === "done";
  const tool = panel !== null;
  const glide = { layout: { duration: reduce ? 0 : 0.8, ease: EASE } };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (item: NavItem) => setPanel((p) => (p === item.action ? null : item.action));

  return (
    <main className="flex h-dvh w-screen flex-col gap-10 overflow-hidden p-8 md:flex-row md:gap-20 md:p-20">
      <LayoutGroup>
        {/* LEFT — greeting OR tool · nav */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            {/* Greeting (idle) */}
            <AnimatePresence>
              {!tool && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.35 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-x-0 top-0"
                >
                  <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Studio für digitale Produkte</p>
                  <h1 className="text-[2.75rem] font-bold leading-none tracking-tight md:text-[3.5rem]">
                    {revealed ? "Moin" : <TypingText text="Moin" speed={160} instant={!!reduce} onDone={() => setStage("headline")} />}
                  </h1>
                  {stage !== "moin" && (
                    <h2 className="mt-7 max-w-3xl text-[2rem] font-semibold leading-[1.12] tracking-tight text-ink md:mt-9 md:text-[3.25rem]">
                      {revealed ? (
                        <span className="whitespace-pre-line">{HEADLINE}</span>
                      ) : (
                        <TypingText text={HEADLINE} speed={42} instant={!!reduce} onDone={() => setStage("done")} className="whitespace-pre-line" />
                      )}
                    </h2>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tool (builds onto the canvas) */}
            <AnimatePresence>
              {tool && (
                <motion.div
                  key="stage"
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.6, ease: EASE, delay: reduce ? 0 : 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  className="absolute inset-0"
                >
                  <GenerativePanel target={panel} onClose={() => setPanel(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav */}
          <motion.div layout transition={glide} className="shrink-0 pt-10">
            <NavButtons show={revealed} active={panel} orientation={tool ? "horizontal" : "vertical"} onSelect={toggle} />
          </motion.div>
        </div>

        {/* RIGHT — image (idle) + chat */}
        <div className="relative flex w-full shrink-0 flex-col md:w-[24rem]">
          <div className="pointer-events-none absolute right-0 top-0 hidden md:block">
            <AnimatePresence>
              {!tool && (
                <motion.div key="art" initial={{ opacity: 0 }} animate={revealed ? { opacity: 1 } : {}} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }}>
                  <RotatingImage show={revealed} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`flex h-full flex-col ${tool ? "justify-center" : "justify-end"}`}>
            <motion.div layout transition={glide} className="h-[clamp(20rem,56vh,30rem)]">
              <motion.div initial={{ opacity: 0, y: reduce ? 0 : 18 }} animate={revealed ? { opacity: 1, y: 0 } : {}} transition={{ delay: reduce ? 0 : 0.5, duration: 0.85, ease: EASE }} className="h-full">
                <ChatWindow show={revealed} instant={!!reduce} onRender={setPanel} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </LayoutGroup>
    </main>
  );
}
