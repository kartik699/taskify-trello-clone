"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";

import { FormSubmit } from "./form-submit";
import { FormInput } from "./form-input";
import { FormPicker } from "./form-picker";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
}: FormPopoverProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            // toast for showing success message for creating a board
            toast.success("Board created!");
            closeRef.current?.click(); // close the popover
            router.push(`/board/${data.id}`); // redirect to the created board (page
        },
        onError: (error) => {
            // toast for showing error message for creating a board
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title, image });
    };

    if (!isMounted) {
        return null;
    }

    // Popover UI for creating a board
    return (
        <Popover>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent
                side={side}
                align={align}
                className="w-80 pt-3"
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </PopoverClose>
                <form className="space-y-4" action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker id="image" errors={fieldErrors} />
                        <FormInput
                            id="title"
                            label="Board Title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">Create</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
