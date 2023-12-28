"use client";

import { useEffect, useState } from "react";

import { CardModal } from "@/components/modals/card-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    // prevent SSR and hydration errors
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CardModal />
        </>
    );
};
