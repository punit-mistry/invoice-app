import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { ChevronDown, Trash2, Ellipsis } from "lucide-react";
import { Status } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUS } from "@/data/invoices";
import { updateAction, deleteAction } from "@/app/action";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface Customer {
  id: number;
  createTs: any;
  name: string;
  email: string;
}
interface Invoice {
  id: number;
  createTs: any;
  value: number;
  description: string;
  status: Status;
  customers: Customer;
}
const Invoice = ({ result }: { result: Invoice }) => {
  return (
    <main className="w-full h-full my-12">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center gap-4 text-3xl font-semibold">
            Invoice {result.id}
            <Badge
              className={cn(
                "rounded-full capitalize",
                result.status === "open" && "bg-blue-500",
                result.status === "paid" && "bg-green-600",
                result.status === "void" && "bg-zinc-700",
                result.status === "uncollectible" && "bg-red-600"
              )}
            >
              {result.status}
            </Badge>
          </h1>
          <p className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="flex items-center gap-1">
                  More Options
                  <ChevronDown className="w-4 h-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AVAILABLE_STATUS.map((status) => (
                  <DropdownMenuItem key={status.id}>
                    <form action={updateAction}>
                      <input type="hidden" name="status" value={status.id} />
                      <input type="hidden" name="id" value={result.id} />
                      <button>{status.label}</button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-1"
                  >
                    <Ellipsis className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="text-red-500">
                    <DialogTrigger className="flex items-center gap-1">
                      <Trash2 className="w-4 h-auto" />
                      <button>Delete Invoice</button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this invoice?</DialogTitle>
                  <DialogDescription className="py-3">
                    This action cannot be undone. This will permanently delete
                    your Invoice and remove your data from our servers.
                  </DialogDescription>
                  <DialogFooter>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={result.id} />
                      <Button variant={"destructive"}>Delete </Button>
                    </form>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>
        </div>

        <p className="text-3xl mb-3">${(result.value / 100).toFixed(2)}</p>

        <p className="text-lg mb-8">{result.description}</p>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{result.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(result.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            {result.customers.name}
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span>{result.customers.email}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
};

export default Invoice;
