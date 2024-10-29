import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ReceiptIndianRupee } from "lucide-react";
import Link from "next/link";
import Container from "./Container";
const Header = () => {
  return (
    <Container className="w-full">
      <header className="flex items-center justify-between py-4 ">
        <Link
          href="/"
          className="font-bold flex gap-3 items-center text-md md:text-3xl capitalize "
        >
          <ReceiptIndianRupee />
          Inovicing App
        </Link>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
    </Container>
  );
};

export default Header;
