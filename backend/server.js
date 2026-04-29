
const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const multer=require("multer");
const jwt=require("jsonwebtoken");

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

const SECRET=process.env.JWT_SECRET;

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

 await pool.query(`CREATE TABLE IF NOT EXISTS settings(
  id SERIAL PRIMARY KEY,
  layout TEXT
 );`);

 await pool.query(`CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT
 );`);

 await pool.query(`INSERT INTO users(username,password)
 SELECT 'admin','admin'
 WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');`);
}

function auth(req,res,next){
 const t=req.headers.authorization;
 if(!t) return res.sendStatus(401);
 try{req.user=jwt.verify(t,SECRET);next();}
 catch{res.sendStatus(401);}
}

app.post("/login",async(req,res)=>{
 const {username,password}=req.body;
 const r=await pool.query("SELECT * FROM users WHERE username=$1 AND password=$2",[username,password]);
 if(!r.rows.length) return res.sendStatus(401);
 res.json({token:jwt.sign({username},SECRET,{expiresIn:"8h"})});
});

app.post("/layout",auth,upload.single("file"),async(req,res)=>{
 await pool.query("DELETE FROM settings");
 await pool.query("INSERT INTO settings(layout) VALUES($1)",["/"+req.file.path]);
 res.sendStatus(200);
});

app.get("/layout",auth,async(req,res)=>{
 const r=await pool.query("SELECT * FROM settings LIMIT 1");
 res.json(r.rows[0]||{});
});

app.get("/machines",auth,async(req,res)=>{
 const r=await pool.query("SELECT * FROM machines");
 res.json(r.rows);
});

app.post("/machines",auth,async(req,res)=>{
 const {name,x,y}=req.body;
 await pool.query("INSERT INTO machines(name,x,y) VALUES($1,$2,$3)",[name,x,y]);
 res.sendStatus(200);
});

app.listen(3000,"0.0.0.0",async()=>{await init();});
