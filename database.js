// database.js
// Connects to MySQL using the credentials in your .env file,
// creates the database/tables if they don't exist yet, and seeds
// a default admin account so you can log in immediately.
//
// Data is split into three separate tables:
//   admins   - the school administrator(s)
//   teachers - all registered teachers
//   students - all registered students

require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "school_management",
} = process.env;

// Pool used by the rest of the app for normal queries.
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Creates the database itself (if missing), the three tables, and
// seeds a default admin. Call this once before the server starts.
async function initDb() {
  // 1. Make sure the database exists (connect without selecting a DB first)
  const rootConn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await rootConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4`
  );
  await rootConn.end();

  // 2. Create the three tables if they don't exist yet
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(150) NOT NULL,
      email         VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(150) NOT NULL,
      email         VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone         VARCHAR(30),
      subject       VARCHAR(100),
      qualification VARCHAR(150),
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(150) NOT NULL,
      email         VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone         VARCHAR(30),
      class_name    VARCHAR(100),
      roll_number   VARCHAR(50),
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // 3. Seed a default admin account if none exists
  const [admins] = await pool.query("SELECT id FROM admins LIMIT 1");

  if (admins.length === 0) {
    const defaultPassword = "Admin@123";
    const hash = bcrypt.hashSync(defaultPassword, 10);
    await pool.query(
      `INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)`,
      ["System Admin", "admin@school.com", hash]
    );

    console.log("--------------------------------------------------");
    console.log("Default admin account created:");
    console.log("  Email:    admin@school.com");
    console.log("  Password: Admin@123");
    console.log("Please change this password after first login.");
    console.log("--------------------------------------------------");
  }
}

module.exports = { pool, initDb };
