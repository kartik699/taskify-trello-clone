import { db } from "@/lib/db";

import BoardForm from "./form";

export default async function OrganizationIdPage() {
    const boards = await db.board.findMany();

    return (
        <div className="flex flex-col space-y-4">
            <BoardForm />
            <div className="space-y-2">
                {boards.map((board) => (
                    <div key={board.id}>{board.title}</div>
                ))}
            </div>
        </div>
    );
}
