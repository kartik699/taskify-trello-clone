"use client";

import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";

export const ProModal = () => {
    const proModal = useProModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onClick = () => {
        execute({});
    };

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent className="max-w-md overflow-hidden p-0">
                <div className="aspect-video relative flex justify-center items-center">
                    <Image
                        src="/hero.svg"
                        alt="hero"
                        className="object-cover"
                        fill
                    />
                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className="text-xl font-semibold">
                        Upgrade to Taskify Pro Today!
                    </h2>
                    <p className="text-xs font-semibold text-neutral-600">
                        Explore the best of Taskify
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited Boards</li>
                            <li>Advanced Checklists</li>
                            <li>Admin and Security Features</li>
                            <li>And more!</li>
                        </ul>
                    </div>
                    <Button
                        disabled={isLoading}
                        onClick={onClick}
                        className="w-full"
                        variant={"primary"}
                    >
                        Upgrade to&nbsp;
                        <span className="text-[#FFD700]">Pro!</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
