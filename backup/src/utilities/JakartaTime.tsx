"use client";

import { useEffect, useState } from "react";

// live jakarta wall-clock — updates every second client-side.
// gracefully renders an empty placeholder during ssr to avoid hydration mismatch.
export default function JakartaTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now);
      setTime(formatted);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time || "--:--:--"} WIB</span>;
}
