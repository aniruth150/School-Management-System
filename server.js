// server.js
require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const { initDb } = require("./database");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend (public folder)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Fallback: send index.html for unknown non-api routes (nice for direct links)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`\nSchool Management System running at: http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error("\n--------------------------------------------------");
    console.error("Could not connect to MySQL.");
    console.error("Check the DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME");
    console.error("values in your .env file, and make sure MySQL is running.");
    console.error("--------------------------------------------------");
    console.error(err.message);
    process.exit(1);
  }
}

start();
