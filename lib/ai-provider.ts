// Single swap-point between the fake AI and a real model.
//
// Today this delegates to the offline semantic matcher. When you're ready for a
// real model, install the Vercel AI SDK (`npm i ai @ai-sdk/openai` or any
// provider — it's a plain npm package and runs anywhere Node runs, including
// Coolify/Hetzner, NOT just on Vercel) and replace the body of `answer()` with a
// `generateText` / `streamText` call. Everything upstream (the API route, the
// chat UI, the generative-UI render hints) stays unchanged.

import { match, type MatchResult } from "./semantic";

export interface AnswerResult {
  text: string;
  /** Optional generative-UI component the client should render + reflow around. */
  render?: MatchResult["render"];
  /** Diagnostics — handy while the "AI" is faked. */
  meta: { matched: boolean; score: number; entryId?: string };
}

export async function answer(message: string): Promise<AnswerResult> {
  const result = match(message);
  return {
    text: result.answer,
    render: result.render,
    meta: { matched: result.matched, score: result.score, entryId: result.entryId },
  };
}
