import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { addresses } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export type Address = typeof addresses.$inferSelect;

export async function getCurrentUserAddresses() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const userAddresses = await db.query.addresses.findMany({
    where: eq(addresses.clerkUserId, user.id),
  });

  return userAddresses;
}

export async function getUserDefaultAddress() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  let address = await db.query.addresses.findFirst({
    where: (addresses) => {
      return (
        eq(addresses.clerkUserId, user.id) && eq(addresses.isDefault, true)
      );
    },
  });

  if (!address) {
    address = await db.query.addresses.findFirst({
      where: eq(addresses.clerkUserId, user.id),
    });
  }

  return address;
}

export async function getAddressById(id: number) {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const address = await db.query.addresses.findFirst({
    where: and(eq(addresses.id, id), eq(addresses.clerkUserId, user.id)),
  });

  return address;
}

export async function getAddressesForUser() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const userAddresses = await db.query.addresses.findMany({
    where: eq(addresses.clerkUserId, user.id),
    orderBy: [desc(addresses.isDefault)],
  });

  return userAddresses;
}

export async function getDefaultAddress() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const defaultAddress = await db.query.addresses.findFirst({
    where: and(
      eq(addresses.clerkUserId, user.id),
      eq(addresses.isDefault, true),
    ),
  });

  return defaultAddress;
}
