import { Client } from "pg";
import { env } from "../src/config/env";

async function cleanDb() {
	const client = new Client({ connectionString: env.DATABASE_URL });
	await client.connect();
	// Drop all user tables (except for system tables)
	await client.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      -- Drop all tables
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
      -- Drop all extensions (optional, comment if you want to keep extensions)
      -- FOR r IN (SELECT extname FROM pg_extension WHERE extname != 'plpgsql') LOOP
      --   EXECUTE 'DROP EXTENSION IF EXISTS ' || quote_ident(r.extname) || ' CASCADE';
      -- END LOOP;
    END $$;
  `);
	await client.end();
	console.log("Database cleaned!");
}

cleanDb().catch((e) => {
	console.error(e);
	process.exit(1);
});
