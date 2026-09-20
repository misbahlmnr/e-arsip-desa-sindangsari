import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { APP_DESCRIPTION } from "../constants";
import { fadeUp, stagger, useLandingMotion } from "../motion";
import HeroIllustration from "./HeroIllustration";

export default function Hero() {
    const motionProps = useLandingMotion();

    return (
        <section
            id="beranda"
            className="relative scroll-mt-24 overflow-hidden"
            aria-labelledby="hero-heading"
        >
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-soft/60 via-background to-background"
                aria-hidden
            />
            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
                <motion.div
                    variants={stagger}
                    {...motionProps}
                    className="max-w-xl"
                >
                    <motion.div variants={fadeUp}>
                        <Badge
                            variant="secondary"
                            className="rounded-md bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
                        >
                            E-Arsip Desa
                        </Badge>
                    </motion.div>
                    <motion.h1
                        id="hero-heading"
                        variants={fadeUp}
                        className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
                    >
                        Kelola Arsip Surat Desa
                        <span className="mt-1 block text-primary">
                            lebih cepat, lebih rapi, lebih terstruktur.
                        </span>
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        className="mt-5 text-base leading-relaxed text-muted-foreground"
                    >
                        Digitalisasi pengelolaan surat masuk, surat keluar,
                        disposisi, review, hingga arsip dalam satu sistem
                        terintegrasi.
                    </motion.p>
                    <p className="sr-only">{APP_DESCRIPTION}</p>
                    <motion.div
                        variants={fadeUp}
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                    >
                        <Button asChild size="lg" className="rounded-xl">
                            <Link href={route("login")}>Masuk ke Sistem</Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-xl"
                        >
                            <a href="#fitur">Pelajari Fitur</a>
                        </Button>
                    </motion.div>
                </motion.div>

                <motion.div variants={fadeUp} {...motionProps}>
                    <HeroIllustration />
                </motion.div>
            </div>
        </section>
    );
}
