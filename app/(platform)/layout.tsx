import { Toaster } from "sonner";

import { ClerkProvider } from "@clerk/nextjs";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <Toaster />
            {children}
        </ClerkProvider>
    );
}
