import { db } from "./index";
import { sql } from "drizzle-orm";

async function updateMaterialsWithSQL() {
  try {
    console.log("Starting SQL updates for materials...");

    // Execute raw SQL to update materials
    const results = await db.execute(sql`
      UPDATE "ECommerce Project_products" 
      SET material = CASE 
          WHEN id = 1 THEN 'platinum'
          WHEN id = 2 THEN 'gold'
          WHEN id = 3 THEN 'silver'
          WHEN id = 4 THEN 'platinum'
          WHEN id = 5 THEN 'gold'
          WHEN id = 6 THEN 'rose gold'
          WHEN id = 7 THEN 'gold'
          WHEN id = 8 THEN 'gold'
          ELSE material
        END;
    `);

    console.log("SQL update results:", results);

    // Verify the updates
    const updated = await db.execute(sql`
      SELECT id, material FROM "ECommerce Project_products" ORDER BY id;
    `);

    console.log("Updated materials:", updated);

    console.log("Materials updated successfully using SQL");
  } catch (error) {
    console.error("Error updating materials with SQL:", error);
    throw error;
  }
}

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateMaterialsWithSQL()
    .then(() => {
      console.log("SQL update complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during SQL update:", err);
      process.exit(1);
    });
}
