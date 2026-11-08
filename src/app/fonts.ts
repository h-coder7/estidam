import localFont from "next/font/local";

export const lamaSans = localFont({
    src: [
        { path: "../../public/fonts/LamaSans/LamaSans-Medium.ttf", weight: "400", style: "normal" },
        { path: "../../public/fonts/LamaSans/LamaSans-Medium.ttf", weight: "500", style: "normal" },
        { path: "../../public/fonts/LamaSans/LamaSans-Bold.ttf", weight: "600", style: "normal" },
        { path: "../../public/fonts/LamaSans/LamaSans-Bold.ttf", weight: "700", style: "normal" },
    ],
    variable: "--font-lama",
    display: "swap",
    adjustFontFallback: false,
    fallback: ["system-ui", "sans-serif"],
});

export const lamaSansBold = localFont({
    src: [
        { path: "../../public/fonts/LamaSans/LamaSans-Bold.ttf", weight: "400", style: "normal" },
        { path: "../../public/fonts/LamaSans/LamaSans-Bold.ttf", weight: "500", style: "normal" },
        { path: "../../public/fonts/LamaSans/LamaSans-Bold.ttf", weight: "600", style: "normal" },
        { path: "../../public/fonts/LamaSans/LamaSans-Bold.ttf", weight: "700", style: "normal" },
    ],
    variable: "--font-lama-bold",
    display: "swap",
    adjustFontFallback: false,
    fallback: ["system-ui", "sans-serif"],
});
