import { useReducedMotion } from "framer-motion";

export const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

export const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};

export function useLandingMotion() {
    const reduce = useReducedMotion();

    return {
        initial: reduce ? false : "hidden",
        whileInView: reduce ? undefined : "visible",
        viewport: { once: true, amount: 0.2 },
    };
}
