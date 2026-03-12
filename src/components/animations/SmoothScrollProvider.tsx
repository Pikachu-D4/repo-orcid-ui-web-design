"use client";

import { useEffect, type ReactNode } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.scrollBehavior = isReduced ? "auto" : "smooth";

    const handleAnchorClick = (event: MouseEvent) => {
      if (isReduced) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.length <= 1) return;

      const section = document.querySelector(href);
      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return <>{children}</>;
}
