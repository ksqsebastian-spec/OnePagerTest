"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import TypingText from "@/components/TypingText";
import NavButtons, { type NavItem } from "@/components/NavButtons";
import RotatingImage from "@/components/RotatingImage";
import ChatWindow from "@/components/ChatWindow";
import GenerativePanel, { type RenderTarget } from "@/components/GenerativePanel";

type Stage = "moin" | "headline" | "reveal";
const EASE = [0.16, 1, 0.3, 1] as const;

// Two layouts. Same five named areas — only their placement changes, so the
// chat, buttons, hero and art FLIP-animate to their new homes when a tool
// claims the stage. The tool element gets the priority centre-left block.
const IDLE_AREAS = `
  "hero hero .    art"
  "hero hero .    ."
  ".    .    chat chat"
  "btns .    chat chat"`;

const TOOL_AREAS = `
  "hero  hero  hero  chat"
  "stage stage stage chat"
  "stage stage stage chat"
  "btns  btns  btns  chat"`;

export default function Home() {
  const [stage, setStage] = useState<Stage>("moin");
  const [panel, setPanel] = useState<RenderTarget>(null);

  const revealed = stage === "reveal";
  const toolActive = panel !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (item: NavItem) =>
    setPanel((p) => (p === item.action ? null : item.action));

  return (
    <main
      className="grid h-dvh w-screen gap-6 overflow-hidden p-8 md:gap-8 md:p-12"
      style={{
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gridTemplateRows: "auto 1fr 1fr auto",
        gridTemplateAreas: (toolActive ? TOOL_AREAS : IDLE_AREAS).trim(),
      }}
    >
      <LayoutGroup>
        {/* HERO ↔ BRAND */}
        <motion.div layout transition={{ layout: { duration: 0.6, ease: EASE } }} style={{ gridArea: "hero" }} className="min-w-0 self-start">
          <AnimatePresence mode="wait">
            {!toolActive ? (
              <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
                  <TypingText text="Moin" speed={150} onDone={() => setStage("headline")} />
                </h1>
                {stage !== "moin" && (
                  <div className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.08] tracking-tight md:mt-9 md:text-[3.4rem]">
                    <TypingText
                      text={"Willkommen bei Seehafer\nWie kann ich dir helfen"}
                      speed={42}
                      onDone={() => setStage("reveal")}
                      className="whitespace-pre-line"
                    />
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
                className="font-display text-3xl font-semibold tracking-tight"
              >
                Seehafer
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ROTATING ART — idle only */}
        <AnimatePresence>
          {!toolActive && (
            <motion.div layout transition={{ layout: { duration: 0.6, ease: EASE } }} style={{ gridArea: "art" }} className="flex items-start justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={revealed ? { opacity: 1, scale: 1 } : {}}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
              >
                <RotatingImage show={revealed} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOOL STAGE — priority block, tool only */}
        {toolActive && (
          <motion.div layout transition={{ layout: { duration: 0.6, ease: EASE } }} style={{ gridArea: "stage" }} className="min-h-0 min-w-0">
            <GenerativePanel target={panel} onClose={() => setPanel(null)} />
          </motion.div>
        )}

        {/* CHAT — docks from bottom-right card to tall right column */}
        <motion.div layout transition={{ layout: { duration: 0.6, ease: EASE } }} style={{ gridArea: "chat" }} className="min-h-0 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
            className="h-full"
          >
            <ChatWindow show={revealed} onRender={setPanel} />
          </motion.div>
        </motion.div>

        {/* NAV — reflows stack ↔ row */}
        <motion.div layout transition={{ layout: { duration: 0.6, ease: EASE } }} style={{ gridArea: "btns" }} className="flex min-w-0 items-end">
          <NavButtons
            show={revealed}
            active={panel}
            orientation={toolActive ? "horizontal" : "vertical"}
            onSelect={toggle}
          />
        </motion.div>
      </LayoutGroup>
    </main>
  );
}
