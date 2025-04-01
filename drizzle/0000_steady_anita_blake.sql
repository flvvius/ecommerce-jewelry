CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('necklaces', 'rings', 'earrings', 'bracelets', 'other');--> statement-breakpoint
CREATE TABLE "ECommerce Project_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"address1" varchar(255) NOT NULL,
	"address2" varchar(255),
	"city" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(2) NOT NULL,
	"phone" varchar(20),
	"is_default" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "ECommerce Project_cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ECommerce Project_carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255),
	"session_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ECommerce Project_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE "ECommerce Project_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255),
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) NOT NULL,
	"shipping" numeric(10, 2) NOT NULL,
	"shipping_address_id" integer,
	"billing_address_id" integer,
	"payment_intent_id" varchar(255),
	"checkout_session_id" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ECommerce Project_product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"is_default" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "ECommerce Project_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"category" "product_category" NOT NULL,
	"material" text,
	"inventory" integer DEFAULT 0 NOT NULL,
	"is_new" boolean DEFAULT false,
	"is_bestseller" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ECommerce Project_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "ECommerce Project_cart_items" ADD CONSTRAINT "ECommerce Project_cart_items_cart_id_ECommerce Project_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."ECommerce Project_carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ECommerce Project_cart_items" ADD CONSTRAINT "ECommerce Project_cart_items_product_id_ECommerce Project_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."ECommerce Project_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ECommerce Project_order_items" ADD CONSTRAINT "ECommerce Project_order_items_order_id_ECommerce Project_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ECommerce Project_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ECommerce Project_order_items" ADD CONSTRAINT "ECommerce Project_order_items_product_id_ECommerce Project_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."ECommerce Project_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ECommerce Project_orders" ADD CONSTRAINT "ECommerce Project_orders_shipping_address_id_ECommerce Project_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."ECommerce Project_addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ECommerce Project_orders" ADD CONSTRAINT "ECommerce Project_orders_billing_address_id_ECommerce Project_addresses_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "public"."ECommerce Project_addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ECommerce Project_product_images" ADD CONSTRAINT "ECommerce Project_product_images_product_id_ECommerce Project_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."ECommerce Project_products"("id") ON DELETE cascade ON UPDATE no action;