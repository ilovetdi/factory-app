const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// DB kapcsolat
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

// ===== DB WAIT (EZ OLDJA MEG A HIBÁT) =====
async function waitForDB() {
  while (true) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ DB connected");
      break;
    } catch (err) {
      console.log("⏳ DB not ready, retrying...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  await initDB();
}

// ===== DB INIT (táblák + admin) =====
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS machines (
      id SERIAL PRIMARY KEY,
      name TEXT,
      x INT,
      y INT
    );

    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      machine_id INT,
      text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const admin = await pool.query(
    "SELECT * FROM users WHERE username='admin'"
  );

  if (admin.rows.length === 0) {
    const hash = await bcrypt.hash("admin", 10);
    await pool.query(
      "INSERT INTO users(username,password,role) VALUES($1,$2,$3)",
      ["admin", hash, "admin"]
    );

    console.log("👤 Admin created (admin/admin)");
  }
}

// ===== LOGIN =====
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if (user.rows.length === 0) return res.sendStatus(401);

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  if (!valid) return res.sendStatus(401);

  const token = jwt.sign(user.rows[0], process.env.JWT_SECRET);
  res.json({ token });
});

// ===== MACHINES =====
app.get("/machines", async (req, res) => {
  const result = await pool.query("SELECT * FROM machines");
  res.json(result.rows);
});

app.post("/machines", async (req, res) => {
  const { name, x, y } = req.body;

  await pool.query(
    "INSERT INTO machines(name,x,y) VALUES($1,$2,$3)",
    [name, x, y]
  );

  res.sendStatus(200);
});

// ===== LOGS =====
app.get("/logs/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM logs WHERE machine_id=$1",
    [req.params.id]
  );

  res.json(result.rows);
});

app.post("/logs", async (req, res) => {
  const { machine_id, text } = req.body;

  await pool.query(
    "INSERT INTO logs(machine_id,text) VALUES($1,$2)",
    [machine_id, text]
  );

  res.sendStatus(200);
});

// ===== START SERVER =====
app.listen(3000, async () => {
  console.log("🚀 Backend starting...");
  await waitForDB();
  console.log("🚀 Backend running on port 3000");
});
app.get("/", (req, res) => {
  res.send("🚀 Factory Backend is running");
});