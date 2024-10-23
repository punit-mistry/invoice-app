import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
export default function Home() {
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
          <TableRow className="text-left ">
            <TableCell className="p-4 font-semibold">10/10/2023</TableCell>
            <TableCell className="p-4 font-semibold">Punit R. Mistry</TableCell>
            <TableCell>punit@gmail.com</TableCell>
            <TableCell>
              <Badge className="rounded-full">Open</Badge>
            </TableCell>
            <TableCell className="p-4 text-right font-semibold">
              $250.00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
