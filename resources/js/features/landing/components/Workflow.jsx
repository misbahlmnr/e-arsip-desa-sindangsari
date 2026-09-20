import { motion } from "framer-motion";
import { WORKFLOW_STEPS } from "../constants";
import { fadeUp, stagger, useLandingMotion } from "../motion";

export default function Workflow() {
    const motionProps = useLandingMotion();

    return (
        <section
            id="alur"
            className="scroll-mt-24 py-16 sm:py-20"
            aria-labelledby="workflow-heading"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2
                        id="workflow-heading"
                        className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                    >
                        Alur pengelolaan surat
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Proses berjenjang mengikuti jabatan di kantor desa.
                    </p>
                </div>

                <motion.ol
                    variants={stagger}
                    {...motionProps}
                    className="relative mt-12 grid gap-8 lg:grid-cols-5 lg:gap-4"
                >
                    <span
                        className="absolute left-5 top-4 h-[calc(100%-2rem)] w-px bg-border lg:left-10 lg:right-10 lg:top-8 lg:h-px lg:w-auto"
                        aria-hidden
                    />
                    {WORKFLOW_STEPS.map((step, index) => (
                        <motion.li
                            key={step.title}
                            variants={fadeUp}
                            className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center"
                        >
                            <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm lg:size-16">
                                <step.icon
                                    className="size-5 lg:size-6"
                                    strokeWidth={2}
                                />
                            </span>
                            <div className="min-w-0 pt-1 lg:pt-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                                    Langkah {index + 1}
                                </p>
                                <h3 className="mt-1 text-base font-semibold text-foreground">
                                    {step.title}
                                </h3>
                                {step.note && (
                                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                        {step.note}
                                    </p>
                                )}
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </motion.li>
                    ))}
                </motion.ol>
            </div>
        </section>
    );
}
