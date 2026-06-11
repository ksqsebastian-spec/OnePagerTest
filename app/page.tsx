"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TypingText from "@/components/TypingText";
import NavButtons, { type NavItem } from "@/components/NavButtons";
import RotatingImage from "@/components/RotatingImage";
import ChatWindow from "@/components/ChatWindow";
import GenerativePanel, { type RenderTarget } from "@/components/GenerativePanel";

// Staged intro: greeting -> headline -> the rest of the canvas builds itself in.
type Stage = "moin" | "headline" | "ready";

export default function Home() {
  const [stage, setStage] = useState<Stage>("moin");
  const [panel, setPanel] = useState<RenderTarget>(null);

  const ready = stage === "ready";

  return (
    <main className="relative h-dvh w-screen overflow-hidden px-8 py-10 md:px-14 md:py-12">
      {/* Greeting (top-left) */}
      <div className="absolute left-8 top-10 md:left-14 md:top-12">
        <h1 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
          <TypingText text="Moin" speed={150} onDone={() => setStage("headline")} />
        </h1>

        {stage !== "moin" && (
          <div className="mt-7 max-w-3xl font-display text-4xl font-medium leading-[1.08] tracking-tight md:mt-10 md:text-[3.75rem]">
            <TypingText
              text={"Willkommen bei Seehafer\nWie kann ich dir helfen"}
              speed={42}
              onDone={() => setStage("ready")}
              className="whitespace-pre-line"
            />
          </div>
        )}
      </div>

      {/* Rotating art (top-right) */}
      <div className="absolute right-8 top-10 md:right-14 md:top-12">
        <RotatingImage show={ready} />
      </div>

      {/* Nav pills (bottom-left) */}
      <div className="absolute bottom-10 left-8 md:bottom-12 md:left-14">
        <NavButtons show={ready} active={panel} onSelect={(item: NavItem) => setPanel(item.action)} />
      </div>

      {/* Chat (bottom-right) */}
      <div className="absolute bottom-10 right-8 w-[min(90vw,32rem)] md:bottom-12 md:right-14">
        <ChatWindow show={ready} onRender={setPanel} />
      </div>

      {/* Generative-UI surface — panels build into the center of the canvas. */}
      {panel && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/40 p-8 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setPanel(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GenerativePanel target={panel} onClose={() => setPanel(null)} />
          </div>
        </motion.div>
      )}
    </main>
  );
}
