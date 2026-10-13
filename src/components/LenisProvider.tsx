"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;

export function useLenis() {
  return lenisInstance;
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // 1. Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;
    setLenis(lenis);

    // 3. Update ScrollTrigger whenever Lenis scrolls
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Synchronize Lenis with GSAP's Ticker RAF
    function update(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // Disable lag smoothing in GSAP to avoid discrepancies
    gsap.ticker.lagSmoothing(0);

    // Clean up on component unmount
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisInstance = null;
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}