import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HelpCircle, User2 } from "lucide-react";

import { FormPopover } from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

export default async function BoardList() {
    const { orgId } = auth();

    // redirect to select org page if org id is not present
    if (!orgId) return redirect("/select-org");

    // fetch all boards for current org id
    const boards = await db.board.findMany({
        where: {
            orgId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const availableCount = await getAvailableCount();
    const isPro = await checkSubscription();

    return (
        <div className="space-y-4">
            <div className="flex items-center text-lg text-neutral-700 font-semibold">
                <User2 className="h-6 w-6 mr-2" />
                Your Boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <Link
                        key={board.id}
                        href={`/board/${board.id}`}
                        style={{
                            backgroundImage: `url(${board.imageThumbUrl})`,
                        }}
                        className="aspect-video group relative bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full overflow-hidden p-2"
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                        <p className="text-white relative font-semibold">
                            {board.title}
                        </p>
                    </Link>
                ))}
                <FormPopover sideOffset={10} side="right">
                    <div
                        role="button"
                        className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                    >
                        <p className="text-sm">Create New Board</p>
                        <span className="text-xs">
                            {isPro
                                ? "Unlimited Boards because you're Pro!"
                                : `${
                                      MAX_FREE_BOARDS - availableCount
                                  } remaining`}
                        </span>
                        {!isPro && (
                            <Hint
                                sideOffset={45}
                                description={`Free Workspaces can have upto 5 boards. For unlimited boards, please upgrade this workspace`}
                            >
                                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                            </Hint>
                        )}
                    </div>
                </FormPopover>
            </div>
        </div>
    );
}

BoardList.Skeleton = function BoardListSkelton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
            <Skeleton className="aspect-video w-full h-full p-2" />
        </div>
    );
};
