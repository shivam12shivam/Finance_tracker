import pool from "../db/postgres.js";

export const initPostgresTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS monthly_summaries (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      month VARCHAR(7) NOT NULL,
      total_spent DECIMAL(10, 2) NOT NULL,
      top_category VARCHAR(50),
      overbudget_categories TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
