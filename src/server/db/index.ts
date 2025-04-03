import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "drizzle-orm";

import { env } from "~/env";
import * as schema from "./schema";

// Define relationships between tables
export const productsRelations = relations(schema.products, ({ many }) => ({
  productImages: many(schema.productImages),
  orderItems: many(schema.orderItems),
  cartItems: many(schema.cartItems),
}));

export const ordersRelations = relations(schema.orders, ({ one, many }) => ({
  orderItems: many(schema.orderItems),
  shippingAddress: one(schema.addresses, {
    fields: [schema.orders.shippingAddressId],
    references: [schema.addresses.id],
  }),
  billingAddress: one(schema.addresses, {
    fields: [schema.orders.billingAddressId],
    references: [schema.addresses.id],
  }),
}));

export const cartsRelations = relations(schema.carts, ({ many }) => ({
  cartItems: many(schema.cartItems),
}));

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Try to get the DATABASE_URL directly from process.env first, then fall back to env
const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

console.log("Using database URL:", databaseUrl.substring(0, 20) + "...");

const conn = globalForDb.conn ?? postgres(databaseUrl);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema: {
    ...schema,
    relations: {
      products: productsRelations,
      orders: ordersRelations,
      carts: cartsRelations,
    },
  },
});

export async function runMigrations() {
  try {
    // For Neon DB with Vercel, we don't need to run migrations programmatically
    // as Vercel handles this with the drizzle-kit push command
    console.log("Migrations should be run using drizzle-kit push:pg");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}
