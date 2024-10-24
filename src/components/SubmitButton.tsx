"use client";

import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
const SubmitButton = () => {
  const { pending } = useFormStatus();
  console.log("pending",pending);
  return <Button className="w-full font-semibold">Submit</Button>;
};

export default SubmitButton;
