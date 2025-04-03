// Replace original images with compressed versions
import fs from 'fs';
import path from 'path';

const JEWELRY_DIR = 'public/images/jewelry';
const COMPRESSED_DIR = 'public/images/jewelry/compressed';
const BACKUP_DIR = 'public/images/jewelry/originals';

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Process images
async function replaceImages() {
  console.log('Starting image replacement...');
  
  // Get all compressed images
  const files = fs.readdirSync(COMPRESSED_DIR).filter(file => file.endsWith('.jpg'));
  
  console.log(`Found ${files.length} compressed images to replace originals`);
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  
  for (const file of files) {
    const originalPath = path.join(JEWELRY_DIR, file);
    const compressedPath = path.join(COMPRESSED_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    
    console.log(`Replacing: ${file}`);
    
    try {
      // Get file sizes
      const originalStats = fs.statSync(originalPath);
      const compressedStats = fs.statSync(compressedPath);
      
      const originalSize = originalStats.size / 1024; // KB
      const compressedSize = compressedStats.size / 1024; // KB
      
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;
      
      // Backup original
      fs.copyFileSync(originalPath, backupPath);
      
      // Replace with compressed version
      fs.copyFileSync(compressedPath, originalPath);
      
      console.log(`  Original: ${originalSize.toFixed(2)} KB → Compressed: ${compressedSize.toFixed(2)} KB`);
    } catch (error) {
      console.error(`  Error replacing ${file}:`, error);
    }
  }
  
  const totalSavingsPercent = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2);
  
  console.log('\nReplacement summary:');
  console.log(`  Total original size: ${totalOriginalSize.toFixed(2)} KB`);
  console.log(`  Total compressed size: ${totalCompressedSize.toFixed(2)} KB`);
  console.log(`  Total space saved: ${(totalOriginalSize - totalCompressedSize).toFixed(2)} KB (${totalSavingsPercent}%)`);
  console.log('Original images have been backed up to:', BACKUP_DIR);
}

// Run the replacement
replaceImages().catch(err => {
  console.error('Error during replacement:', err);
  process.exit(1);
}); 