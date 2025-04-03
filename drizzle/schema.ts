import { pgTable, foreignKey, serial, integer, text, boolean, varchar, timestamp, unique, numeric, json, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const orderStatus = pgEnum("order_status", ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
export const productCategory = pgEnum("product_category", ['necklaces', 'rings', 'earrings', 'bracelets', 'other'])


export const ecommerceProjectProductImages = pgTable("ECommerce Project_product_images", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	url: text().notNull(),
	altText: text("alt_text"),
	isDefault: boolean("is_default").default(false),
	sortOrder: integer("sort_order").default(0),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [ecommerceProjectProducts.id],
			name: "ECommerce Project_product_images_product_id_ECommerce Project_p"
		}).onDelete("cascade"),
]);

export const ecommerceProjectCarts = pgTable("ECommerce Project_carts", {
	id: serial().primaryKey().notNull(),
	clerkUserId: varchar("clerk_user_id", { length: 255 }),
	sessionId: varchar("session_id", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const ecommerceProjectCartItems = pgTable("ECommerce Project_cart_items", {
	id: serial().primaryKey().notNull(),
	cartId: integer("cart_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [ecommerceProjectCarts.id],
			name: "ECommerce Project_cart_items_cart_id_ECommerce Project_carts_id"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [ecommerceProjectProducts.id],
			name: "ECommerce Project_cart_items_product_id_ECommerce Project_produ"
		}),
]);

export const ecommerceProjectProducts = pgTable("ECommerce Project_products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	compareAtPrice: numeric("compare_at_price", { precision: 10, scale:  2 }),
	category: productCategory().notNull(),
	material: text(),
	inventory: integer().default(0).notNull(),
	isNew: boolean("is_new").default(false),
	isBestseller: boolean("is_bestseller").default(false),
	isFeatured: boolean("is_featured").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("ECommerce Project_products_slug_unique").on(table.slug),
]);

export const ecommerceProjectOrders = pgTable("ECommerce Project_orders", {
	id: serial().primaryKey().notNull(),
	clerkUserId: varchar("clerk_user_id", { length: 255 }),
	status: orderStatus().default('pending').notNull(),
	total: numeric({ precision: 10, scale:  2 }).notNull(),
	subtotal: numeric({ precision: 10, scale:  2 }).notNull(),
	tax: numeric({ precision: 10, scale:  2 }).notNull(),
	shipping: numeric({ precision: 10, scale:  2 }).notNull(),
	shippingAddressId: integer("shipping_address_id"),
	billingAddressId: integer("billing_address_id"),
	paymentIntentId: varchar("payment_intent_id", { length: 255 }),
	checkoutSessionId: varchar("checkout_session_id", { length: 255 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.shippingAddressId],
			foreignColumns: [ecommerceProjectAddresses.id],
			name: "ECommerce Project_orders_shipping_address_id_ECommerce Project_"
		}),
	foreignKey({
			columns: [table.billingAddressId],
			foreignColumns: [ecommerceProjectAddresses.id],
			name: "ECommerce Project_orders_billing_address_id_ECommerce Project_a"
		}),
]);

export const ecommerceProjectOrderItems = pgTable("ECommerce Project_order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	quantity: integer().notNull(),
	metadata: json(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [ecommerceProjectOrders.id],
			name: "ECommerce Project_order_items_order_id_ECommerce Project_orders"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [ecommerceProjectProducts.id],
			name: "ECommerce Project_order_items_product_id_ECommerce Project_prod"
		}),
]);

export const ecommerceProjectAddresses = pgTable("ECommerce Project_addresses", {
	id: serial().primaryKey().notNull(),
	clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	address1: varchar({ length: 255 }).notNull(),
	address2: varchar({ length: 255 }),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 255 }).notNull(),
	postalCode: varchar("postal_code", { length: 20 }).notNull(),
	country: varchar({ length: 2 }).notNull(),
	phone: varchar({ length: 20 }),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});
