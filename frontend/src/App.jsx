
import {Routes,Route} from "react-router-dom";
import Map from "./Map";
import Machine from "./Machine";
import Admin from "./Admin";

export default function App(){
 return(
  <Routes>
   <Route path="/" element={<Map/>}/>
   <Route path="/machine/:id" element={<Machine/>}/>
   <Route path="/admin" element={<Admin/>}/>
  </Routes>
 );
}
