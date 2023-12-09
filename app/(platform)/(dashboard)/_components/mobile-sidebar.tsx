"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import Sidebar from "./sidebar";

export default function MobileSidebar() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const onOpen = useMobileSidebar((state) => state.onOpen);
    const onClose = useMobileSidebar((state) => state.onClose);
    const isOpen = useMobileSidebar((state) => state.isOpen);

    // if this useEffect is executed, we are on client side, hence we can render the component
    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // otherwise, return null because we are on server side (prevent hydration error)
    if (!isMounted) return null;

    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden mr-2"
                variant={"ghost"}
                size={"sm"}
            >
                <Menu className="h-4 w-4" />
                <Sheet open={isOpen} onOpenChange={onClose}>
                    <SheetContent side={"left"} className="p-2 pt-10">
                        <Sidebar storageKey="t-sidebar-mobile-state" />
                    </SheetContent>
                </Sheet>
            </Button>
        </>
    );
}
