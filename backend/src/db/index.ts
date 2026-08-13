import 'dotenv/config';
import { ENV } from './../config/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';



if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Initialize PostgreSQL connection Pool
const pool = new Pool({ connectionString: ENV.DATABASE_URL });

// log when first connetion is made
pool.on("connect", () => {
    console.log("Database connected successfully ✅");
    
})


// log when first connetion is made
pool.on("error", (err) => {
    console.log("❌ Database connection error:", err);
    
});

export const db = drizzle({ client:pool, schema });

// 👀 What is a Connection Pool?
// A connection pool is a chache of database connections that are kept open and reused.
// 🤷‍♂️ Why use it?
// 🔴 Opening/closing connections is slow. Instead of creating a new connection for each request, we reuse existing ones.
// 🔴 Databases limit concurrent connections. A pool manages a fixed number of connections and shares them across requests.