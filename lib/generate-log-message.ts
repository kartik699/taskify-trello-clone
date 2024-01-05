import { AuditLog, ACTION } from "@prisma/client";

// helper function to generate a log message for a given audit log
export const generateLogMessage = (log: AuditLog) => {
    const { action, entityTitle, entityType } = log;

    switch (action) {
        case ACTION.CREATE:
            return `created ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.UPDATE:
            return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.DELETE:
            return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
        default:
            return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
    }
};
