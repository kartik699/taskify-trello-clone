"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";

import ListForm from "./list-form";
import ListItem from "./list-item";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

// a little function to help us with reordering the result
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
    const [orderedData, setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: any) => {
        const { source, destination, type } = result;

        if (!destination) {
            return;
        }

        // if dropped in same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // user moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, order: index }));

            setOrderedData(items);
            executeUpdateListOrder({ boardId, items });
        }

        // user moves a card
        if (type === "card") {
            let newOrderedData = [...orderedData];

            // source and destination list
            const sourceList = newOrderedData.find(
                (list) => list.id === source.droppableId
            );
            const destList = newOrderedData.find(
                (list) => list.id === destination.droppableId
            );

            if (!sourceList || !destList) return;

            // check if cards exists in source list
            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            // check if cards exists in destination list
            if (!destList.cards) {
                destList.cards = [];
            }

            // cards are moved in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );

                reorderedCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({ boardId, items: reorderedCards });
                // user moves the card to another list
            } else {
                // remove the card from the source list
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // assign new listId to moved card
                movedCard.listId = destination.droppableId;

                // add the card to the destination list
                destList.cards.splice(destination.index, 0, movedCard);

                // re-order cards in the source list
                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                // re-order cards in the destination list
                destList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({ boardId, items: destList.cards });
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index) => (
                            <ListItem key={list.id} index={index} data={list} />
                        ))}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
}
