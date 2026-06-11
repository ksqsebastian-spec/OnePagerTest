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

  function handleNav(item: NavItem) {
    setPanel(item.action);
  }

  return (
    <main className="relative h-dvh w-screen overflow-hidden p-6 md:p-10">
      {/* Greeting (top-left) */}
      <div className="absolute left-6 top-6 md:left-10 md:top-10">
        <h1 className="text-5xl font-medium tracking-tight md:text-6xl">
          <TypingText
            text="Moin"
            speed={140}
            onDone={() => setStage("headline")}
          />
        </h1>

        {stage !== "moin" && (
          <div className="mt-8 max-w-3xl text-4xl font-medium leading-tight tracking-tight md:mt-12 md:text-6xl">
            <TypingText
              text={"Willkommen bei Seehafer\nWie kann ich dir helfen"}
              speed={45}
              onDone={() => setStage("ready")}
              className="whitespace-pre-line"
            />
          </div>
        )}
      </div>

      {/* Rotating image (top-right) */}
      <div className="absolute right-6 top-6 md:right-10 md:top-10">
        <RotatingImage show={ready} />
      </div>

      {/* Nav buttons (bottom-left) */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
        <NavButtons show={ready} onSelect={handleNav} />
      </div>

      {/* Chat window (bottom-right) */}
      <div className="absolute bottom-6 right-6 w-[min(90vw,36rem)] md:bottom-10 md:right-10">
        <ChatWindow show={ready} onRender={setPanel} />
      </div>

      {/* Generative UI surface — builds into the center of the canvas. */}
      <motion.div
        layout
        className="pointer-events-none absolute inset-0 flex items-center justify-center p-6"
      >
        <GenerativePanel target={panel} onClose={() => setPanel(null)} />
      </motion.div>
    </main>
  );
}
