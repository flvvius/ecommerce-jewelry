import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { db } from "~/server/db";
import { addresses } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAddressById } from "~/utils/auth";
import EditAddressForm from "./form";

export default async function EditAddressPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const addressId = parseInt(params.id, 10);
  if (isNaN(addressId)) {
    redirect("/account/addresses");
  }

  const address = await getAddressById(addressId);

  if (!address) {
    redirect("/account/addresses");
  }

  async function updateAddress(formData: FormData) {
    "use server";

    const userId = user!.id;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const address1 = formData.get("address1") as string;
    const address2 = (formData.get("address2") as string) || null;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postalCode = formData.get("postalCode") as string;
    const country = formData.get("country") as string;
    const phone = (formData.get("phone") as string) || null;
    const isDefault = formData.get("isDefault") === "on";

    if (
      !firstName ||
      !lastName ||
      !address1 ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return { success: false, error: "All required fields must be filled" };
    }

    try {
      const ownedAddress = await db.query.addresses.findFirst({
        where: and(
          eq(addresses.id, addressId),
          eq(addresses.clerkUserId, userId),
        ),
      });

      if (!ownedAddress) {
        return { success: false, error: "Address not found" };
      }

      if (isDefault) {
        await db
          .update(addresses)
          .set({ isDefault: false })
          .where(eq(addresses.clerkUserId, userId));
      }

      await db
        .update(addresses)
        .set({
          firstName,
          lastName,
          address1,
          address2,
          city,
          state,
          postalCode,
          country,
          phone,
          isDefault,
        })
        .where(eq(addresses.id, addressId));

      revalidatePath("/account/addresses");
      return { success: true };
    } catch (error) {
      console.error("Error updating address:", error);
      return { success: false, error: "Database error occurred" };
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Address</h1>
        <p className="text-muted-foreground mt-2">
          Update your shipping or billing address information.
        </p>
      </div>

      <EditAddressForm updateAddress={updateAddress} address={address} />
    </div>
  );
}
