
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function waitForDB() {
  while (true) {
    try {
      await pool.query("SELECT 1");
      break;
    } catch {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS machines (
      id SERIAL PRIMARY KEY,
      name TEXT,
      x INT,
      y INT,
      status TEXT
    );
  `);
}

app.get("/machines", async (req, res) => {
  const r = await pool.query("SELECT * FROM machines");
  res.json(r.rows);
});

app.post("/machines", async (req, res) => {
  const { name, x, y, status } = req.body;
  await pool.query(
    "INSERT INTO machines(name,x,y,status) VALUES($1,$2,$3,$4)",
    [name, x, y, status]
  );
  res.sendStatus(200);
});

app.put("/machines/:id", async (req, res) => {
  const { x, y } = req.body;
  await pool.query(
    "UPDATE machines SET x=$1,y=$2 WHERE id=$3",
    [x, y, req.params.id]
  );
  res.sendStatus(200);
});

app.listen(3000, "0.0.0.0", async () => {
  await waitForDB();
  console.log("Backend running");
});
