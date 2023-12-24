"use client";

import { useEffect, useState } from "react";

import { ListWithCards } from "@/types";

import ListForm from "./list-form";
import ListItem from "./list-item";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
    const [orderedData, setOrderedData] = useState(data);

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    return (
        <ol className="flex gap-x-3 h-full">
            {orderedData.map((list, index) => (
                <ListItem key={list.id} index={index} data={list} />
            ))}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
        </ol>
    );
}
