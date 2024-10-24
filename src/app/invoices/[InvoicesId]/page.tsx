import { db } from "@/db";
import { Invoice } from "@/db/schema";
import { eq } from "drizzle-orm";
export default async function InovicePage({
  params,
}: {
  params: { InvoicesId: string };
}) {
  const { InvoicesId } = await params;

  const result = await db
    .select()
    .from(Invoice)
    .where(eq(Invoice.id, parseInt(InvoicesId)))
    .limit(1);
  return (
    <main className="flex flex-col  h-full text-center max-w-5xl mx-auto gap-6 my-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Invoices #{InvoicesId}</h1>
      </div>
    </main>
  );
}
