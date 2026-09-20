import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { fadeUp, useLandingMotion } from "../motion";

export default function Cta() {
    const motionProps = useLandingMotion();

    return (
        <section
            className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-20"
            aria-labelledby="cta-heading"
        >
            <motion.div
                variants={fadeUp}
                {...motionProps}
                className="mx-auto max-w-3xl text-center"
            >
                <h2
                    id="cta-heading"
                    className="text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                    Siap menggunakan
                    <span className="mt-1 block">
                        E-Arsip Desa Sindangsari?
                    </span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                    Masuk dengan akun petugas untuk mengelola surat masuk, surat
                    keluar, disposisi, dan arsip desa.
                </p>
                <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="mt-8 rounded-xl"
                >
                    <Link href={route("login")}>Masuk ke Sistem</Link>
                </Button>
            </motion.div>
        </section>
    );
}
