import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex flex-col justify-center h-full text-center max-w-5xl mx-auto gap-6 ">
      <h1 className="text-5xl font-bold">Inovicy App</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <p>
        <Button>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </p>
    </main>
  );
}
