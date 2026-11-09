"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "@/i18n/routing";
import { PAGE_FADE_MS } from "@/components/layout/pageFade";

let lenisInstance: Lenis | null = null;

const LenisContext = createContext<Lenis | null>(null);

/**
 * Reactive Lenis instance. Child effects run before the provider's effect, so a
 * module-level read returned `null` on first mount and consumers fell back to
 * native `window.scrollTo` (which fights Lenis → lag / mid-card stops).
 */
export function useLenis() {
  return useContext(LenisContext);
}

/** Non-reactive accessor for callbacks that run after mount. */
export function getLenis() {
  return lenisInstance;
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const instance = lenisInstance ?? lenis;
    if (!instance) return;

    const hash = window.location.hash;
    const scroll = () => {
      if (hash.length > 1) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          instance.scrollTo(target, { immediate: true, force: true });
          ScrollTrigger.refresh();
          return;
        }
      }

      instance.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      scroll();
      return;
    }

    const timer = window.setTimeout(scroll, PAGE_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, lenis]);

  useEffect(() => {
    // 1. Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis smooth scroll
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisInstance = instance;
    setLenis(instance);

    // 3. Update ScrollTrigger whenever Lenis scrolls
    instance.on("scroll", ScrollTrigger.update);

    // 4. Synchronize Lenis with GSAP's Ticker RAF
    function update(time: number) {
      instance.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // Disable lag smoothing in GSAP to avoid discrepancies
    gsap.ticker.lagSmoothing(0);

    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    // Clean up on component unmount
    return () => {
      history.scrollRestoration = previousRestoration;
      gsap.ticker.remove(update);
      instance.destroy();
      lenisInstance = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
