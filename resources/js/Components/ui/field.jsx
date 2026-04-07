import { cn } from "@/lib/utils";
import { Label } from "@/Components/ui/label";

const Field = ({ className, "data-invalid": dataInvalid, ...props }) => {
    return (
        <div
            className={cn("space-y-2", dataInvalid && "text-red-600", className)}
            {...props}
        />
    );
};

const FieldLabel = ({ className, htmlFor, ...props }) => {
    return (
        <Label
            htmlFor={htmlFor}
            className={cn("text-sm font-medium", className)}
            {...props}
        />
    );
};

const FieldDescription = ({ className, ...props }) => {
    return (
        <p className={cn("text-xs text-muted-foreground", className)} {...props} />
    );
};

const FieldError = ({ errors = [], className }) => {
    const messages = (Array.isArray(errors) ? errors : [errors])
        .map((err) => {
            if (!err) return null;
            if (typeof err === "string") return err;
            return err.message || err?.messages?.[0] || null;
        })
        .filter(Boolean);

    if (messages.length === 0) return null;

    return (
        <div
            className={cn("text-xs font-medium text-red-600", className)}
            aria-live="polite"
        >
            {messages.map((msg, idx) => (
                <p key={idx}>{msg}</p>
            ))}
        </div>
    );
};

export { Field, FieldLabel, FieldDescription, FieldError };

