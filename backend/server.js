
const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const multer=require("multer");

const app=express();
app.use(cors());
app.use(express.json());

const upload=multer({dest:"uploads/logs/"});
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

 await pool.query(`CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username TEXT,
  role TEXT
 );`);

 await pool.query(`CREATE TABLE IF NOT EXISTS logs(
  id SERIAL PRIMARY KEY,
  machine_id INT,
  text TEXT,
  image TEXT,
  username TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );`);

 await pool.query(`ALTER TABLE logs ADD COLUMN IF NOT EXISTS image TEXT;`);
 await pool.query(`ALTER TABLE logs ADD COLUMN IF NOT EXISTS username TEXT;`);

 await pool.query(`
  INSERT INTO users(username,role)
  SELECT 'admin','admin'
  WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');
 `);
}

// upload
app.post("/upload",upload.single("file"),(req,res)=>{
 res.json({path:"/"+req.file.path});
});

// logs
app.get("/logs/:id",async(req,res)=>{
 const r=await pool.query("SELECT * FROM logs WHERE machine_id=$1 ORDER BY created_at DESC",[req.params.id]);
 res.json(r.rows);
});

app.post("/logs",async(req,res)=>{
 const {machine_id,text,image,username}=req.body;
 await pool.query("INSERT INTO logs(machine_id,text,image,username) VALUES($1,$2,$3,$4)",[machine_id,text,image,username]);
 res.sendStatus(200);
});

app.put("/logs/:id",async(req,res)=>{
 const {text}=req.body;
 await pool.query("UPDATE logs SET text=$1 WHERE id=$2",[text,req.params.id]);
 res.sendStatus(200);
});

app.delete("/logs/:id",async(req,res)=>{
 await pool.query("DELETE FROM logs WHERE id=$1",[req.params.id]);
 res.sendStatus(200);
});

app.listen(3000,"0.0.0.0",async()=>{await init();});
