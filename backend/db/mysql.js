import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: "localhost",
  user: "shivam",
  password: `${process.env.MYSQL_PASSWORD}`,
});

const test = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("MySQL connected! Result:", rows);
  } catch (e) {
    console.error("Connection failed:", e);
  }
};

test();
export default pool;