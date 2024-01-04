"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { CopyCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;
    let card;

    // Copy card
    try {
        // fetch the card to copy
        const cardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
        });

        if (!cardToCopy) {
            return {
                error: "Card not found.",
            };
        }

        // fetch last card to determine the order
        const lastCard = await db.card.findFirst({
            where: { listId: cardToCopy.listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        // copy list with all the cards
        card = await db.card.create({
            data: {
                order: newOrder,
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                listId: cardToCopy.listId,
            },
        });
    } catch (error) {
        return {
            error: "Failed to copy.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
