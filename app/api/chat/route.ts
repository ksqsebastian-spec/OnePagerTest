import { answer } from "@/lib/ai-provider";

export const runtime = "nodejs";

// Streams the answer back token-by-token so the chat can "type" the reply,
// the same way a real model stream would arrive. The optional generative-UI
// render hint rides along in a response header.
export async function POST(req: Request) {
  let message = "";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message : "";
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (!message.trim()) {
    return new Response("Empty message", { status: 400 });
  }

  const result = await answer(message);
  const words = result.text.split(/(\s+)/); // keep whitespace tokens

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        // Small delay to simulate generation cadence.
        await new Promise((r) => setTimeout(r, 28));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Render": result.render ?? "",
    },
  });
}
