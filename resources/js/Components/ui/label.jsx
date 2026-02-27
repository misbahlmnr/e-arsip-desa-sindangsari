import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Custom Label component
 * @param {boolean} isRequired - If true, show red asterisk after label text
 */
const Label = React.forwardRef(
    ({ className, children, isRequired = false, ...props }, ref) => (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
        >
            {children}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </LabelPrimitive.Root>
    )
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
