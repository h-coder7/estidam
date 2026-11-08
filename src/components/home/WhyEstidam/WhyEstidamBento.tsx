"use client";

import { ComponentType, useEffect, useLayoutEffect, useRef } from "react";

import { WHY_SCENES } from "./WhyEstidamScenes";
import { initWhyEstidamMotion } from "./whyEstidamMotion";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type WhyEstidamCard = {
    key: string;
    label: string;
    title: string;
    titleRest: string;
    text: string;
};

type Props = {
    cards: WhyEstidamCard[];
    conceptLabel?: string;
};

/** Layout slot per approved capability position: 01 & 04 wide, 02 & 03 narrow. */
function sceneAt(index: number): ComponentType | null {
    return index < WHY_SCENES.length ? WHY_SCENES[index] : null;
}

const SLOT = ["is-wide", "is-narrow", "is-narrow", "is-wide"] as const;

export default function WhyEstidamBento({ cards, conceptLabel = "Concept workflow" }: Props) {
    const rootRef = useRef<HTMLDivElement>(null);

    useIsoLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        return initWhyEstidamMotion(root);
    }, [cards.length]);

    return (
        <div className="we-root" ref={rootRef}>
            <div className="we-bento">
                <span className="we-x is-tl" aria-hidden="true" />
                <span className="we-x is-tr" aria-hidden="true" />
                <span className="we-x is-bl" aria-hidden="true" />
                <span className="we-x is-br" aria-hidden="true" />

                {cards.map((card, index) => {
                    const Scene = sceneAt(index);
                    const slot = SLOT[index] ?? "is-extra";
                    const number = String(index + 1).padStart(2, "0");
                    const marker = card.label ? `${number} / ${card.label}` : number;
                    const title = (
                        <h3 className="we-cell-title" data-we-fade="">
                            <span>{card.title}</span>
                            {card.titleRest ? <span> {card.titleRest}</span> : null}
                        </h3>
                    );
                    const text = (
                        <p className="we-cell-text" data-we-fade="">
                            {card.text}
                        </p>
                    );

                    return (
                        <article
                            key={card.key}
                            className={`we-cell ${slot} is-pos-${index + 1}`}
                            data-we-cell={index}
                            tabIndex={Scene ? 0 : undefined}
                            aria-label={Scene ? `${card.title} ${card.titleRest}`.trim() : undefined}
                        >
                            <div className="we-cell-meta" data-we-fade="">
                                <span>{marker}</span>
                                {Scene ? <span className="we-tag">{conceptLabel}</span> : null}
                            </div>

                            {Scene ? (
                                <div className="we-scene" data-we-scene="">
                                    <Scene />
                                </div>
                            ) : null}

                            {slot === "is-wide" ? (
                                <div className="we-cell-copy">
                                    {title}
                                    {text}
                                </div>
                            ) : (
                                <>
                                    {title}
                                    {text}
                                </>
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
