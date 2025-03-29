import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getAddressesForUser } from "~/utils/auth";
import { db } from "~/server/db";
import { addresses } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function setAddressAsDefault(formData: FormData) {
  "use server";

  const user = await currentUser();
  if (!user) return;

  const addressId = Number(formData.get("addressId"));
  if (!addressId) return;

  try {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.clerkUserId, user.id));

    await db
      .update(addresses)
      .set({ isDefault: true })
      .where(eq(addresses.id, addressId));

    revalidatePath("/account/addresses");
  } catch (error) {
    console.error("Error setting default address:", error);
  }
}

async function deleteAddress(formData: FormData) {
  "use server";

  const user = await currentUser();
  if (!user) return;

  const addressId = Number(formData.get("addressId"));
  if (!addressId) return;

  try {
    await db.delete(addresses).where(eq(addresses.id, addressId));

    revalidatePath("/account/addresses");
  } catch (error) {
    console.error("Error deleting address:", error);
  }
}

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
                {!address.isDefault && (
                  <form action={setAddressAsDefault}>
                    <input type="hidden" name="addressId" value={address.id} />
                    <Button variant="outline" size="sm" type="submit">
                      Set as Default
                    </Button>
                  </form>
                )}
                <form action={deleteAddress}>
                  <input type="hidden" name="addressId" value={address.id} />
                  <Button variant="destructive" size="sm" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
