import { runMigrations } from "../server/db/"
import { seed } from "../server/db/seed"

async function main() {
  try {
    console.log("Running migrations...")
    await runMigrations()

    console.log("Seeding database...")
    await seed()

    console.log("Database setup complete!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

main()

