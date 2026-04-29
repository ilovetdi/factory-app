
const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const multer=require("multer");
const jwt=require("jsonwebtoken");

const app=express();
app.use(cors());
app.use(express.json());

const SECRET="secret";

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

 await pool.query(`CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT
 );`);

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
  username TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );`);

 await pool.query(`CREATE TABLE IF NOT EXISTS settings(
  id SERIAL PRIMARY KEY,
  layout TEXT
 );`);

 await pool.query(`ALTER TABLE settings ADD COLUMN IF NOT EXISTS layout TEXT;`);

 await pool.query(`
 INSERT INTO users(username,password)
 SELECT 'admin','admin'
 WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');
 `);
}

// auth middleware
function auth(req,res,next){
 const token=req.headers.authorization;
 if(!token) return res.sendStatus(401);
 try{
  req.user=jwt.verify(token,SECRET);
  next();
 }catch{res.sendStatus(401);}
}

// login
app.post("/login",async(req,res)=>{
 const {username,password}=req.body;
 const r=await pool.query("SELECT * FROM users WHERE username=$1 AND password=$2",[username,password]);
 if(!r.rows.length) return res.sendStatus(401);

 const token=jwt.sign({username},SECRET,{expiresIn:"8h"});
 res.json({token,username});
});

// layout
app.post("/layout",upload.single("file"),auth,async(req,res)=>{
 const p=req.file.path;
 await pool.query("DELETE FROM settings");
 await pool.query("INSERT INTO settings(layout) VALUES($1)",["/"+p]);
 res.json({path:"/"+p});
});

app.get("/layout",auth,async(req,res)=>{
 const r=await pool.query("SELECT * FROM settings LIMIT 1");
 res.json(r.rows[0]||{});
});

// machines
app.get("/machines",auth,async(req,res)=>{
 const r=await pool.query("SELECT * FROM machines ORDER BY name ASC");
 res.json(r.rows);
});

app.post("/machines",auth,async(req,res)=>{
 const {name,x,y}=req.body;
 await pool.query("INSERT INTO machines(name,x,y) VALUES($1,$2,$3)",[name,x,y]);
 res.sendStatus(200);
});

app.put("/machines/:id",auth,async(req,res)=>{
 const {x,y}=req.body;
 await pool.query("UPDATE machines SET x=$1,y=$2 WHERE id=$3",[x,y,req.params.id]);
 res.sendStatus(200);
});

// upload
app.post("/upload",auth,upload.single("file"),(req,res)=>{
 res.json({path:"/"+req.file.path});
});

// logs
app.get("/logs/:id",auth,async(req,res)=>{
 const r=await pool.query("SELECT * FROM logs WHERE machine_id=$1 ORDER BY created_at DESC",[req.params.id]);
 res.json(r.rows);
});

app.post("/logs",auth,async(req,res)=>{
 const {machine_id,text,image}=req.body;
 await pool.query(
  "INSERT INTO logs(machine_id,text,image,username) VALUES($1,$2,$3,$4)",
  [machine_id,text,image,req.user.username]
 );
 res.sendStatus(200);
});

app.put("/logs/:id",auth,async(req,res)=>{
 await pool.query("UPDATE logs SET text=$1 WHERE id=$2",[req.body.text,req.params.id]);
 res.sendStatus(200);
});

app.delete("/logs/:id",auth,async(req,res)=>{
 await pool.query("DELETE FROM logs WHERE id=$1",[req.params.id]);
 res.sendStatus(200);
});

app.listen(3000,"0.0.0.0",async()=>{await init();});
