import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { addresses } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import FormWithErrorHandling from "./form";

export default async function NewAddressPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  async function createAddress(formData: FormData) {
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
      if (isDefault) {
        await db
          .update(addresses)
          .set({ isDefault: false })
          .where(eq(addresses.clerkUserId, userId));
      }

      await db.insert(addresses).values({
        clerkUserId: userId,
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
      });

      revalidatePath("/account/addresses");
      return { success: true };
    } catch (error) {
      console.error("Error creating address:", error);
      return { success: false, error: "Database error occurred" };
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Address</h1>
        <p className="text-muted-foreground mt-2">
          Add a new shipping or billing address to your account.
        </p>
      </div>

      <FormWithErrorHandling createAddress={createAddress} />
    </div>
  );
}
