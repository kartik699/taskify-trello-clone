"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { CreateList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, boardId } = data;
    let list;

    try {
        // find board for the current list
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            },
        });

        if (!board) {
            return {
                error: "Board not found.",
            };
        }

        // find last list order
        const lastList = await db.list.findFirst({
            where: { boardId: boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        // calculate new list order (last list order + 1) or 1 if no list
        const newOrder = lastList ? lastList.order + 1 : 1;

        // create list
        list = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            },
        });
    } catch (error) {
        return {
            error: "Failed to create.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
