import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { orgId } = auth();

    if (!orgId) return false;

    const orgSubscription = await db.orgSubscription.findUnique({
        where: { orgId },
        select: {
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
            stripeSubscriptionId: true,
        },
    });

    if (!orgSubscription) return false;

    // Check if the subscription is valid
    // take a buffer of 1 day from the current period end and if it is greater than the current date, then it is valid
    const isValid =
        orgSubscription.stripePriceId &&
        orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
            Date.now();

    return !!isValid;
};
