const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/logs/" });
app.use("/uploads", express.static("uploads"));

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

let externalBase = "";

// 🔥 DB WAIT (EZ OLDJA MEG A CRASH-T)
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

async function init(){
  await waitForDB();

  // SETTINGS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings(
      id SERIAL PRIMARY KEY,
      external_url TEXT
    );
  `);

  const s = await pool.query("SELECT * FROM settings LIMIT 1");
  if(s.rows[0]) externalBase = s.rows[0].external_url;

  // USERS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      username TEXT,
      password TEXT,
      role TEXT
    );
  `);

  await pool.query(`
    INSERT INTO users(username,password,role)
    SELECT 'admin','admin','admin'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');
  `);

  // LOGS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS logs(
      id SERIAL PRIMARY KEY,
      machine_id INT,
      text TEXT,
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 🔥 MIGRATION FIX (régi DB-hez)
  await pool.query(`
    ALTER TABLE logs ADD COLUMN IF NOT EXISTS image TEXT;
  `);
}

// LOGIN
app.post("/login", async (req,res)=>{
  const {username,password}=req.body;
  const r=await pool.query(
    "SELECT * FROM users WHERE username=$1 AND password=$2",
    [username,password]
  );
  if(r.rows.length) res.json(r.rows[0]);
  else res.status(401).json({});
});

// FILE UPLOAD
app.post("/upload", upload.single("file"), (req,res)=>{
  let filePath = req.file.path;
  let url = externalBase ? externalBase + "/" + filePath : "/" + filePath;
  res.json({ path: url });
});

// LOG CREATE
app.post("/logs", async (req,res)=>{
  const {machine_id,text,image}=req.body;
  await pool.query(
    "INSERT INTO logs(machine_id,text,image) VALUES($1,$2,$3)",
    [machine_id,text,image]
  );
  res.sendStatus(200);
});

// LOG LIST
app.get("/logs/:id", async (req,res)=>{
  const r=await pool.query(
    "SELECT * FROM logs WHERE machine_id=$1 ORDER BY created_at DESC",
    [req.params.id]
  );
  res.json(r.rows);
});

// SETTINGS
app.post("/settings", async (req,res)=>{
  const {external_url}=req.body;
  externalBase = external_url;

  await pool.query("DELETE FROM settings");
  await pool.query(
    "INSERT INTO settings(external_url) VALUES($1)",
    [external_url]
  );

  res.sendStatus(200);
});

app.get("/settings", async (req,res)=>{
  const r=await pool.query("SELECT * FROM settings LIMIT 1");
  res.json(r.rows[0] || {});
});

// START
app.listen(3000,"0.0.0.0", async ()=>{
  await init();
  console.log("🚀 Backend running");
});