"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type WorkStep = {
    title: string;
    text: string;
};

const ProductWorksSteps = ({ steps }: { steps: WorkStep[] }) => {
    const listRef = useRef<HTMLOListElement>(null);
    const [activeCount, setActiveCount] = useState(0);

    useEffect(() => {
        const node = listRef.current;
        if (!node || steps.length === 0) return;

        const timers: number[] = [];
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const play = () => {
            if (reduced) {
                setActiveCount(steps.length);
                return;
            }

            for (let index = 0; index < steps.length; index += 1) {
                timers.push(window.setTimeout(() => setActiveCount(index + 1), 180 + index * 420));
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                observer.disconnect();
                play();
            },
            { threshold: 0.45 },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
            timers.forEach((id) => window.clearTimeout(id));
        };
    }, [steps.length]);

    const line = activeCount === 0 ? 0 : (activeCount - 0.5) / steps.length;

    return (
        <ol
            ref={listRef}
            className="products_works_steps"
            style={{ "--works-columns": steps.length, "--works-line": line } as CSSProperties}
        >
            <img
                className="products_works_line"
                src="/images/product-det/works-line.svg"
                alt=""
                width={1286}
                height={1}
            />
            <img
                className="products_works_line_active"
                src="/images/product-det/works-line-active.svg"
                alt=""
                width={313}
                height={1}
            />
            {steps.map((step, index) => {
                const active = index < activeCount;
                const number = String(index + 1).padStart(2, "0");

                return (
                    <li className={`products_works_step${active ? " is-active" : ""}`} key={number}>
                        <span className="products_works_marker">
                            <img
                                className="products_works_ring"
                                src="/images/product-det/works-step-ring.svg"
                                alt=""
                                width={46}
                                height={46}
                            />
                            <img
                                className="products_works_face is-idle"
                                src="/images/product-det/works-step-idle.svg"
                                alt=""
                                width={40}
                                height={40}
                            />
                            <img
                                className="products_works_face is-on"
                                src="/images/product-det/works-step-active.svg"
                                alt=""
                                width={40}
                                height={40}
                            />
                            <span className="products_works_num">{number}</span>
                        </span>
                        <h3 className="products_works_step_title fw-500">{step.title}</h3>
                        <p className="products_works_step_text mb-0">{step.text}</p>
                    </li>
                );
            })}
        </ol>
    );
};

export default ProductWorksSteps;
