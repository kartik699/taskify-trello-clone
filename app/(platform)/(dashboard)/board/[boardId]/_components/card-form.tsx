"use client";

import { forwardRef } from "react";

interface CardFormProps {
    listId: string;
    isEditing: boolean;
    enableEditing: () => void;
    disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
    ({ disableEditing, enableEditing, isEditing, listId }, ref) => {
        return <div>Card Form!</div>;
    }
);

CardForm.displayName = "CardForm";
