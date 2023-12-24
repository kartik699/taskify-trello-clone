"use client";

import { ListWithCards } from "@/types";

import ListHeader from "./list-header";

interface ListItemProps {
    index: number;
    data: ListWithCards;
}

export default function ListItem({ index, data }: ListItemProps) {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md shadow-md pb-2 bg-[#f1f2f4]">
                <ListHeader data={data} />
            </div>
        </li>
    );
}
