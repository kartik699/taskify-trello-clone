"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, id } = data;
    let board;

    // update board title
    try {
        board = await db.board.update({
            where: {
                id,
                orgId,
            },
            data: {
                title,
            },
        });
    } catch (error) {
        return {
            error: "Failed to update.",
        };
    }

    revalidatePath(`/board/${id}`);

    return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
