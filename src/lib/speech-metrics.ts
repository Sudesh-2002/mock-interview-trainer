export interface FillerCount {
  label: string;
  count: number;
}

export interface SpeechStats {
  words: number;
  seconds: number;
  wpm: number | null;
  fillerTotal: number;
  fillers: FillerCount[];
}

const FILLERS: { label: string; pattern: RegExp }[] = [
  { label: "um / uh", pattern: /\b(?:um+|uh+|erm+|er)\b/gi },
  { label: "you know", pattern: /\byou know\b/gi },
  { label: "I mean", pattern: /\bi mean\b/gi },
  { label: "basically", pattern: /\bbasically\b/gi },
  { label: "actually", pattern: /\bactually\b/gi },
  { label: "literally", pattern: /\bliterally\b/gi },
  { label: "sort of / kind of", pattern: /\b(?:sort|kind) of\b/gi },
];

export function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function countFillers(text: string): FillerCount[] {
  return FILLERS.map(({ label, pattern }) => ({
    label,
    count: text.match(pattern)?.length ?? 0,
  }))
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count);
}

const MIN_WORDS_FOR_PACE = 10;
const MIN_SECONDS_FOR_PACE = 10;

export function buildSpeechStats(text: string, seconds: number): SpeechStats | null {
  const words = countWords(text);
  if (words === 0) return null;

  const fillers = countFillers(text);
  const wpm =
    words >= MIN_WORDS_FOR_PACE && seconds >= MIN_SECONDS_FOR_PACE
      ? Math.round(words / (seconds / 60))
      : null;

  return {
    words,
    seconds,
    wpm,
    fillerTotal: fillers.reduce((sum, f) => sum + f.count, 0),
    fillers,
  };
}

export function paceLabel(wpm: number) {
  if (wpm < 110) return "A bit slow";
  if (wpm <= 170) return "Good pace";
  return "A bit fast";
}

export function formatDuration(seconds: number) {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}