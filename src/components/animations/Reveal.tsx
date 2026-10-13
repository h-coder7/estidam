"use client";

import { m } from "motion/react";
import { ReactNode } from "react";

export type AnimationType =
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "fade-up-left"
    | "fade-up-right"
    | "fade-down-left"
    | "fade-down-right"
    | "zoom-in"
    | "zoom-out"
    | "zoom-in-up"
    | "zoom-in-down"
    | "zoom-in-left"
    | "zoom-in-right"
    | "zoom-out-up"
    | "zoom-out-down"
    | "zoom-out-left"
    | "zoom-out-right"
    | "flip-left"
    | "flip-right"
    | "flip-up"
    | "flip-down"
    | "slide-ltr"
    | "slide-rtl"
    ;

type RevealProps = {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
    once?: boolean;
    amount?: number;
    className?: string;
    trigger?: "view" | "load";
};

const show = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
};

const fade = (x = 0, y = 0) => ({
    initial: {
        opacity: 0,
        x,
        y,
    },
    animate: show,
});

const zoom = (scale: number, x = 0, y = 0) => ({
    initial: {
        opacity: 0,
        scale,
        x,
        y,
    },
    animate: show,
});

const flip = (
    rotateX = 0,
    rotateY = 0
) => ({
    initial: {
        opacity: 0,
        rotateX,
        rotateY,
    },
    animate: show,
});

const slide = (direction: "ltr" | "rtl") => ({
    initial: {
        opacity: 1,
        x: direction === "ltr" ? 40 : -40,
    },
    animate: {
        opacity: 1,
        x: 0,
    },
});

const animations: Record<AnimationType, any> = {

    // Fade
    "fade-up": fade(0, 24),
    "fade-down": fade(0, -24),
    "fade-left": fade(-24, 0),
    "fade-right": fade(24, 0),

    "fade-up-left": fade(-24, 24),
    "fade-up-right": fade(24, 24),
    "fade-down-left": fade(-24, -24),
    "fade-down-right": fade(24, -24),

    // Zoom
    "zoom-in": zoom(.7),

    "zoom-in-up": zoom(.7, 0, 60),
    "zoom-in-down": zoom(.7, 0, -60),
    "zoom-in-left": zoom(.7, -60),
    "zoom-in-right": zoom(.7, 60),

    "zoom-out": zoom(1.3),

    "zoom-out-up": zoom(1.3, 0, 60),
    "zoom-out-down": zoom(1.3, 0, -60),
    "zoom-out-left": zoom(1.3, -60),
    "zoom-out-right": zoom(1.3, 60),

    // Flip
    "flip-left": flip(0, -90),
    "flip-right": flip(0, 90),
    "flip-up": flip(-90, 0),
    "flip-down": flip(90, 0),

    // slide
    "slide-ltr": slide("ltr"),
    "slide-rtl": slide("rtl"),
};

export default function Reveal({
    children,
    animation = "fade-up",
    delay = 0.25,
    duration = 0.7,
    once = true,
    amount = 0.18,
    className,
    trigger = "view",
}: RevealProps) {

    const variant = animations[animation];

    return (
        <m.div
            className={className}
            initial={variant.initial}
            whileInView={variant.animate}
            viewport={{
                once,
                amount,
            }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </m.div>
    );
}