import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 5,
});

pool.on("error", (err) => {
  console.error("Erro inesperado no pool:", err);
});
