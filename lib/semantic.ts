// Lightweight, dependency-free "semantic" matcher.
//
// It builds TF-IDF vectors over the question phrasings in the knowledge base and
// scores an incoming message by cosine similarity. It's not a neural embedding
// model, but it's fully offline, instant, and good enough to feel responsive for
// a tech demo. When a real model API arrives, only lib/ai-provider.ts changes —
// this file can stay as an offline fallback.

import { QA, FALLBACK_ANSWER, type QAEntry } from "./qa-data";

const STOPWORDS = new Set([
  "der", "die", "das", "und", "ist", "ein", "eine", "ich", "du", "wie", "was",
  "ihr", "wir", "mir", "mich", "ihr", "the", "a", "an", "to", "me", "you", "i",
  "of", "for", "is", "are", "do", "does",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-zäöüß0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

type Vector = Map<string, number>;

// --- Build the IDF table + per-entry vectors once at module load. ----------

interface IndexedEntry {
  entry: QAEntry;
  vector: Vector;
}

const docs: { id: string; tokens: string[] }[] = QA.map((e) => ({
  id: e.id,
  // Pool all phrasings for an entry into one document.
  tokens: e.questions.flatMap(tokenize),
}));

const df = new Map<string, number>();
for (const doc of docs) {
  for (const term of new Set(doc.tokens)) {
    df.set(term, (df.get(term) ?? 0) + 1);
  }
}

const N = docs.length;
const idf = (term: string) => Math.log((N + 1) / ((df.get(term) ?? 0) + 1)) + 1;

function toVector(tokens: string[]): Vector {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  const vec: Vector = new Map();
  for (const [term, count] of tf) {
    vec.set(term, (count / tokens.length) * idf(term));
  }
  return vec;
}

const indexed: IndexedEntry[] = QA.map((entry, i) => ({
  entry,
  vector: toVector(docs[i].tokens),
}));

function cosine(a: Vector, b: Vector): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const v of a.values()) normA += v * v;
  for (const v of b.values()) normB += v * v;
  // Iterate the smaller vector for the dot product.
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [term, val] of small) {
    const other = large.get(term);
    if (other) dot += val * other;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface MatchResult {
  answer: string;
  render?: QAEntry["render"];
  matched: boolean;
  score: number;
  entryId?: string;
}

const THRESHOLD = 0.12;

export function match(message: string): MatchResult {
  const queryVec = toVector(tokenize(message));
  let best: IndexedEntry | null = null;
  let bestScore = 0;

  for (const item of indexed) {
    const score = cosine(queryVec, item.vector);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore >= THRESHOLD) {
    return {
      answer: best.entry.answer,
      render: best.entry.render,
      matched: true,
      score: bestScore,
      entryId: best.entry.id,
    };
  }

  return { answer: FALLBACK_ANSWER, matched: false, score: bestScore };
}
