"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { UpdateCardOrder } from "./schema";
import { update } from "lodash";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { items, boardId } = data;
    let updatedCards;

    try {
        const transaction = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            orgId,
                        },
                    },
                },
                data: {
                    order: card.order,
                    listId: card.listId,
                },
            })
        );

        updatedCards = await db.$transaction(transaction);
    } catch (error) {
        return {
            error: "Failed to reorder.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
