import { relations } from "drizzle-orm/relations";
import { ecommerceProjectProducts, ecommerceProjectProductImages, ecommerceProjectCarts, ecommerceProjectCartItems, ecommerceProjectAddresses, ecommerceProjectOrders, ecommerceProjectOrderItems } from "./schema";

export const ecommerceProjectProductImagesRelations = relations(ecommerceProjectProductImages, ({one}) => ({
	ecommerceProjectProduct: one(ecommerceProjectProducts, {
		fields: [ecommerceProjectProductImages.productId],
		references: [ecommerceProjectProducts.id]
	}),
}));

export const ecommerceProjectProductsRelations = relations(ecommerceProjectProducts, ({many}) => ({
	ecommerceProjectProductImages: many(ecommerceProjectProductImages),
	ecommerceProjectCartItems: many(ecommerceProjectCartItems),
	ecommerceProjectOrderItems: many(ecommerceProjectOrderItems),
}));

export const ecommerceProjectCartItemsRelations = relations(ecommerceProjectCartItems, ({one}) => ({
	ecommerceProjectCart: one(ecommerceProjectCarts, {
		fields: [ecommerceProjectCartItems.cartId],
		references: [ecommerceProjectCarts.id]
	}),
	ecommerceProjectProduct: one(ecommerceProjectProducts, {
		fields: [ecommerceProjectCartItems.productId],
		references: [ecommerceProjectProducts.id]
	}),
}));

export const ecommerceProjectCartsRelations = relations(ecommerceProjectCarts, ({many}) => ({
	ecommerceProjectCartItems: many(ecommerceProjectCartItems),
}));

export const ecommerceProjectOrdersRelations = relations(ecommerceProjectOrders, ({one, many}) => ({
	ecommerceProjectAddress_shippingAddressId: one(ecommerceProjectAddresses, {
		fields: [ecommerceProjectOrders.shippingAddressId],
		references: [ecommerceProjectAddresses.id],
		relationName: "ecommerceProjectOrders_shippingAddressId_ecommerceProjectAddresses_id"
	}),
	ecommerceProjectAddress_billingAddressId: one(ecommerceProjectAddresses, {
		fields: [ecommerceProjectOrders.billingAddressId],
		references: [ecommerceProjectAddresses.id],
		relationName: "ecommerceProjectOrders_billingAddressId_ecommerceProjectAddresses_id"
	}),
	ecommerceProjectOrderItems: many(ecommerceProjectOrderItems),
}));

export const ecommerceProjectAddressesRelations = relations(ecommerceProjectAddresses, ({many}) => ({
	ecommerceProjectOrders_shippingAddressId: many(ecommerceProjectOrders, {
		relationName: "ecommerceProjectOrders_shippingAddressId_ecommerceProjectAddresses_id"
	}),
	ecommerceProjectOrders_billingAddressId: many(ecommerceProjectOrders, {
		relationName: "ecommerceProjectOrders_billingAddressId_ecommerceProjectAddresses_id"
	}),
}));

export const ecommerceProjectOrderItemsRelations = relations(ecommerceProjectOrderItems, ({one}) => ({
	ecommerceProjectOrder: one(ecommerceProjectOrders, {
		fields: [ecommerceProjectOrderItems.orderId],
		references: [ecommerceProjectOrders.id]
	}),
	ecommerceProjectProduct: one(ecommerceProjectProducts, {
		fields: [ecommerceProjectOrderItems.productId],
		references: [ecommerceProjectProducts.id]
	}),
}));