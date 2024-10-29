import { cn } from "@/lib/utils";
import React from "react";
interface ChildrenProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}
const Container = ({ children, className, ...props }: ChildrenProps) => {
  return (
    <div {...props} className={cn("max-w-6xl mx-auto px-5", className)}>
      {children}
    </div>
  );
};

export default Container;
