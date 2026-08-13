import 'dotenv/config'; // 👈 Esto carga las variables del archivo .env antes de nada
import { defineConfig } from 'drizzle-kit';
import { ENV } from './config/env';

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL || process.env.DATABASE_URL!,
  },
});