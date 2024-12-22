import { eq } from "drizzle-orm";
import { CreditCard } from "lucide-react";
import Stripe from "stripe";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Customers, Invoice } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import InvoicePaid from "./InvoicePaid";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { createPaymentAction, updateStatusAction } from "@/app/action";

const stripe = new Stripe(String(process.env.NEXT_PUBLIC_STRIPE_KEY));


// After
type Params = Promise<{ invoicesId: string }>;
type SearchParams = Promise<{ session_id: string; status: string }>;

export default async function InvoicePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const InvoiceId = await props.params;
  const invoicesId = Number(InvoiceId.invoicesId);
  const searchParamsResolved = await props.searchParams; // Await the promise to get actual search parameters
  const sessionId = searchParamsResolved.session_id;

  const isSuccess =
    searchParamsResolved.session_id &&
    searchParamsResolved.status === "success";
  const isCanceled = searchParamsResolved.status === "canceled";
  let isError = searchParamsResolved.status && !searchParamsResolved.session_id;

  if (Number.isNaN(Number(invoicesId))) {
    throw new Error("Invalid Invoice ID");
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoicesId));
      formData.append("status", "paid");
      // Uncomment when ready to use
      await updateStatusAction(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoice.id,
      status: Invoice.status,
      createTs: Invoice.createTs,
      description: Invoice.description,
      value: Invoice.value,
      name: Customers.name,
    })
    .from(Invoice)
    .innerJoin(Customers, eq(Invoice.customerId, Customers.id))
    .where(eq(Invoice.id, invoicesId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className="w-full h-full">
      <Container>
        {isError && (
          <p className="bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-6">
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className="bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-6">
            Payment was canceled, please try again.
          </p>
        )}
        {isSuccess && (
          <p className="bg-green-100 text-sm text-green-800 text-center px-3 py-2 rounded-lg mb-6">
            Payment was successful
          </p>
        )}
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    "rounded-full capitalize",
                    invoice.status === "open" && "bg-blue-500",
                    invoice.status === "paid" && "bg-green-600",
                    invoice.status === "void" && "bg-zinc-700",
                    invoice.status === "uncollectible" && "bg-red-600"
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
            <p className="text-lg mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
            {invoice.status === "open" && (
              <form action={createPaymentAction} method="POST">
                <input type="hidden" name="id" value={invoice.id} />
                <Button
                  type="submit"
                  className="flex gap-2 font-bold bg-green-700"
                >
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === "paid" && (
              <InvoicePaid
                amount={invoice.value}
                date={new Date(invoice.createTs).toLocaleDateString()}
              />
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
