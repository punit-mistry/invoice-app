import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { Customers, Invoice } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { eq } from "drizzle-orm";
export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const result = await db.select().from(Invoice)
  .innerJoin(Customers, eq(Invoice.customerId, Customers.id))
  .where(eq(Invoice.userId, userId));
  const invoices = result.map(({invoices,customers}:any)=>{
    return {
      ...invoices,
      customers
    }
  })
  return (
    <main className=" text-center  my-12">
      <Container>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Inovices </h1>
        <Button variant={"ghost"} className="gap-2 inline-flex" asChild>
          <Link href="/invoices/new">
            <CirclePlus className=" w-4 h-4" />
            Create Invoice
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] p-4">Date</TableHead>
            <TableHead className="p-4">Customer</TableHead>
            <TableHead className="p-4">Email</TableHead>
            <TableHead className="p-4">Status</TableHead>
            <TableHead className="text-right p-4 ">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((result:any) => {
            return (
              <TableRow className="text-left " key={result.id}>
                <TableCell className="p-4 font-semibold">
                  <Link href={`/invoices/${result.id}`}>
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="p-4 font-semibold">
                  <Link href={`/invoices/${result.id}`}>{result.customers.name}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/invoices/${result.id}`}>{result.customers.email}</Link>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "rounded-full capitalize",
                      result.status === "open" && "bg-blue-500",
                      result.status === "paid" && "bg-green-600",
                      result.status === "void" && "bg-zinc-700",
                      result.status === "uncollectible" && "bg-red-600"
                    )}
                  >
                    <Link href={`/invoices/${result.id}`}>{result.status}</Link>
                  </Badge>
                </TableCell>
                <TableCell className="p-4 text-right font-semibold">
                  <Link href={`/invoices/${result.id}`}>
                  ₹ {(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </Container>

    </main>
  );
}
