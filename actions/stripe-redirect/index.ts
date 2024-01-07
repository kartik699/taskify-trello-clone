"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { StripeRedirect } from "./schema";
import { InputType, ReturnType } from "./types";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
        return {
            error: "Unauthorized",
        };
    }

    const settingsUrl = absoluteUrl(`/organization/${orgId}`);

    let url = "";

    try {
        const orgSubscription = await db.orgSubscription.findUnique({
            where: {
                orgId,
            },
        });

        // If the organization already has a subscription, redirect to the billing portal
        if (orgSubscription && orgSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            url = stripeSession.url;

            // If the organization doesn't have a subscription, create a checkout session
        } else {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "INR",
                            product_data: {
                                name: "Taskify Pro",
                                description:
                                    "Unlimited boards for your organization",
                            },
                            unit_amount: 69900,
                            recurring: {
                                interval: "month",
                            },
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    orgId,
                },
            });

            url = stripeSession.url || "";
        }
    } catch {
        return {
            error: "Something went wrong!",
        };
    }

    revalidatePath(`/organization/${orgId}`);
    return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
