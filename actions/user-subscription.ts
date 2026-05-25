"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { getUserSubscription } from "@/db/queries";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils-server";

const returnUrl = absoluteUrl("/shop");

export const createStripeUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) throw new Error("Unauthorized");

  const userSub = await getUserSubscription();

  if (userSub?.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSub.stripeCustomerId,
      return_url: returnUrl,
    });
    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: { name: "Beacon Pro" },
          unit_amount: 999, // $9.99
          recurring: { interval: "month" },
        },
      },
    ],
    metadata: { userId },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url };
};
