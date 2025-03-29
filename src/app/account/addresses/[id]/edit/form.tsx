"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Address } from "~/utils/auth";

interface EditAddressFormProps {
  updateAddress: (
    formData: FormData,
  ) => Promise<{ success: boolean; error?: string }>;
  address: Address;
}

export default function EditAddressForm({
  updateAddress,
  address,
}: EditAddressFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateAddress(formData);

      if (result.success) {
        router.push("/account/addresses");
      } else {
        setError(result.error || "Failed to update address");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            defaultValue={address.firstName}
            required
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={address.lastName}
            required
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="address1"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Address Line 1 *
        </label>
        <input
          type="text"
          id="address1"
          name="address1"
          defaultValue={address.address1}
          required
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="address2"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Address Line 2
        </label>
        <input
          type="text"
          id="address2"
          name="address2"
          defaultValue={address.address2 || ""}
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="city"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            defaultValue={address.city}
            required
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            State/Province *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            defaultValue={address.state}
            required
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="postalCode"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Postal Code *
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            defaultValue={address.postalCode}
            required
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Country *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            defaultValue={address.country}
            required
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={address.phone || ""}
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            defaultChecked={address.isDefault ?? false} 
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label
            htmlFor="isDefault"
            className="ml-2 block text-sm text-gray-700"
          >
            Set as default address
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" asChild>
          <Link href="/account/addresses">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Address"}
        </Button>
      </div>
    </form>
  );
}
