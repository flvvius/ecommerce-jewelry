import { db } from "./index";
import { products } from "./schema";
import { eq } from "drizzle-orm";

async function updateMaterials() {
  try {
    console.log("Starting material updates...");

    // Get current data
    const currentProducts = await db.select().from(products);
    console.log("Current products:", currentProducts);

    // Add material data to products
    const result1 = await db
      .update(products)
      .set({ material: "platinum" })
      .where(eq(products.id, 1))
      .returning();

    console.log("Update 1 result:", result1);

    const result2 = await db
      .update(products)
      .set({ material: "gold" })
      .where(eq(products.id, 2))
      .returning();

    console.log("Update 2 result:", result2);

    const result3 = await db
      .update(products)
      .set({ material: "silver" })
      .where(eq(products.id, 3))
      .returning();

    console.log("Update 3 result:", result3);

    const result4 = await db
      .update(products)
      .set({ material: "platinum" })
      .where(eq(products.id, 4))
      .returning();

    console.log("Update 4 result:", result4);

    const result5 = await db
      .update(products)
      .set({ material: "gold" })
      .where(eq(products.id, 5))
      .returning();

    console.log("Update 5 result:", result5);

    const result6 = await db
      .update(products)
      .set({ material: "rose gold" })
      .where(eq(products.id, 6))
      .returning();

    console.log("Update 6 result:", result6);

    const result7 = await db
      .update(products)
      .set({ material: "gold" })
      .where(eq(products.id, 7))
      .returning();

    console.log("Update 7 result:", result7);

    const result8 = await db
      .update(products)
      .set({ material: "gold" })
      .where(eq(products.id, 8))
      .returning();

    console.log("Update 8 result:", result8);

    // Get updated data
    const updatedProducts = await db.select().from(products);
    console.log("Updated products:", updatedProducts);

    console.log("Material data updated successfully");
  } catch (error) {
    console.error("Error updating material data:", error);
    throw error;
  }
}

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateMaterials()
    .then(() => {
      console.log("Material update complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during material update:", err);
      process.exit(1);
    });
}
