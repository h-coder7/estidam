"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "@/i18n/routing";
import { PAGE_FADE_MS } from "./pageFade";

import "./_PageTransition.scss";

function FrozenRouter({ children }: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);
    const frozen = useRef(context).current;

    return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>;
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentPath = useRef(pathname);
    const [view, setView] = useState({ path: pathname, node: children });
    const [stage, setStage] = useState<"shown" | "out" | "in">("shown");

    useEffect(() => {
        if (pathname === currentPath.current) {
            setView((current) => (current.node === children ? current : { path: pathname, node: children }));
            return;
        }

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            currentPath.current = pathname;
            setView({ path: pathname, node: children });
            setStage("shown");
            return;
        }

        setStage("out");
        const timer = window.setTimeout(() => {
            currentPath.current = pathname;
            setView({ path: pathname, node: children });
            setStage("in");
        }, PAGE_FADE_MS);

        return () => window.clearTimeout(timer);
    }, [pathname, children]);

    const className = stage === "shown" ? "page_transition" : `page_transition is-${stage}`;

    return (
        <div key={view.path} className={className}>
            <FrozenRouter>{view.node}</FrozenRouter>
        </div>
    );
}
