// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  boolean,
  decimal,
  json,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `ECommerce Project_${name}`,
);

export const productCategoryEnum = pgEnum("product_category", [
  "necklaces",
  "rings",
  "earrings",
  "bracelets",
  "other",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const products = createTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  category: productCategoryEnum("category").notNull(),
  inventory: integer("inventory").notNull().default(0),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productImages = createTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  isDefault: boolean("is_default").default(false),
  sortOrder: integer("sort_order").default(0),
});

export const addresses = createTable("addresses", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  address1: varchar("address1", { length: 255 }).notNull(),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  isDefault: boolean("is_default").default(false),
});

export const orders = createTable("orders", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  status: orderStatusEnum("status").notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: integer("shipping_address_id").references(
    () => addresses.id,
  ),
  billingAddressId: integer("billing_address_id").references(
    () => addresses.id,
  ),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  checkoutSessionId: varchar("checkout_session_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = createTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  metadata: json("metadata"),
});

export const carts = createTable("carts", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  sessionId: varchar("session_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = createTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
