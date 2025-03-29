import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getAddressesForUser } from "~/utils/auth";

export default async function AddressesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const addresses = await getAddressesForUser();

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button asChild>
          <Link href="/account/addresses/new">Add New Address</Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">No addresses found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any shipping addresses yet.
          </p>
          <Button asChild>
            <Link href="/account/addresses/new">Add Your First Address</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-lg border p-4 ${
                address.isDefault
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              {address.isDefault && (
                <div className="mb-2 inline-block rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
                  Default Address
                </div>
              )}
              <div className="font-medium">
                {address.firstName} {address.lastName}
              </div>
              <div className="mt-1 text-gray-700">
                {address.address1}
                {address.address2 && <div>{address.address2}</div>}
                <div>
                  {address.city}, {address.state} {address.postalCode}
                </div>
                <div>{address.country}</div>
                {address.phone && <div className="mt-1">{address.phone}</div>}
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/addresses/${address.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/addresses/${address.id}/set-default`}>
                    Set as Default
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" asChild>
                  <Link href={`/account/addresses/${address.id}/delete`}>
                    Delete
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
