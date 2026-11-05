"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    // Clean up on component unmount
    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      lenisInstance = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
