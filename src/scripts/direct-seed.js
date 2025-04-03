// Direct seed script that bypasses env validation
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Get DATABASE_URL from .env file directly if process.env doesn't have it
if (!process.env.DATABASE_URL) {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
    if (dbUrlMatch && dbUrlMatch[1]) {
      process.env.DATABASE_URL = dbUrlMatch[1];
    }
  } catch (error) {
    console.error('Error reading .env file:', error);
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in environment or .env file');
  process.exit(1);
}

console.log('Using DATABASE_URL:', DATABASE_URL.substring(0, 20) + '...');

async function directSeed() {
  try {
    console.log('Starting direct seed process...');
    // Create a direct connection to the database
    const client = postgres(DATABASE_URL);
    const db = drizzle(client);

    // Import schemas dynamically to avoid env validation
    const { products, productImages, orderItems, cartItems } = await import('../server/db/schema.js');

    console.log('Deleting existing data...');
    // Clear existing data in the correct order to handle foreign key constraints
    console.log('Deleting order items...');
    await db.delete(orderItems);
    console.log('Deleting cart items...');
    await db.delete(cartItems);
    console.log('Deleting product images...');
    await db.delete(productImages);
    console.log('Deleting products...');
    await db.delete(products);
    console.log('Existing data deleted');

    // Copy product data from seed.ts
    console.log('Inserting products...');
    const insertedProducts = await db
      .insert(products)
      .values([
        {
          name: "Diamond Pendant Necklace",
          slug: "diamond-pendant-necklace",
          description:
            "This elegant diamond pendant necklace features a stunning 0.5 carat diamond set in 18k white gold. The pendant hangs from a delicate 18-inch chain, making it the perfect accessory for any occasion.",
          price: "1299.00",
          category: "necklaces",
          material: "platinum",
          inventory: 10,
          isNew: true,
          isBestseller: false,
          isFeatured: true,
        },
        {
          name: "Gold Hoop Earrings",
          slug: "gold-hoop-earrings",
          description:
            "Classic 14k gold hoop earrings that add a touch of elegance to any outfit. These versatile earrings are perfect for both casual and formal occasions.",
          price: "499.00",
          category: "earrings",
          material: "gold",
          inventory: 15,
          isNew: false,
          isBestseller: true,
          isFeatured: true,
        },
        {
          name: "Sapphire Tennis Bracelet",
          slug: "sapphire-tennis-bracelet",
          description:
            "A stunning sapphire tennis bracelet featuring 25 round-cut blue sapphires set in 18k white gold. This bracelet adds a touch of luxury to any outfit.",
          price: "899.00",
          category: "bracelets",
          material: "silver",
          inventory: 8,
          isNew: true,
          isBestseller: false,
          isFeatured: true,
        },
        {
          name: "Emerald Cut Engagement Ring",
          slug: "emerald-cut-engagement-ring",
          description:
            "A breathtaking emerald-cut diamond engagement ring set in platinum. The center stone is a 1.5 carat emerald-cut diamond of exceptional clarity and color.",
          price: "2499.00",
          category: "rings",
          material: "platinum",
          inventory: 5,
          isNew: false,
          isBestseller: true,
          isFeatured: true,
        },
        {
          name: "Pearl Drop Earrings",
          slug: "pearl-drop-earrings",
          description:
            "Elegant pearl drop earrings featuring 8mm freshwater pearls suspended from 14k gold posts. These timeless earrings add sophistication to any look.",
          price: "349.00",
          category: "earrings",
          material: "gold",
          inventory: 20,
          isNew: false,
          isBestseller: false,
          isFeatured: false,
        },
        {
          name: "Rose Gold Chain Bracelet",
          slug: "rose-gold-chain-bracelet",
          description:
            "A delicate 14k rose gold chain bracelet with an adjustable length. This versatile piece can be worn alone or layered with other bracelets.",
          price: "599.00",
          category: "bracelets",
          material: "rose gold",
          inventory: 12,
          isNew: false,
          isBestseller: false,
          isFeatured: false,
        },
        {
          name: "Vintage Inspired Necklace",
          slug: "vintage-inspired-necklace",
          description:
            "A vintage-inspired pendant necklace featuring intricate filigree work in 14k yellow gold. The pendant is adorned with small diamonds for added sparkle.",
          price: "799.00",
          category: "necklaces",
          material: "gold",
          inventory: 7,
          isNew: false,
          isBestseller: false,
          isFeatured: false,
        },
        {
          name: "Stacking Rings Set",
          slug: "stacking-rings-set",
          description:
            "A set of three 14k gold stacking rings in yellow, white, and rose gold. These versatile rings can be worn together or separately for different looks.",
          price: "449.00",
          category: "rings",
          material: "gold",
          inventory: 15,
          isNew: true,
          isBestseller: false,
          isFeatured: false,
        },
      ])
      .returning();

    console.log(`Inserted ${insertedProducts.length} products`);
    console.log('Inserting product images...');

    // Insert product images
    const insertedImages = await db.insert(productImages).values([
      {
        productId: insertedProducts[0] && insertedProducts[0].id,
        url: "/images/jewelry/diamond-pendant-necklace.jpg",
        altText: "Diamond Pendant Necklace",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[1] && insertedProducts[1].id,
        url: "/images/jewelry/gold-hoop-earrings.jpg",
        altText: "Gold Hoop Earrings",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[2] && insertedProducts[2].id,
        url: "/images/jewelry/sapphire-tennis-bracelet.jpg",
        altText: "Sapphire Tennis Bracelet",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[3] && insertedProducts[3].id,
        url: "/images/jewelry/emerald-cut-engagement-ring.jpg",
        altText: "Emerald Cut Engagement Ring",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[4] && insertedProducts[4].id,
        url: "/images/jewelry/pearl-drop-earrings.jpg",
        altText: "Pearl Drop Earrings",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[5] && insertedProducts[5].id,
        url: "/images/jewelry/rose-gold-chain-bracelet.jpg",
        altText: "Rose Gold Chain Bracelet",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[6] && insertedProducts[6].id,
        url: "/images/jewelry/vintage-inspired-necklace.jpg",
        altText: "Vintage Inspired Necklace",
        isDefault: true,
        sortOrder: 0,
      },
      {
        productId: insertedProducts[7] && insertedProducts[7].id,
        url: "/images/jewelry/stacking-rings-set.jpg",
        altText: "Stacking Rings Set",
        isDefault: true,
        sortOrder: 0,
      },
    ]).returning();

    console.log(`Inserted ${insertedImages.length} product images`);
    console.log('Seed completed successfully');

    // Close the connection
    await client.end();

  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed function
directSeed()
  .then(() => {
    console.log('Direct seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Direct seed failed:', error);
    process.exit(1);
  }); 