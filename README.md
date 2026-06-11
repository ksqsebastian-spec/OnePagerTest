# Seehafer — generative one-pager

A single-screen, no-scroll "living" website. The greeting types itself out, black
nav buttons pop in, and a hand-drawn chat window lets you ask questions. The page
builds itself around two anchors — the **chat window** and the **nav buttons** —
which reflow as generative-UI panels appear. Black & white, bold-colour accents.

> Tech-demo stage: the "AI" is **faked** with an offline semantic matcher. The
> seam for a real model is a single file (`lib/ai-provider.ts`).

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **Framer Motion** (typing, pop-in, layout choreography)
- **Fake AI**: TF-IDF cosine matcher over a small Q&A set (`lib/semantic.ts`,
  `lib/qa-data.ts`) — fully offline, instant, no API key
- **Hosting**: Vercel now; **Dockerfile** included for the planned Coolify/Hetzner move
  (`output: "standalone"` → small self-contained image)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## How the pieces fit

```
app/page.tsx            Orchestrates the intro sequence + canvas layout
app/api/chat/route.ts   Streams answers word-by-word; render hint in X-Render header
components/
  TypingText            Char-by-char typing effect
  NavButtons            Black pop-in buttons (bottom-left)
  ChatWindow            Hand-drawn chat box, streams replies, triggers panels
  HandDrawnBox          Wobbly SVG border (the "not a regular window" look)
  RotatingImage         Bold-colour slides, swap every 10s (top-right)
  GenerativePanel       The generative-UI surface panels build into
lib/
  qa-data.ts            Knowledge base (questions → answer + optional render hint)
  semantic.ts           Offline TF-IDF cosine matcher
  ai-provider.ts        SWAP POINT — replace with a real model when ready
```

## Swapping in a real model

The Vercel AI SDK is a plain npm package and runs anywhere Node runs (Vercel,
Coolify/Hetzner, anywhere). When ready:

```bash
npm i ai @ai-sdk/openai   # or any provider
```

Then replace the body of `answer()` in `lib/ai-provider.ts` with a
`generateText` / `streamText` call. The API route, chat UI, and generative-UI
render hints stay unchanged. For richer model-driven UI later, CopilotKit or the
AI SDK's RSC generative UI plug in at `components/GenerativePanel.tsx`.

## Roadmap

- Real model API behind `ai-provider.ts`
- Supabase (+ pgvector) when bookings need persistence or semantic search scales
- Real images in `RotatingImage`
- Migrate hosting Vercel → Coolify/Hetzner (Dockerfile is ready)
