"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export const DEFAULT_SPEECH_LANG = "en-US";

// Minimal types: the Web Speech API is not in every TypeScript DOM lib.
interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}
interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => RecognitionLike;

function getCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noopSubscribe = () => () => {};

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed":
    "Microphone access is blocked. Allow it in your browser's site settings and try again.",
  "service-not-allowed":
    "Microphone access is blocked. Allow it in your browser's site settings and try again.",
  "audio-capture": "No microphone was found.",
  network:
    "The browser's speech service could not be reached. Check your connection.",
};

interface Options {
  lang?: string;
  onFinalText: (text: string) => void;
}

export function useSpeechRecognition({
  lang = DEFAULT_SPEECH_LANG,
  onFinalText,
}: Options) {
  // false on the server and during hydration, then the real answer on the client
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => getCtor() !== null,
    () => false
  );

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState("");
  const [listeningSeconds, setListeningSeconds] = useState(0);

  const recRef = useRef<RecognitionLike | null>(null);
  const wantListeningRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef(0);
  const onFinalRef = useRef(onFinalText);

  useEffect(() => {
    onFinalRef.current = onFinalText;
  }, [onFinalText]);

  const flushTimer = useCallback(() => {
    if (startedAtRef.current === null) return;
    accumulatedMsRef.current += Date.now() - startedAtRef.current;
    startedAtRef.current = null;
    setListeningSeconds(accumulatedMsRef.current / 1000);
  }, []);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    flushTimer();
    recRef.current?.stop();
    setListening(false);
    setInterim("");
  }, [flushTimer]);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor || wantListeningRef.current) return;

    setError(null);
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const piece = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += piece;
        else interimText += piece;
      }

      const cleaned = finalText.trim();
      if (cleaned) {
        setSpokenText((prev) => (prev ? `${prev} ${cleaned}` : cleaned));
        onFinalRef.current(cleaned);
      }
      if (wantListeningRef.current) setInterim(interimText);
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setError(ERROR_MESSAGES[e.error] ?? "Voice input stopped unexpectedly.");
      wantListeningRef.current = false;
      flushTimer();
      setListening(false);
      setInterim("");
    };

    rec.onend = () => {
      // Browsers end a session after a pause; keep going if the user hasn't stopped.
      if (wantListeningRef.current) {
        try {
          rec.start();
        } catch {
          wantListeningRef.current = false;
          flushTimer();
          setListening(false);
          setInterim("");
        }
      } else {
        setListening(false);
        setInterim("");
      }
    };

    recRef.current = rec;
    wantListeningRef.current = true;
    startedAtRef.current = Date.now();
    try {
      rec.start();
      setListening(true);
    } catch {
      wantListeningRef.current = false;
      startedAtRef.current = null;
      setError("Could not start voice input. Please try again.");
    }
  }, [lang, flushTimer]);

  useEffect(
    () => () => {
      wantListeningRef.current = false;
      recRef.current?.abort();
    },
    []
  );

  return {
    supported,
    listening,
    interim,
    error,
    spokenText,
    listeningSeconds,
    start,
    stop,
  };
}