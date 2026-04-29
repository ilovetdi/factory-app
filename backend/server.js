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

async function init(){
 await pool.query(`CREATE TABLE IF NOT EXISTS machines(id SERIAL PRIMARY KEY,name TEXT,x INT,y INT)`);
 await pool.query(`CREATE TABLE IF NOT EXISTS logs(id SERIAL PRIMARY KEY,machine_id INT,text TEXT,image TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
 await pool.query(`CREATE TABLE IF NOT EXISTS settings(id SERIAL PRIMARY KEY,layout TEXT)`);
}

function auth(req,res,next){
 const t=req.headers.authorization;
 if(!t) return res.sendStatus(401);
 try{jwt.verify(t,SECRET);next();}catch{res.sendStatus(401);}
}

app.post("/login",(req,res)=>{
 const {username,password}=req.body;
 if(username==="admin"&&password==="admin"){
  res.json({token:jwt.sign({username},SECRET,{expiresIn:"8h"})});
 } else res.sendStatus(401);
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

app.get("/logs/:id",auth,async(req,res)=>{
 const r=await pool.query("SELECT * FROM logs WHERE machine_id=$1 ORDER BY created_at DESC",[req.params.id]);
 res.json(r.rows);
});

app.post("/upload",auth,upload.single("file"),(req,res)=>{
 res.json({path:"/"+req.file.path});
});

app.post("/logs",auth,async(req,res)=>{
 const {machine_id,text,image}=req.body;
 await pool.query("INSERT INTO logs(machine_id,text,image) VALUES($1,$2,$3)",[machine_id,text,image]);
 res.sendStatus(200);
});

app.listen(3000,"0.0.0.0",init);
