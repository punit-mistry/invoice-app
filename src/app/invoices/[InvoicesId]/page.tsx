
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Customers, Invoice } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import InvoiceComponent  from './Invoice'
export default async function InovicePage({
  params,
}: {
  params: { InvoicesId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const { InvoicesId } = await params;
  if (isNaN(parseInt(InvoicesId))) throw new Error("Invalid Invoice Id");
  const [result] = await db
    .select()
    .from(Invoice)
    .innerJoin(Customers, eq(Invoice.customerId, Customers.id))
    .where(
      and(eq(Invoice.id, parseInt(InvoicesId)), eq(Invoice.userId, userId))
    )
    .limit(1);
  if (!result) notFound();
  const invoices = { ...result.invoices, customers: result.customers };
  return (
    <InvoiceComponent result={invoices} />
  );
}
