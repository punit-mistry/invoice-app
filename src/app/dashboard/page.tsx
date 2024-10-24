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
import { Invoice } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
export default async function Home() {
  const result = await db.select().from(Invoice);
  return (
    <main className="flex flex-col  h-full text-center max-w-5xl mx-auto gap-6 my-12">
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
          {result.map((result) => {
            return (
              <TableRow className="text-left " key={result.id}>
                <TableCell className="p-4 font-semibold">
                  <Link href={`/invoices/${result.id}`}>
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="p-4 font-semibold">
                  <Link href={`/invoices/${result.id}`}>Punit R. Mistry</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/invoices/${result.id}`}>punit@gmail.com</Link>
                </TableCell>
                <TableCell>
                  <Badge className="rounded-full">
                    <Link href={`/invoices/${result.id}`}>{result.status}</Link>
                  </Badge>
                </TableCell>
                <TableCell className="p-4 text-right font-semibold">
                  <Link href={`/invoices/${result.id}`}>
                    {(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
