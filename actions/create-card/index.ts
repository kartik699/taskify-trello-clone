"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { CreateCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, boardId, listId } = data;
    let card;

    try {
        // find list for the card
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId,
                },
            },
        });

        if (!list) {
            return {
                error: "List not found.",
            };
        }

        // find last card to determine new card's order
        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        // create card
        card = await db.card.create({
            data: {
                title,
                order: newOrder,
                listId,
            },
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to create.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
