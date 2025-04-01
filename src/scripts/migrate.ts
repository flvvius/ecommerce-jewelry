import { db } from "../server/db"
import { migrate } from "drizzle-orm/vercel-postgres/migrator"

async function main() {
  try {
    console.log("Running migrations...")
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }
}

main()

