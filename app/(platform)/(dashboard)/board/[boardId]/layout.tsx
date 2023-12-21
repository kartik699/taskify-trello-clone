import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

import BoardNavbar from "./_components/board-navbar";

// change tab title to board title
export async function generateMetadata({
    params,
}: {
    params: { boardId: string };
}) {
    const { orgId } = auth();

    if (!orgId) return redirect("/select-org");

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    return {
        title: board?.title,
    };
}

export default async function BoardIdPageLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { boardId: string };
}) {
    const { orgId } = auth();

    if (!orgId) return redirect("/select-org");

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    if (!board) return notFound();

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar data={board} />
            <div className="absolute bg-black/10 inset-0" />
            <main className="pt-28 relative h-full">{children}</main>
        </div>
    );
}
