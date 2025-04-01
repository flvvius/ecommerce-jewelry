import { db } from "./index";
import { sql } from "drizzle-orm";

async function checkDatabase() {
  console.log("🔍 Starting database check");
  console.log(
    "Database URL:",
    process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
  );

  try {
    // Test connection
    console.log("\n📡 Testing connection...");
    const now = await db.execute(sql`SELECT NOW()`);
    console.log("Connection successful:", now.rows?.[0]);

    // Check tables
    console.log("\n📊 Checking tables...");
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log(
      "Tables:",
      tables.rows?.map((r) => r.table_name),
    );

    // Check products table
    console.log("\n🛍️ Checking products table...");
    const productsExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'ECommerce Project_products'
      );
    `);

    if (productsExists.rows?.[0]?.exists) {
      console.log("Products table exists ✅");

      // Check products count
      const productsCount = await db.execute(sql`
        SELECT COUNT(*) FROM "ECommerce Project_products";
      `);
      console.log("Products count:", productsCount.rows?.[0]?.count);

      // Check product sample
      if (parseInt(productsCount.rows?.[0]?.count) > 0) {
        const productsSample = await db.execute(sql`
          SELECT id, name, price, material FROM "ECommerce Project_products" LIMIT 3;
        `);
        console.log("Products sample:", productsSample.rows);
      } else {
        console.log("❌ No products found in the database");
      }
    } else {
      console.log("❌ Products table does not exist");
    }

    // Check product images
    console.log("\n🖼️ Checking product images table...");
    const imagesCount = await db.execute(sql`
      SELECT COUNT(*) FROM "ECommerce Project_product_images";
    `);
    console.log("Product images count:", imagesCount.rows?.[0]?.count);
  } catch (error) {
    console.error("❌ Error checking database:", error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDatabase()
    .then(() => {
      console.log("✅ Database check completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database check failed:", error);
      process.exit(1);
    });
}
