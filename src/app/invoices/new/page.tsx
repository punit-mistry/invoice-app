import { db } from "@/db";
import { sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export default async function Home() {
  const result = await db.execute(sql`SELECT current_database()`);
  return (
    <main className="flex flex-col  h-full  max-w-5xl mx-auto gap-6 my-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Create Inovice </h1>
      </div>
      {JSON.stringify(result)}
      <form className="grid gap-4 max-w-xs">
        <div>
          <Label htmlFor="name" className="mb-2 font-semibold block text-sm">Billing Name</Label>
          <Input id="name" name="name" type="text" placeholder="Enter your name" />
        </div>
        <div>
          <Label htmlFor="email" className="mb-2 font-semibold block text-sm">Billing Email</Label>
          <Input id="email" name="email" type="text" placeholder="Enter your name" />
        </div>
        <div>
          <Label htmlFor="value" className="mb-2 font-semibold block text-sm">Value</Label>
          <Input id="value" name="value" type="text" placeholder="Enter your name" />
        </div>
        <div>
          <Label htmlFor="description" className="mb-2 font-semibold block text-sm">Description</Label>
          <Textarea placeholder="Enter your name" id="description" name="description"></Textarea>
        </div>
        <div>
    <Button className="w-full font-semibold">
      Submit
    </Button>
        </div>
      </form>
    </main>
  );
}
