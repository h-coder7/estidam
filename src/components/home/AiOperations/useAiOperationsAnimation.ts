'use client';

import { RefObject, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registering twice is a no-op in GSAP, so this is safe alongside any
// existing registration in MotionProvider / animations/*.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * One master timeline + one ScrollTrigger, scoped to the section root.
 * - No Lenis instance is created; ScrollTrigger relies on the existing
 *   Lenis ↔ ScrollTrigger bridge in LenisProvider (lenis.on('scroll', ScrollTrigger.update)).
 * - Initial hidden states are set by GSAP (not CSS), so SSR / no-JS /
 *   reduced-motion users always see the complete static section.
 * - gsap.matchMedia reverts everything automatically on unmount.
 */
export function useAiOperationsAnimation(rootRef: RefObject<HTMLElement | null>, value: number) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767.98px)',
      },
      (ctx) => {
        const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
        if (!motion) return; // static, fully visible presentation

        const shift = mobile ? 10 : 18;
        const lines = q<SVGPathElement>('[data-ai$="line"]');
        lines.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });

        const ringBar = q<SVGCircleElement>('[data-ai="ring-bar"]')[0];
        const ringNum = q<HTMLElement>('[data-ai="ring-num"]')[0];
        const circ = Number(ringBar?.dataset.circ || 0);
        const counter = { v: 0 };

        // Initial states
        gsap.set(q('[data-ai="reveal"]'), { autoAlpha: 0, y: 24 });
        gsap.set(q('[data-ai="glow"]'), { autoAlpha: 0 });
        gsap.set(q('[data-ai="card"]'), { autoAlpha: 0, y: 32 });
        gsap.set(q('[data-ai="in-chip"]'), { autoAlpha: 0, x: -shift });
        gsap.set(q('[data-ai="out-chip"]'), { autoAlpha: 0, x: shift });
        gsap.set(q('[data-ai$="dot"]'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' });
        gsap.set(q('[data-ai="core"]'), { autoAlpha: 0, scale: 0.92 });
        gsap.set(q('[data-ai="core-halo"]'), { autoAlpha: 0 });
        gsap.set(q('[data-ai="core-inner"]'), { autoAlpha: 0, y: 8 });
        gsap.set(q('[data-ai="ready-text"]'), { autoAlpha: 0, y: 14 });
        gsap.set(q('[data-ai="ready-chip"]'), { autoAlpha: 0, scale: 0.9 });
        gsap.set(q('[data-ai="outcome-label"], [data-ai="outcome-chip"]'), { autoAlpha: 0, y: 12 });
        gsap.set(q('[data-ai="outcome-arrow"]'), { autoAlpha: 0, x: -6 });
        if (ringBar) gsap.set(ringBar, { strokeDashoffset: circ });
        if (ringNum) ringNum.textContent = '0';

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', duration: 0.6 },
          scrollTrigger: {
            trigger: root,
            start: 'top 70%',
            // play forward on entry, reverse only when scrolled fully back above
            toggleActions: 'play none none reverse',
          },
        });

        // A — intro
        tl.to(q('[data-ai="glow"]'), { autoAlpha: 1, duration: 1.2 }, 0)
          .to(q('[data-ai="reveal"]'), { autoAlpha: 1, y: 0, stagger: 0.12 }, 0)
          .to(q('[data-ai="card"]'), { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.8 }, 0.25);

        // B — inputs → lines
        tl.to(q('[data-ai="in-chip"]'), { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.45 }, 0.7)
          .to(q('[data-ai="in-dot"]'), { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.3 }, 0.85)
          .to(q('[data-ai="in-line"]'), { strokeDashoffset: 0, stagger: 0.1, duration: 0.8, ease: 'power2.inOut' }, 0.9);

        // C — core activation
        tl.to(q('[data-ai="core"]'), { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }, 1.55)
          .to(q('[data-ai="core-halo"]'), { autoAlpha: 1, duration: 0.8 }, 1.7)
          .to(q('[data-ai="core-inner"]'), { autoAlpha: 1, y: 0, duration: 0.5 }, 1.8);

        // D — outputs
        const outLines = q('[data-ai="out-line"]');
        const outChips = q('[data-ai="out-chip"]');
        const outDots = q('[data-ai="out-dot"]');
        outLines.forEach((line, i) => {
          const at = 2.1 + i * 0.18;
          tl.to(line, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, at)
            .to(outDots[i], { autoAlpha: 1, scale: 1, duration: 0.25 }, at + 0.5)
            .to(outChips[i], { autoAlpha: 1, x: 0, duration: 0.4 }, at + 0.5);
        });

        // E — readiness
        tl.to(q('[data-ai="ready-text"]'), { autoAlpha: 1, y: 0, stagger: 0.1 }, 2.4)
          .to(q('[data-ai="ready-chip"]'), { autoAlpha: 1, scale: 1, stagger: 0.07, duration: 0.4 }, 2.6)
          .to(q('[data-ai="ready-dot"]'), { autoAlpha: 1, scale: 1, stagger: 0.05, duration: 0.25 }, 2.75)
          .to(q('[data-ai="ready-line"]'), { strokeDashoffset: 0, stagger: 0.05, duration: 0.6, ease: 'power2.inOut' }, 2.8);
        if (ringBar && ringNum) {
          tl.to(
            counter,
            {
              v: value,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => {
                // Circle and number derive from the same value → always in sync.
                ringBar.style.strokeDashoffset = String(circ * (1 - counter.v / 100));
                ringNum.textContent = String(Math.round(counter.v));
              },
            },
            3.0,
          );
        }

        // F — outcome flow
        const flowChips = q('[data-ai="outcome-chip"]');
        const arrows = q('[data-ai="outcome-arrow"]');
        tl.to(q('[data-ai="outcome-label"]'), { autoAlpha: 1, y: 0, duration: 0.4 }, 3.4);
        flowChips.forEach((chip, i) => {
          const at = 3.5 + i * 0.22;
          if (i > 0) tl.to(arrows[i - 1], { autoAlpha: 1, x: 0, duration: 0.3 }, at - 0.1);
          tl.to(chip, { autoAlpha: 1, y: 0, duration: 0.4 }, at);
        });

        // Ambient loops (desktop only, transform/opacity only, paused off-screen)
        const loops: gsap.core.Tween[] = [];
        if (!mobile) {
          loops.push(
            gsap.to(q('[data-ai="core-halo"]'), {
              opacity: 0.55, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true,
            }),
            gsap.fromTo(
              q('[data-ai="core-sheen"]'),
              { xPercent: -120 },
              { xPercent: 120, duration: 4.5, ease: 'sine.inOut', repeat: -1, repeatDelay: 2.5, paused: true },
            ),
          );
          tl.call(() => loops.forEach((l) => l.play()), undefined, 2.4);
        }

        const visibility = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => loops.forEach((l) => (self.isActive && tl.progress() > 0.6 ? l.play() : l.pause())),
        });

        return () => {
          loops.forEach((l) => l.kill());
          visibility.kill();
        };
      },
    );

    // Fonts/images above can shift layout after hydration.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});

    return () => mm.revert();
  }, [rootRef, value]);
}
