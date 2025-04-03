import { db } from "./index";
import { products, productImages } from "./schema";
import * as fs from "fs";

const logToFile = (message: string) => {
  const logMessage = `${new Date().toISOString()}: ${message}\n`;
  console.log(message);
  fs.appendFileSync("seed-log.txt", logMessage);
};

export async function seed() {
  try {
    logToFile("Starting seed process...");
    // Clear existing data
    logToFile("Deleting existing data...");
    await db.delete(productImages);
    await db.delete(products);
    logToFile("Existing data deleted successfully.");

    logToFile("Inserting products with materials...");
    // Insert products
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

    logToFile(`Inserted ${insertedProducts.length} products successfully.`);
    logToFile("Inserting product images...");

    // Insert product images
    const insertedImages = await db
      .insert(productImages)
      .values([
        {
          productId: insertedProducts[0]!.id,
          url: "/images/jewelry/diamond-pendant-necklace.jpg",
          altText: "Diamond Pendant Necklace",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[1]!.id,
          url: "/images/jewelry/gold-hoop-earrings.jpg",
          altText: "Gold Hoop Earrings",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[2]!.id,
          url: "/images/jewelry/sapphire-tennis-bracelet.jpg",
          altText: "Sapphire Tennis Bracelet",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[3]!.id,
          url: "/images/jewelry/emerald-cut-engagement-ring.jpg",
          altText: "Emerald Cut Engagement Ring",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[4]!.id,
          url: "/images/jewelry/pearl-drop-earrings.jpg",
          altText: "Pearl Drop Earrings",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[5]!.id,
          url: "/images/jewelry/rose-gold-chain-bracelet.jpg",
          altText: "Rose Gold Chain Bracelet",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[6]!.id,
          url: "/images/jewelry/vintage-inspired-necklace.jpg",
          altText: "Vintage Inspired Necklace",
          isDefault: true,
          sortOrder: 0,
        },
        {
          productId: insertedProducts[7]!.id,
          url: "/images/jewelry/stacking-rings-set.jpg",
          altText: "Stacking Rings Set",
          isDefault: true,
          sortOrder: 0,
        },
      ])
      .returning();

    logToFile(`Inserted ${insertedImages.length} product images successfully.`);

    // Verify products with materials
    const productsWithMaterials = await db.select().from(products);
    logToFile(
      `Verification: Found ${productsWithMaterials.length} products with materials in the database.`,
    );

    logToFile("Seed data inserted successfully");
  } catch (error) {
    const errorMsg = `Error seeding database: ${error}`;
    console.error(errorMsg);
    fs.appendFileSync(
      "seed-log.txt",
      `${new Date().toISOString()}: ERROR - ${errorMsg}\n`,
    );
    throw error;
  }
}

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("Seeding complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during seeding:", err);
      process.exit(1);
    });
}
