import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function useTypewriter(phrases: string[], options: UseTypewriterOptions = {}) {
  const { typingSpeed = 70, deletingSpeed = 35, pauseTime = 1600 } = options;
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return undefined;

    const current = phrases[phraseIndex % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}