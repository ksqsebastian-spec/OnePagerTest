// Knowledge base for the fake-AI semantic matcher.
//
// Each entry has trigger phrasings (`questions`) and the `answer` we return when
// an incoming message matches. This is intentionally data-only so it stays easy
// to edit, and so it can later be embedded into a vector store (e.g. Supabase
// pgvector) or replaced wholesale by a real model — see lib/ai-provider.ts.

export interface QAEntry {
  id: string;
  questions: string[];
  answer: string;
  /** Optional UI component the chat can ask the layout to render (generative UI hook). */
  render?: "portfolio" | "booking" | "contact" | "about";
}

export const QA: QAEntry[] = [
  {
    id: "greeting",
    questions: ["hallo", "moin", "hi", "hey", "guten tag", "servus", "na"],
    answer: "Moin! Schön, dass du da bist. Frag mich, was du brauchst — oder nutze die Buttons unten links.",
  },
  {
    id: "portfolio",
    questions: [
      "portfolio",
      "was habt ihr gemacht",
      "eure arbeiten",
      "projekte",
      "referenzen",
      "zeig mir eure arbeit",
      "beispiele",
    ],
    answer: "Klar — hier ist eine Auswahl unserer Arbeiten.",
    render: "portfolio",
  },
  {
    id: "booking",
    questions: [
      "termin",
      "termin buchen",
      "appointment",
      "buchen",
      "meeting",
      "wann habt ihr zeit",
      "kennenlernen",
      "call buchen",
    ],
    answer: "Lass uns reden. Wähl dir einen Slot, der dir passt.",
    render: "booking",
  },
  {
    id: "contact",
    questions: [
      "anrufen",
      "call me",
      "kontakt",
      "telefon",
      "wie erreiche ich euch",
      "email",
      "schreiben",
    ],
    answer: "Am schnellsten erreichst du uns hier.",
    render: "contact",
  },
  {
    id: "about",
    questions: [
      "über euch",
      "about",
      "wer seid ihr",
      "was macht ihr",
      "was ist seehafer",
      "über uns",
    ],
    answer:
      "Seehafer ist ein kleines Studio für digitale Produkte — wir bauen Websites, Tools und Markenauftritte mit Fokus auf klares Design.",
    render: "about",
  },
  {
    id: "pricing",
    questions: ["preis", "kosten", "was kostet", "preise", "budget", "wie teuer"],
    answer:
      "Preise hängen vom Umfang ab. Erzähl mir kurz von deinem Projekt — oder buch einen Termin, dann gehen wir es zusammen durch.",
  },
];

export const FALLBACK_ANSWER =
  "Gute Frage — dazu habe ich gerade keine fertige Antwort. Probier eine der Optionen unten links, oder buch einen kurzen Call.";
