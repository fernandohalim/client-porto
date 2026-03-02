"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TypewriterProps {
  command?: string;
  args: string;
  speed?: number;
  delay?: number;
}

export default function Typewriter({
  command = "",
  args,
  speed = 30, // <-- change this number to change the default typing interval
  delay = 0,
}: TypewriterProps) {
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef<HTMLHeadingElement>(null);

  // changed once to false so it detects view changes multiple times
  const isInView = useInView(containerRef, {
    once: false,
    margin: "0px 0px -50px 0px",
  });

  const totalLength = command.length + args.length;

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;
    let startTimeout: NodeJS.Timeout;
    let resetTimeout: NodeJS.Timeout;

    if (isInView) {
      startTimeout = setTimeout(() => {
        typingInterval = setInterval(() => {
          setCharIndex((current) => {
            if (current < totalLength) {
              return current + 1;
            } else {
              clearInterval(typingInterval);
              return current;
            }
          });
        }, speed);
      }, delay);
    } else {
      resetTimeout = setTimeout(() => {
        setCharIndex(0);
      }, 0);
    }

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typingInterval);
      clearTimeout(resetTimeout);
    };
  }, [isInView, totalLength, speed, delay]);

  const visibleCommand = command.substring(0, charIndex);
  const visibleArgs =
    charIndex > command.length
      ? args.substring(0, charIndex - command.length)
      : "";

  return (
    <h2
      ref={containerRef}
      className="text-xl font-mono text-zinc-400 flex items-center h-8"
    >
      <span>
        <span className="text-green-500">{visibleCommand}</span>
        {visibleArgs}
      </span>
      <span className="inline-block w-2.5 h-5 bg-green-500 ml-1 animate-blink"></span>
    </h2>
  );
}
