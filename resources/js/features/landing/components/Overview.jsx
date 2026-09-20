import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { OVERVIEW_ITEMS } from "../constants";
import { fadeUp, stagger, useLandingMotion } from "../motion";

export default function Overview() {
    const motionProps = useLandingMotion();

    return (
        <section
            id="ringkasan"
            className="scroll-mt-24 py-16 sm:py-20"
            aria-labelledby="overview-heading"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2
                        id="overview-heading"
                        className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                    >
                        Ringkasan sistem
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Empat fungsi utama untuk administrasi surat Kantor Desa
                        Sindangsari.
                    </p>
                </div>

                <motion.ul
                    variants={stagger}
                    {...motionProps}
                    className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {OVERVIEW_ITEMS.map((item) => (
                        <motion.li key={item.title} variants={fadeUp}>
                            <Card className="h-full rounded-xl border-border shadow-sm">
                                <CardContent className="p-6">
                                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                                        <item.icon
                                            className="size-5"
                                            strokeWidth={2}
                                        />
                                    </span>
                                    <h3 className="mt-4 text-base font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
}
