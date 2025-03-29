"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function AddressFormError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Address form error:", error);
  }, [error]);

  return (
    <div className="container max-w-2xl py-10">
      <div className="bg-destructive/15 rounded-md p-6 text-center">
        <h2 className="text-destructive mb-2 text-xl font-semibold">
          Something went wrong
        </h2>
        <p className="text-destructive/80 mb-4">
          There was an error while trying to save your address. Please try
          again.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
          <Link href="/account/addresses">
            <Button variant="secondary">Go back to addresses</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
