import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Primary palette - Vibrant gradient colors
                primary: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                    950: "#082f49",
                },
                // Accent colors for highlights
                accent: {
                    purple: "#a855f7",
                    pink: "#ec4899",
                    cyan: "#06b6d4",
                    emerald: "#10b981",
                },
                // Dark theme colors
                dark: {
                    bg: "#0a0a0f",
                    card: "#13131a",
                    border: "#1f1f2e",
                    text: "#e4e4e7",
                    muted: "#71717a",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-down": "slideDown 0.3s ease-out",
                "scale-in": "scaleIn 0.3s ease-out",
                "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
                "float": "float 6s ease-in-out infinite",
                "gradient": "gradient 8s ease infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                typing: {
                    "from": { width: "0" },
                    "to": { width: "100%" },
                },
                "blink-caret": {
                    "from, to": { borderColor: "transparent" },
                    "50%": { borderColor: "currentColor" },
                },
                glow: {
                    "from": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)" },
                    "to": { boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                gradient: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(135deg, #0ea5e9 0%, #a855f7 50%, #ec4899 100%)",
            },
            boxShadow: {
                "glow-sm": "0 0 15px rgba(14, 165, 233, 0.3)",
                "glow-md": "0 0 25px rgba(14, 165, 233, 0.4)",
                "glow-lg": "0 0 35px rgba(168, 85, 247, 0.4)",
            },
        },
    },
    plugins: [],
};

export default config;
