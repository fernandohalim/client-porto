"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";

const chars = "!<>-_\\/[]{}—=+*^?#________";

interface DecryptTextProps {
  text: string;
  className?: string;
}

export default function DecryptText({
  text,
  className = "",
}: DecryptTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const spanRef = useRef<HTMLSpanElement>(null);

  const isInView = useInView(spanRef, {
    margin: "0px 0px -50px 0px",
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let iteration = 0;

    if (isInView) {
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (letter === " ") return " ";
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current!);
        }

        iteration += 2;
      }, 30);
    }

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [isInView, text]);

  return (
    <span ref={spanRef} className={`inline-block ${className}`}>
      {displayText}
    </span>
  );
}
