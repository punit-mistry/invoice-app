"use server";
import { db } from "@/db";
import { Invoice, Status ,Customers} from "@/db/schema";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export async function createAction(formData: FormData) {
  const { userId } = await auth();
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
    // organizationId: orgId || null,
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
    })
    .returning({
      id: Invoice.id,
    });
  return redirect(`/invoices/${result[0].id}`);
}

export async function updateAction(formData: FormData) {
  const { userId } = await auth();
  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;
  if (!userId) {
    return redirect("/sign-in");
  }
  const result = await db
    .update(Invoice)
    .set({
      status,
    })
    .where(and(eq(Invoice.id, parseInt(id)), eq(Invoice.userId, userId)))
   revalidatePath(`/invoices/${id}`,'page');
  // return redirect(`/invoices/${result[0].id}`);
}


export const deleteAction = async (formData: FormData) => {
  const { userId } = await auth();
  const id = formData.get("id") as string;
  if (!userId) {
    return redirect("/sign-in");
  }
  const result = await db
    .delete(Invoice)
    .where(and(eq(Invoice.id, parseInt(id)), eq(Invoice.userId, userId)))

  return redirect(`/dashboard`);
};