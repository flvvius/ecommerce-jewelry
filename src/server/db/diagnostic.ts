import { db } from "./index";
import { sql } from "drizzle-orm";

async function diagnoseDatabase() {
  try {
    console.log("Starting database diagnostic...");
    console.log(
      "Database URL:",
      process.env.DATABASE_URL ? "✓ Set" : "✗ Not set",
    );

    // Test database connection
    try {
      console.log("Testing database connection...");
      const testResult = await db.execute(sql`SELECT NOW()`);
      console.log(
        "Database connection successful:",
        testResult.rows?.[0] ?? testResult,
      );
    } catch (connError) {
      console.error("Database connection failed:", connError);
      return;
    }

    // List tables
    try {
      console.log("Listing database tables...");
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      console.log("Tables in database:", tables.rows);
    } catch (listError) {
      console.error("Failed to list tables:", listError);
    }

    // Check products table
    try {
      console.log("Checking products table...");
      const productsTable = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ECommerce Project_products' 
        ORDER BY ordinal_position;
      `);
      console.log("Products table schema:", productsTable.rows);

      const productCount = await db.execute(sql`
        SELECT COUNT(*) as count FROM "ECommerce Project_products";
      `);
      console.log("Product count:", productCount.rows?.[0]);

      if (parseInt(productCount.rows?.[0]?.count) > 0) {
        const sampleProducts = await db.execute(sql`
          SELECT id, name, price, material FROM "ECommerce Project_products" LIMIT 3;
        `);
        console.log("Sample products:", sampleProducts.rows);
      }
    } catch (tableError) {
      console.error("Failed to check products table:", tableError);
    }

    console.log("Database diagnostic completed");
  } catch (error) {
    console.error("Error during database diagnostic:", error);
  }
}

// Run the diagnostic function if this file is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  diagnoseDatabase()
    .then(() => {
      console.log("Diagnostic completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during diagnostic:", err);
      process.exit(1);
    });
}
