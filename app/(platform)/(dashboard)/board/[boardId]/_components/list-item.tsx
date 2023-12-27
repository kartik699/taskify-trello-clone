"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";

import ListHeader from "./list-header";
import { CardForm } from "./card-form";
import CardItem from "./card-item";

interface ListItemProps {
    index: number;
    data: ListWithCards;
}

export default function ListItem({ index, data }: ListItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const disableEditing = () => {
        setIsEditing(false);
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="shrink-0 h-full w-[272px] select-none"
                >
                    <div
                        {...provided.dragHandleProps}
                        className="w-full rounded-md shadow-md pb-2 bg-[#f1f2f4]"
                    >
                        <ListHeader onAddCard={enableEditing} data={data} />
                        <Droppable droppableId={data.id} type="card">
                            {(provided) => (
                                <ol
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                                        data.cards.length > 0 ? "mt-2" : "mt-0"
                                    )}
                                >
                                    {data.cards.map((card, index) => (
                                        <CardItem
                                            key={card.id}
                                            index={index}
                                            data={card}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>
                        <CardForm
                            listId={data.id}
                            ref={textareaRef}
                            isEditing={isEditing}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                        />
                    </div>
                </li>
            )}
        </Draggable>
    );
}
