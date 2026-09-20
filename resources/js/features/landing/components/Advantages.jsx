import { motion } from "framer-motion";
import { ADVANTAGE_ITEMS } from "../constants";
import { fadeUp, stagger, useLandingMotion } from "../motion";

export default function Advantages() {
    const motionProps = useLandingMotion();

    return (
        <section
            id="keunggulan"
            className="scroll-mt-24 py-16 sm:py-20"
            aria-labelledby="advantages-heading"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2
                        id="advantages-heading"
                        className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                    >
                        Keunggulan
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Dirancang agar administrasi surat desa lebih rapi tanpa
                        menambah langkah yang rumit.
                    </p>
                </div>

                <motion.ul
                    variants={stagger}
                    {...motionProps}
                    className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {ADVANTAGE_ITEMS.map((item) => (
                        <motion.li
                            key={item.title}
                            variants={fadeUp}
                            className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                                <item.icon className="size-5" strokeWidth={2} />
                            </span>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
}
