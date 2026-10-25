"use client";

import { useEffect, useRef } from "react";

const ParticleHalo = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        let disposed = false;
        let cleanup = () => {};

        import("./particleHaloScene").then(({ mountParticleHalo }) => {
            if (disposed || !container.isConnected) return;
            cleanup = mountParticleHalo(container);
        });

        return () => {
            disposed = true;
            cleanup();
        };
    }, []);

    return <div className="hero_particles" ref={containerRef} aria-hidden="true" />;
};

export default ParticleHalo;
