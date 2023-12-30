"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { UpdateCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId, ...values } = data;
    let card;

    // update card title
    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
            data: {
                ...values,
            },
        });
    } catch (error) {
        return {
            error: "Failed to update.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
