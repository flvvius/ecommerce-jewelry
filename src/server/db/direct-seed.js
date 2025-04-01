// Direct DB seeding using Node.js and pg
import pg from 'pg';
const { Client } = pg;

async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database successfully');

    // Check connection
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);

    // Check table schema
    console.log('Checking table schema...');
    const tableInfo = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ECommerce Project_products'
    `);
    console.log('Table columns:', tableInfo.rows.map(r => r.column_name));

    // Delete existing data
    console.log('Deleting existing data...');
    await client.query('DELETE FROM "ECommerce Project_product_images"');
    await client.query('DELETE FROM "ECommerce Project_products"');
    console.log('Existing data deleted');

    // Insert new products
    console.log('Inserting products...');
    const insertedProducts = await client.query(`
      INSERT INTO "ECommerce Project_products" (
        name, slug, description, price, 
        category, material, inventory, 
        "is_new", "is_bestseller", "is_featured"
      ) VALUES 
      (
        'Diamond Pendant Necklace', 
        'diamond-pendant-necklace', 
        'This elegant diamond pendant necklace features a stunning 0.5 carat diamond set in 18k white gold.',
        '1299.00',
        'necklaces',
        'platinum',
        10,
        true,
        false,
        true
      ),
      (
        'Gold Hoop Earrings', 
        'gold-hoop-earrings', 
        'Classic 14k gold hoop earrings that add a touch of elegance to any outfit.',
        '499.00',
        'earrings',
        'gold',
        15,
        false,
        true,
        true
      ),
      (
        'Sapphire Tennis Bracelet', 
        'sapphire-tennis-bracelet', 
        'A stunning sapphire tennis bracelet featuring 25 round-cut blue sapphires set in 18k white gold.',
        '899.00',
        'bracelets',
        'silver',
        8,
        true,
        false,
        true
      ),
      (
        'Emerald Cut Engagement Ring', 
        'emerald-cut-engagement-ring', 
        'A breathtaking emerald-cut diamond engagement ring set in platinum.',
        '2499.00',
        'rings',
        'platinum',
        5,
        false,
        true,
        true
      ),
      (
        'Rose Gold Chain Bracelet', 
        'rose-gold-chain-bracelet', 
        'A delicate 14k rose gold chain bracelet with an adjustable length. Perfect for layering with other pieces.',
        '599.00',
        'bracelets',
        'rose gold',
        12,
        true,
        false,
        false
      ),
      (
        'Pearl Stud Earrings', 
        'pearl-stud-earrings', 
        'Elegant freshwater pearl stud earrings set in sterling silver, perfect for everyday wear.',
        '199.00',
        'earrings',
        'silver',
        20,
        false,
        true,
        false
      ),
      (
        'Gold Link Chain Necklace', 
        'gold-link-chain-necklace', 
        'A timeless 18k gold link chain necklace that makes a statement on its own or layered with other pieces.',
        '1099.00',
        'necklaces',
        'gold',
        7,
        false,
        false,
        true
      ),
      (
        'Twisted Band Ring', 
        'twisted-band-ring', 
        'A sophisticated twisted band ring crafted in 14k rose gold, perfect for stacking or wearing alone.',
        '449.00',
        'rings',
        'rose gold',
        15,
        true,
        false,
        false
      ),
      (
        'Diamond Eternity Band', 
        'diamond-eternity-band', 
        'A stunning eternity band featuring 0.75 carats of round brilliant diamonds set in platinum.',
        '1899.00',
        'rings',
        'platinum',
        6,
        false,
        true,
        true
      ),
      (
        'Silver Cuff Bracelet', 
        'silver-cuff-bracelet', 
        'A statement sterling silver cuff bracelet with an elegant hammered finish.',
        '349.00',
        'bracelets',
        'silver',
        10,
        false,
        false,
        false
      ),
      (
        'Two-Tone Hoop Earrings', 
        'two-tone-hoop-earrings', 
        'Modern two-tone hoop earrings crafted with 14k gold and sterling silver for a contemporary look.',
        '399.00',
        'earrings',
        'gold and silver',
        12,
        true,
        false,
        false
      ),
      (
        'Gemstone Pendant Necklace', 
        'gemstone-pendant-necklace', 
        'A beautiful pendant necklace featuring a bezel-set gemstone of your choice in 14k gold.',
        '699.00',
        'necklaces',
        'gold',
        9,
        false,
        false,
        true
      )
      RETURNING id, name, material;
    `);

    console.log('Products inserted:', insertedProducts.rows.length);
    console.log('First product:', insertedProducts.rows[0]);

    // Insert product images
    console.log('Inserting product images...');
    // First check the product_images table schema
    const imageTableInfo = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ECommerce Project_product_images'
    `);
    console.log('Product images table columns:', imageTableInfo.rows.map(r => r.column_name));
    
    for (const product of insertedProducts.rows) {
      await client.query(`
        INSERT INTO "ECommerce Project_product_images" (
          "product_id", url, "alt_text", "is_default", "sort_order"
        ) VALUES (
          ${product.id}, 
          '/placeholder.svg?height=600&width=600', 
          $1, 
          true, 
          0
        )
      `, [product.name]);
    }
    console.log('Product images inserted');

    // Verify
    const productCount = await client.query('SELECT COUNT(*) FROM "ECommerce Project_products"');
    console.log('Total products in database:', productCount.rows[0].count);

    const imageCount = await client.query('SELECT COUNT(*) FROM "ECommerce Project_product_images"');
    console.log('Total product images in database:', imageCount.rows[0].count);

    // Check material distribution
    const materialCounts = await client.query(`
      SELECT material, COUNT(*) as count 
      FROM "ECommerce Project_products" 
      GROUP BY material 
      ORDER BY count DESC
    `);
    console.log('Material distribution:', materialCounts.rows);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// IIFE to run the function
seedDatabase()
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  }); 