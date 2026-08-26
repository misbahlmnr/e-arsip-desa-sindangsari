import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function BackLink({ href, children = "Kembali ke daftar" }) {
    return (
        <div className="mb-6">
            <Button
                variant="ghost"
                asChild
                className="-ml-2 text-muted-foreground"
            >
                <Link href={href}>
                    <ArrowLeft className="size-4 mr-1.5" />
                    {children}
                </Link>
            </Button>
        </div>
    );
}
