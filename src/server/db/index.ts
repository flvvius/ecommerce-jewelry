import { drizzle } from "drizzle-orm/postgres-js";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

// Define relationships between tables
export const productsRelations = relations(
  schema.products,
  ({ many }: any) => ({
    productImages: many(schema.productImages),
    orderItems: many(schema.orderItems),
    cartItems: many(schema.cartItems),
  }),
);

export const ordersRelations = relations(
  schema.orders,
  ({ one, many }: any) => ({
    orderItems: many(schema.orderItems),
    shippingAddress: one(schema.addresses, {
      fields: [schema.orders.shippingAddressId],
      references: [schema.addresses.id],
    }),
    billingAddress: one(schema.addresses, {
      fields: [schema.orders.billingAddressId],
      references: [schema.addresses.id],
    }),
  }),
);

export const cartsRelations = relations(schema.carts, ({ many }: any) => ({
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
  throw new Error(
    "DATABASE_URL is not defined - please check your environment variables",
  );
}

console.log("Using database URL:", databaseUrl.substring(0, 20) + "...");

// Configure Postgres with connection retry logic
const createConn = () =>
  postgres(databaseUrl, {
    max: 3, // Reduce pool size from 10 to 3
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
    prepare: false, // Disable prepared statements for better compatibility with Neon
    ssl: true, // Always use SSL for Neon database
    onnotice: () => {}, // Suppress notice messages
    onparameter: () => {}, // Suppress parameter status messages
    debug: process.env.NODE_ENV === "development", // Enable debug in development
  });

// Initialize the connection
const conn = globalForDb.conn ?? createConn();
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
  logger: process.env.NODE_ENV === "development",
});

// Health check function to test database connection
export async function checkDbConnection(): Promise<boolean> {
  try {
    // Simple query to test the connection
    const result = await db.execute(sql`SELECT 1 as connection_test`);
    return result.length > 0;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

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
