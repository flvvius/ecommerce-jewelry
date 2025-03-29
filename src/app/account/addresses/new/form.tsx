"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function FormWithErrorHandling({
  createAddress,
}: {
  createAddress: (
    formData: FormData,
  ) => Promise<{ success: boolean; error?: string }>;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        const result = await createAddress(formData);
        if (result.success) {
          window.location.href = "/account/addresses";
        } else {
          setError(result.error || "An error occurred");
        }
      }}
      className="space-y-6"
    >
      {error && (
        <div className="bg-destructive/15 text-destructive rounded-md p-3">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="border-input bg-background w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className="border-input bg-background w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address1" className="text-sm font-medium">
          Address Line 1
        </label>
        <input
          id="address1"
          name="address1"
          required
          className="border-input bg-background w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address2" className="text-sm font-medium">
          Address Line 2 (Optional)
        </label>
        <input
          id="address2"
          name="address2"
          className="border-input bg-background w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            required
            className="border-input bg-background w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State / Province
          </label>
          <input
            id="state"
            name="state"
            required
            className="border-input bg-background w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="postalCode" className="text-sm font-medium">
            Postal Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            required
            className="border-input bg-background w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <select
            id="country"
            name="country"
            required
            className="border-input bg-background w-full rounded-md border px-3 py-2"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="border-input bg-background w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isDefault"
          name="isDefault"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="isDefault" className="text-sm">
          Set as default address
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/account/addresses">
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Link>
        <Button type="submit">Save Address</Button>
      </div>
    </form>
  );
}
