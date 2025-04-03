// Image compression script for jewelry images
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const JEWELRY_DIR = 'public/images/jewelry';
const OUTPUT_DIR = 'public/images/jewelry/compressed';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process each image file
async function processImages() {
  console.log('Starting image compression...');
  
  // Get all jpg files in the jewelry directory
  const files = fs.readdirSync(JEWELRY_DIR)
    .filter(file => file.endsWith('.jpg') && !file.includes('compressed'));
  
  console.log(`Found ${files.length} images to compress`);
  
  for (const file of files) {
    const inputPath = path.join(JEWELRY_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    
    console.log(`Compressing: ${file}`);
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size / 1024; // KB
      
      // Compress the image
      await sharp(inputPath)
        .resize(800) // Resize to max 800px width while maintaining aspect ratio
        .jpeg({ quality: 70 }) // Reduce quality to 70%
        .toFile(outputPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSize = compressedStats.size / 1024; // KB
      
      const savingsPercent = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
      
      console.log(`  Original: ${originalSize.toFixed(2)} KB`);
      console.log(`  Compressed: ${compressedSize.toFixed(2)} KB`);
      console.log(`  Saved: ${savingsPercent}%`);
    } catch (error) {
      console.error(`  Error processing ${file}:`, error);
    }
  }
  
  console.log('Compression complete!');
}

// Run the compression
processImages().catch(err => {
  console.error('Error during compression:', err);
  process.exit(1);
}); 