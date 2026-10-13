"use client";

import { useEffect, useState } from "react";

interface BackToTopProps {
    label: string;
}

const BackToTop = ({
    label,
}: BackToTopProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            className={`back_to_top ${
                visible ? "show" : ""
            }`}
            onClick={handleClick}
            aria-label={label}
        >
            <span>{label}</span>

            <i className="fa-regular fa-chevron-up"></i>
        </button>
    );
};

export default BackToTop;