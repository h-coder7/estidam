"use client";

import { useEffect, useRef } from "react";

const RingGalaxy = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let disposed = false;
        let cleanup = () => {};

        import("./ringGalaxyScene").then(({ mountRingGalaxy }) => {
            if (disposed || !container.isConnected) return;
            cleanup = mountRingGalaxy(container);
        });

        return () => {
            disposed = true;
            cleanup();
        };
    }, []);

    return <div className="ring_galaxy" ref={containerRef} aria-hidden="true" />;
};

export default RingGalaxy;
