
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
      console.log("✅ DB ready");
      break;
    } catch (e) {
      console.log("⏳ waiting for DB...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function init() {
  await waitForDB();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS machines (
      id SERIAL PRIMARY KEY,
      name TEXT,
      x INT,
      y INT,
      status TEXT DEFAULT 'green'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      machine_id INT,
      text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT,
      password TEXT
    );
  `);

  await pool.query(`
    INSERT INTO users(username,password)
    SELECT 'admin','admin'
    WHERE NOT EXISTS (
      SELECT 1 FROM users WHERE username='admin'
    );
  `);
}

app.post("/login", async (req,res)=>{
  const {username,password} = req.body;
  const r = await pool.query("SELECT * FROM users WHERE username=$1 AND password=$2",[username,password]);
  if(r.rows.length) res.json({ok:true});
  else res.status(401).json({ok:false});
});

app.get("/machines", async (req,res)=>{
  const r = await pool.query("SELECT * FROM machines");
  res.json(r.rows);
});

app.get("/machines/:id", async (req,res)=>{
  const r = await pool.query("SELECT * FROM machines WHERE id=$1",[req.params.id]);
  res.json(r.rows[0]);
});

app.post("/machines", async (req,res)=>{
  const {name,x,y} = req.body;
  await pool.query("INSERT INTO machines(name,x,y) VALUES($1,$2,$3)",[name,x,y]);
  res.sendStatus(200);
});

app.put("/machines/:id", async (req,res)=>{
  const {x,y} = req.body;
  await pool.query("UPDATE machines SET x=$1,y=$2 WHERE id=$3",[x,y,req.params.id]);
  res.sendStatus(200);
});

app.get("/logs/:id", async (req,res)=>{
  const r = await pool.query("SELECT * FROM logs WHERE machine_id=$1 ORDER BY created_at DESC",[req.params.id]);
  res.json(r.rows);
});

app.post("/logs", async (req,res)=>{
  const {machine_id,text} = req.body;
  await pool.query("INSERT INTO logs(machine_id,text) VALUES($1,$2)",[machine_id,text]);
  res.sendStatus(200);
});

app.listen(3000,"0.0.0.0", async ()=>{
  await init();
  console.log("Backend running");
});
