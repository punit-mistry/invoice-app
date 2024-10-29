"use client";
import { SyntheticEvent, useState, startTransition } from "react";
import Form from "next/form";
import { createAction } from "@/app/action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import Container from "@/components/Container";
export default function Home() {
  const [state, setState] = useState("ready");
  const handleSubmit = async (event: SyntheticEvent) => {
    if (state == "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  };
  return (
    <main className="  h-full  ">
      <Container className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Create Inovice </h1>
      </div>
      <Form className="grid gap-4 max-w-xs" action={createAction} onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" className="mb-2 font-semibold block text-sm">
            Billing Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label htmlFor="email" className="mb-2 font-semibold block text-sm">
            Billing Email
          </Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label htmlFor="value" className="mb-2 font-semibold block text-sm">
            Value
          </Label>
          <Input
            id="value"
            name="value"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="mb-2 font-semibold block text-sm"
          >
            Description
          </Label>
          <Textarea
            placeholder="Enter your name"
            id="description"
            name="description"
          ></Textarea>
        </div>
        <div>
          <SubmitButton />
        </div>
      </Form>
      </Container>

    </main>
  );
}
