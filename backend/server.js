
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// init db
(async () => {
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

  // create admin if not exists
  const admin = await pool.query("SELECT * FROM users WHERE username='admin'");
  if (admin.rows.length === 0) {
    const hash = await bcrypt.hash("admin", 10);
    await pool.query("INSERT INTO users(username,password,role) VALUES($1,$2,$3)", [
      "admin",
      hash,
      "admin"
    ]);
  }
})();

// login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
  if (user.rows.length === 0) return res.sendStatus(401);

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.sendStatus(401);

  const token = jwt.sign(user.rows[0], process.env.JWT_SECRET);
  res.json({ token });
});

// machines
app.get("/machines", async (req, res) => {
  const result = await pool.query("SELECT * FROM machines");
  res.json(result.rows);
});

app.post("/machines", async (req, res) => {
  const { name, x, y } = req.body;
  await pool.query("INSERT INTO machines(name,x,y) VALUES($1,$2,$3)", [name, x, y]);
  res.sendStatus(200);
});

// logs
app.get("/logs/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM logs WHERE machine_id=$1", [req.params.id]);
  res.json(result.rows);
});

app.post("/logs", async (req, res) => {
  const { machine_id, text } = req.body;
  await pool.query("INSERT INTO logs(machine_id,text) VALUES($1,$2)", [machine_id, text]);
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Backend running"));
