
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

async function waitDB(){
  while(true){
    try{
      await pool.query("SELECT 1");
      break;
    }catch{
      console.log("DB waiting...");
      await new Promise(r=>setTimeout(r,2000));
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS machines(
      id SERIAL PRIMARY KEY,
      name TEXT,
      x INT,
      y INT
    );
  `);
}

app.get("/",(req,res)=>res.send("OK"));

app.get("/machines", async(req,res)=>{
  const r = await pool.query("SELECT * FROM machines");
  res.json(r.rows);
});

app.post("/machines", async(req,res)=>{
  const {name,x,y} = req.body;
  await pool.query("INSERT INTO machines(name,x,y) VALUES($1,$2,$3)",[name,x,y]);
  res.sendStatus(200);
});

app.listen(3000, async()=>{
  await waitDB();
  console.log("Backend ready");
});
