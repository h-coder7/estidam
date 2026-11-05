"use client";

import { useEffect, useRef } from "react";

const WaveGalaxy = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let disposed = false;
        let cleanup = () => {};

        import("./waveGalaxyScene").then(({ mountWaveGalaxy }) => {
            if (disposed || !container.isConnected) return;
            cleanup = mountWaveGalaxy(container);
        });

        return () => {
            disposed = true;
            cleanup();
        };
    }, []);

    return <div className="wave_galaxy" ref={containerRef} aria-hidden="true" />;
};

export default WaveGalaxy;
