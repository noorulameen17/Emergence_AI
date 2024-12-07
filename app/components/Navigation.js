"use client";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@mui/material";

export default function Navigation() {
  const { isSignedIn } = useAuth();

  return (
    <nav>
      {!isSignedIn ? (
        <div>
          <Link href="/sign-in">
            <Button variant="contained">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="contained">Sign Up</Button>
          </Link>
        </div>
      ) : (
        <SignOutButton>
          <Button variant="contained">Sign Out</Button>
        </SignOutButton>
      )}
    </nav>
  );
}