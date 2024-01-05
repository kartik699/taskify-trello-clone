"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { CopyList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;
    let list;

    // Copy list
    try {
        // fetch the list to copy
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            include: {
                cards: true,
            },
        });

        if (!listToCopy) {
            return {
                error: "List not found.",
            };
        }

        // fetch last list to determine the order
        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        // copy list with all the cards
        list = await db.list.create({
            data: {
                order: newOrder,
                title: `${listToCopy.title} - Copy`,
                boardId: listToCopy.boardId,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order,
                        })),
                    },
                },
            },
            include: {
                cards: true,
            },
        });

        await createAuditLog({
            entityId: list.id,
            entityType: ENTITY_TYPE.LIST,
            entityTitle: list.title,
            action: ACTION.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to copy.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
