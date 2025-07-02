import pool from "../db/mysql.js";

export const initMySQLTables = async () => {
  await pool.query(`CREATE DATABASE IF NOT EXISTS expense_db`);
  await pool.query(`USE expense_db`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS monthly_summaries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      month VARCHAR(7) NOT NULL,
      total_spent DECIMAL(10, 2) NOT NULL,
      top_category VARCHAR(50),
      overbudget_categories TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
