import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function updateProductImages() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  console.log(`Connecting to database...`);
  
  // Create postgres connection with SSL enabled
  const sql = postgres(databaseUrl, {
    ssl: true,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  try {
    console.log("Verifying database connection...");
    const connectionCheck = await sql`SELECT 1 as connection_test`;
    console.log("Database connection successful:", connectionCheck[0]);

    console.log("Updating product images...");
    
    // Get all products
    const products = await sql`
      SELECT id, slug, name FROM "ECommerce Project_products"
    `;
    
    console.log(`Found ${products.length} products to update`);
    
    // Update images for each product
    for (const product of products) {
      // Delete existing images
      await sql`
        DELETE FROM "ECommerce Project_product_images" 
        WHERE product_id = ${product.id}
      `;
      
      // Add new image with the correct URL
      await sql`
        INSERT INTO "ECommerce Project_product_images" (
          product_id, url, alt_text, is_default, sort_order
        ) VALUES (
          ${product.id}, 
          ${`/images/jewelry/${product.slug}.jpg`}, 
          ${product.name}, 
          true, 
          0
        )
      `;
      
      console.log(`Updated images for product: ${product.name}`);
    }
    
    console.log("All product images have been updated successfully!");
    
    // Verify the update
    const updatedImages = await sql`
      SELECT p.name, pi.url 
      FROM "ECommerce Project_product_images" pi
      JOIN "ECommerce Project_products" p ON pi.product_id = p.id
      LIMIT 5
    `;
    
    console.log("Sample of updated images:");
    console.table(updatedImages);
    
  } catch (error) {
    console.error("Error updating product images:", error);
  } finally {
    await sql.end();
    console.log("Database connection closed");
  }
}

// Run the script
updateProductImages(); 