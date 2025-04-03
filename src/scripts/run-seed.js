// Run seed script

// Load dotenv directly to ensure environment variables are set first
import dotenv from 'dotenv';
dotenv.config();

console.log('Starting seed script execution...');
console.log('Using DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');

// Override any env flags to ensure proper operation
process.env.SKIP_ENV_VALIDATION = "1";
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Now import the seed module
import { seed } from '../server/db/seed.js';

// Use an IIFE to run async code
(async function() {
  try {
    console.log('Executing seed function...');
    await seed();
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
})(); 