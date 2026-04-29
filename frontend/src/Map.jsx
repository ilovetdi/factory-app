import React,{useEffect,useState} from "react";
import Draggable from "react-draggable";

export default function Map({token}){
 const [machines,setMachines]=useState([]);
 const [layout,setLayout]=useState("");

 const headers={Authorization:token};

 const load = async () => {
  try {
    const m = await fetch("/api/machines",{headers}).then(r=>r.json());
    setMachines(m || []);

    const l = await fetch("/api/layout",{headers}).then(r=>r.json());
    setLayout(l.layout || "");
  } catch(e){
    console.log("error", e);
  }
 };

 useEffect(()=>{
  load();
 },[]);

 const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

 if(isMobile){
  return(
    <div style={{padding:20}}>
      <h2>Gépek</h2>
      {machines && machines.map(m=>(
        <div key={m.id} style={{
          padding:15,
          border:"1px solid #333",
          marginBottom:10
        }}>
          {m.name}
        </div>
      ))}
    </div>
  );
 }

 return(
  <div style={{position:"relative"}}>
    {layout ? (
      <img src={"/api"+layout} style={{width:"100%"}}/>
    ) : (
      <div style={{
        padding:40,
        textAlign:"center",
        color:"#888"
      }}>
        ⚠️ Nincs layout feltöltve
      </div>
    )}

    {machines && machines.map(m=>(
      <Draggable key={m.id} defaultPosition={{x:m.x,y:m.y}}>
        <div style={{
          position:"absolute",
          background:"#ff9800",
          padding:10,
          cursor:"pointer"
        }}>
          ⚙
        </div>
      </Draggable>
    ))}
  </div>
 );
}