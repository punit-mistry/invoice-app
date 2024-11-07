import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ReceiptIndianRupee } from "lucide-react";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import Container from "./Container";
const Header = () => {
  return (
    <Container className="w-full">
      <header className="flex items-center justify-between py-4 ">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-bold flex gap-3 items-center text-md  capitalize "
          >
            <ReceiptIndianRupee />
            Inovicing App
          </Link>
          /
          <div>
            <SignedIn>
              <OrganizationSwitcher  afterCreateOrganizationUrl={"/dashboard"} afterSelectOrganizationUrl="/dashboard" /> 
            </SignedIn>
          </div>
        </div>
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
