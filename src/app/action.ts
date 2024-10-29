"use server";
import { db } from "@/db";
import { Invoice } from "@/db/schema";
import { redirect } from "next/navigation";
export async function createAction(formData: FormData) {
  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const result = await db.insert(Invoice).values({
    value,
    status: "open",
    description,
  }).returning({
    id:Invoice.id,
  })
  return redirect (`/invoices/${result[0].id}`);
}
