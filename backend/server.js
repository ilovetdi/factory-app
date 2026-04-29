const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const jwt=require("jsonwebtoken");

const app=express();
app.use(cors());
app.use(express.json());

const pool=new Pool({
 host:process.env.DB_HOST,
 user:process.env.DB_USER,
 password:process.env.DB_PASSWORD,
 database:process.env.DB_NAME
});

const SECRET="secret";

app.post("/login",async(req,res)=>{
 const {username,password}=req.body;
 if(username==="admin"&&password==="admin"){
  res.json({token:jwt.sign({username},SECRET)});
 }else res.sendStatus(401);
});

app.listen(3000,"0.0.0.0",()=>console.log("backend ok"));
