import { db } from "@/db";
import { notFound } from "next/navigation";
import { Customers, Invoice } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import InvoiceComponent from "./Invoice";

type Params = Promise<{ invoicesId: string }>
// Use `Promise<JSX.Element>` for the async component return type
export default async function InvoicePage(props:  { params: Params }) {
  const { userId, orgId } = await auth();
  if (userId === null || userId === undefined) {
    throw new Error("User ID cannot be null or undefined");
  }

  const { invoicesId } = await props.params;
  if (isNaN(parseInt(invoicesId))) throw new Error("Invalid Invoice Id");

  let result;

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoice)
      .innerJoin(Customers, eq(Invoice.customerId, Customers.id))
      .where(
        and(
          eq(Invoice.id, parseInt(invoicesId)),
          eq(Invoice.userId, userId),
          eq(Invoice.organizationId, orgId)
        )
      )
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoice)
      .innerJoin(Customers, eq(Invoice.customerId, Customers.id))
      .where(
        and(
          eq(Invoice.id, parseInt(invoicesId)),
          eq(Invoice.userId, userId),
          isNull(Invoice.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) throw notFound();
  // Extract invoices and customers safely
  const invoices = {...result.invoices , customers: result.customers};

  return <InvoiceComponent result={invoices } />;
}
