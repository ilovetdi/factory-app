
const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const multer=require("multer");

const app=express();
app.use(cors());
app.use(express.json());

const upload=multer({dest:"uploads/"});
app.use("/uploads",express.static("uploads"));

const pool=new Pool({
 host:process.env.DB_HOST,
 user:process.env.DB_USER,
 password:process.env.DB_PASSWORD,
 database:process.env.DB_NAME
});

async function waitDB(){
 while(true){
  try{await pool.query("SELECT 1");break;}
  catch{await new Promise(r=>setTimeout(r,2000));}
 }
}

async function init(){
 await waitDB();

 await pool.query(`CREATE TABLE IF NOT EXISTS machines(
  id SERIAL PRIMARY KEY,
  name TEXT,
  x INT,
  y INT
 );`);

 await pool.query(`CREATE TABLE IF NOT EXISTS logs(
  id SERIAL PRIMARY KEY,
  machine_id INT,
  text TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );`);

 await pool.query(`CREATE TABLE IF NOT EXISTS settings(
  id SERIAL PRIMARY KEY,
  layout TEXT
 );`);
}

// machines
app.get("/machines",async(req,res)=>{
 const r=await pool.query("SELECT * FROM machines");
 res.json(r.rows);
});

app.post("/machines",async(req,res)=>{
 const {name,x,y}=req.body;
 await pool.query("INSERT INTO machines(name,x,y) VALUES($1,$2,$3)",[name,x,y]);
 res.sendStatus(200);
});

// layout upload
app.post("/layout",upload.single("file"),async(req,res)=>{
 const path=req.file.path;
 await pool.query("DELETE FROM settings");
 await pool.query("INSERT INTO settings(layout) VALUES($1)",["/"+path]);
 res.json({path:"/"+path});
});

app.get("/layout",async(req,res)=>{
 const r=await pool.query("SELECT * FROM settings LIMIT 1");
 res.json(r.rows[0]||{});
});

// logs
app.post("/logs",async(req,res)=>{
 const {machine_id,text,image}=req.body;
 await pool.query("INSERT INTO logs(machine_id,text,image) VALUES($1,$2,$3)",[machine_id,text,image]);
 res.sendStatus(200);
});

app.get("/logs/:id",async(req,res)=>{
 const r=await pool.query("SELECT * FROM logs WHERE machine_id=$1 ORDER BY created_at DESC",[req.params.id]);
 res.json(r.rows);
});

app.listen(3000,"0.0.0.0",async()=>{await init();});
