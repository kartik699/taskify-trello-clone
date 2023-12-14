"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormSubmitProps {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?:
        | "default"
        | "primary"
        | "destructive"
        | "outline"
        | "link"
        | "secondary"
        | "ghost";
}

export const FormSubmit = ({
    children,
    disabled,
    className,
    variant,
}: FormSubmitProps) => {
    const { pending } = useFormStatus();

    return (
        <Button
            disabled={disabled || pending}
            variant={variant}
            className={cn(className)}
            type="submit"
            size="sm"
        >
            {children}
        </Button>
    );
};
