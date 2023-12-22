"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { DeleteBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id } = data;
    let board;

    // Delete board
    try {
        board = await db.board.delete({
            where: {
                id,
                orgId,
            },
        });
    } catch (error) {
        return {
            error: "Failed to delete.",
        };
    }

    revalidatePath(`/organization/${orgId}`);

    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
