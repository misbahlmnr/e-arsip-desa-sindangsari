import { cn } from "@/shared/lib/utils";

export default function BrandLogo({ className, alt = "Lambang Kabupaten Pangandaran" }) {
    return (
        <img
            src="/images/logo-pangandaran.png?v=2"
            alt={alt}
            className={cn("object-contain", className)}
        />
    );
}
