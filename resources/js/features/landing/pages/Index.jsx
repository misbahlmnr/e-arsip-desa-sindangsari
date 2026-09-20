import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import Advantages from "../components/Advantages";
import Cta from "../components/Cta";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Overview from "../components/Overview";
import Workflow from "../components/Workflow";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "../constants";

export default function LandingPage() {
    useEffect(() => {
        document.documentElement.classList.add("scroll-smooth");
        return () => {
            document.documentElement.classList.remove("scroll-smooth");
        };
    }, []);

    return (
        <>
            <Head title={APP_NAME}>
                <meta name="description" content={APP_DESCRIPTION} />
            </Head>

            <div className="h-full min-h-full overflow-y-auto overflow-x-hidden bg-background">
                <a
                    href="#konten-utama"
                    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow-sm"
                >
                    Lewati ke konten
                </a>
                <Navbar />
                <main id="konten-utama">
                    <p className="sr-only">{APP_TAGLINE}</p>
                    <Hero />
                    <Overview />
                    <Features />
                    <Workflow />
                    <Advantages />
                    <Cta />
                </main>
                <Footer />
            </div>
        </>
    );
}
