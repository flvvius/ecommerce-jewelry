SELECT p.name, p.slug, pi.url FROM "ECommerce Project_product_images" pi JOIN "ECommerce Project_products" p ON pi.product_id = p.id LIMIT 10;
