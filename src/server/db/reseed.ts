import { db } from "./index";
import { products, productImages } from "./schema";
import { sql } from "drizzle-orm";

async function reseedDatabase() {
  try {
    console.log("\n===== DATABASE RESEED PROCESS =====\n");
    console.log("Starting complete database reseed process...");
    console.log(
      "Database URL:",
      process.env.DATABASE_URL ? "✓ Set" : "✗ Not set",
    );

    // Test database connection
    try {
      console.log("\n----- TESTING DATABASE CONNECTION -----\n");
      const testResult = await db.execute(sql`SELECT NOW()`);
      console.log(
        "Database connection successful:",
        JSON.stringify(testResult.rows?.[0] || testResult),
      );
    } catch (connError) {
      console.error("Database connection failed:", connError);
      throw new Error("Failed to connect to database");
    }

    // Step 1: Verify the schema
    console.log("\n----- VERIFYING SCHEMA -----\n");
    try {
      // Check if table exists
      const tableCheck = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'ECommerce Project_products'
        );
      `);
      console.log("Products table exists:", tableCheck.rows?.[0]?.exists);

      // Add material column if it doesn't exist
      await db.execute(sql`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'ECommerce Project_products' AND column_name = 'material'
          ) THEN
            ALTER TABLE "ECommerce Project_products" ADD COLUMN material TEXT;
          END IF;
        END
        $$;
      `);
      console.log("Schema verification completed");
    } catch (schemaError) {
      console.error("Schema verification failed:", schemaError);
      throw schemaError;
    }

    // Step 2: Clear all existing data
    console.log("\n----- CLEARING EXISTING DATA -----\n");
    try {
      await db.delete(productImages);
      console.log("Product images deleted");
      await db.delete(products);
      console.log("Products deleted");
    } catch (clearError) {
      console.error("Failed to clear data:", clearError);
      throw clearError;
    }

    // Step 3: Insert new products with material values
    console.log("\n----- INSERTING PRODUCTS -----\n");
    let insertedProducts;
    try {
      insertedProducts = await db
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

      console.log(`Successfully inserted ${insertedProducts.length} products`);
      console.dir(insertedProducts[0], { depth: null });
    } catch (insertError) {
      console.error("Failed to insert products:", insertError);
      throw insertError;
    }

    // Step 4: Insert product images
    console.log("Inserting product images...");
    await db.insert(productImages).values([
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
    ]);

    // Step 6: Verify the final state of the database
    console.log("\n----- VERIFYING FINAL DATABASE STATE -----\n");
    try {
      const finalProducts = await db.execute(sql`
        SELECT id, name, material FROM "ECommerce Project_products" ORDER BY id;
      `);

      console.log("Final products count:", finalProducts.rows?.length || 0);
      console.dir(finalProducts.rows?.slice(0, 2) || [], { depth: null });

      // Verify product images
      const productImagesCount = await db.execute(sql`
        SELECT COUNT(*) FROM "ECommerce Project_product_images";
      `);
      console.log(
        "Product images count:",
        productImagesCount.rows?.[0]?.count || 0,
      );

      // Check API connection
      try {
        console.log("\n----- TESTING API -----\n");
        const apiUrl = new URL(
          "/api/products",
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
        );

        console.log("Testing API at:", apiUrl.toString());
        const response = await fetch(apiUrl.toString(), {
          cache: "no-store",
        });
        const data = await response.json();
        console.log("API test status:", response.status);
        console.log(
          "API product count:",
          Array.isArray(data) ? data.length : "N/A",
        );
        if (Array.isArray(data) && data.length > 0) {
          console.dir(data[0], { depth: null });
        }
      } catch (apiError) {
        console.error("API test failed:", apiError);
      }
    } catch (verifyError) {
      console.error("Failed to verify final state:", verifyError);
    }

    console.log("\n===== DATABASE RESEED COMPLETED =====\n");
  } catch (error) {
    console.error("Error during database reseed:", error);
    throw error;
  }
}

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  reseedDatabase()
    .then(() => {
      console.log("Reseed process completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during reseed process:", err);
      process.exit(1);
    });
}
