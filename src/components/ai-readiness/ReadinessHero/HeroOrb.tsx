"use client";

import dynamic from "next/dynamic";

const HeroOrbScene = dynamic(() => import("./HeroOrbScene"), { ssr: false });

export default function HeroOrb() {
    return <HeroOrbScene />;
}
