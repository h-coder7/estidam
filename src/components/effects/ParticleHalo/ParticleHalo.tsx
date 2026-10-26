"use client";

import { useEffect, useRef } from "react";

import "./_ParticleHalo.scss";

type ParticleHaloProps = {
    className?: string;
    placement?: "center" | "side";
    variant?: "hero" | "ring";
};

const ParticleHalo = ({
    className,
    placement = "center",
    variant = "ring",
}: ParticleHaloProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        let disposed = false;
        let cleanup = () => {};

        import("./particleHaloScene").then(({ mountParticleHalo }) => {
            if (disposed || !container.isConnected) return;
            cleanup = mountParticleHalo(container, { placement, variant });
        });

        return () => {
            disposed = true;
            cleanup();
        };
    }, [placement, variant]);

    const classes = className ? `particle_halo ${className}` : "particle_halo";

    return <div className={classes} ref={containerRef} aria-hidden="true" />;
};

export default ParticleHalo;
