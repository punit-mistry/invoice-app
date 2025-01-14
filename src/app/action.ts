"use server";
import { db } from "@/db";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { Invoice, Status, Customers } from "@/db/schema";
import { headers } from "next/headers";
import { Resend } from "resend";
import { InvoiceCreatedEmail } from "@/email/invoice-create-email";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API);
dotenv.config({
  path: "./.env.local",
});
const stripe = new Stripe(String(process.env.NEXT_PUBLIC_STRIPE_KEY));
export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();
  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  if (!userId) {
    return redirect("/sign-in");
  }
  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const result = await db
    .insert(Invoice)
    .values({
      value,
      status: "open",
      description,
      customerId: customer.id,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Invoice.id,
    });
   await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "You have a new invoice !!",
    react: InvoiceCreatedEmail({ invoiceId: result[0].id }),
  });
  // if (error) {
  //   return res.status(400).json(error);
  // }

  // res.status(200).json(data);

  return redirect(`/invoices/${result[0].id}`);
}

export async function updateAction(formData: FormData) {
  const { userId, orgId } = await auth();
  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;
  if (!userId) {
    return redirect("/sign-in");
  }
  if (orgId) {
    await db
      .update(Invoice)
      .set({ status })
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.organizationId, orgId)
        )
      );
  } else {
    await db
      .update(Invoice)
      .set({ status })
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.userId, userId),
          isNull(Invoice.organizationId)
        )
      );
  }
  revalidatePath(`/invoices/${id}`, "page");
  // return redirect(`/invoices/${result[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = await auth();
  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;
  if (!userId) {
    return redirect("/sign-in");
  }
  if (orgId) {
    await db
      .update(Invoice)
      .set({ status })
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.organizationId, orgId)
        )
      );
  } else {
    await db
      .update(Invoice)
      .set({ status })
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.userId, userId),
          isNull(Invoice.organizationId)
        )
      );
  }
  // return redirect(`/invoices/${result[0].id}`);
}

export const deleteAction = async (formData: FormData) => {
  const { userId, orgId } = await auth();
  const id = formData.get("id") as string;
  if (!userId) {
    return redirect("/sign-in");
  }
  if (orgId) {
    await db
      .delete(Invoice)
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.organizationId, orgId)
        )
      );
  } else {
    await db
      .delete(Invoice)
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.userId, userId),
          isNull(Invoice.organizationId)
        )
      );
  }
  return redirect(`/dashboard`);
};

export const createPaymentAction = async (formData: FormData) => {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const id = parseInt(formData.get("id") as string);
  const [result] = await db
    .select({
      status: Invoice.status,
      value: Invoice.value,
      name: Customers.name,
    })
    .from(Invoice)
    .innerJoin(Customers, eq(Invoice.customerId, Customers.id))
    .where(eq(Invoice.id, id))
    .limit(1);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "inr",
          product: "prod_RAnhl3gsHWwfzy",
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: ["IN"], // Specify allowed countries (e.g., India)
    },
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment/?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });
  if (!session.url) {
    throw new Error("Error in creating payment");
  }
  return redirect(session.url);
};
