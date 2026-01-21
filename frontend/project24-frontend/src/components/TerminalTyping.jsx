import { useEffect, useRef, useState } from "react";
import beep from "../assets/terminal-beep.mp3";

export default function TerminalTyping({ text, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");
  const audioRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio(beep);
    audioRef.current.volume = 0.15;
  }, []);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(indexRef.current));

      // Play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      indexRef.current++;

      if (indexRef.current >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
      {displayedText}
      <span className="cursor">█</span>
    </pre>
  );
}
