import { auth, currentUser } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE;
    action: ACTION;
    entityTitle: string;
}

// helper function to create audit logs for actions performed by users
export const createAuditLog = async (props: Props) => {
    // fetch the current user and orgId and create an audit log entry for the action performed by the user
    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!user || !orgId) {
            throw new Error("User not found!");
        }

        const { entityId, entityType, action, entityTitle } = props;

        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user?.imageUrl,
                userName: user?.firstName + " " + user?.lastName,
            },
        });
    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    }
};
