-- Add material column if it doesn't exist
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

-- Update materials for existing products
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