
import React, { useState } from "react";
import Draggable from "react-draggable";

export default function App() {
  const [machines, setMachines] = useState([]);

  const add = () => {
    setMachines([...machines, { id: Date.now(), x: 100, y: 100 }]);
  };

  return (
    <div>
      <h1>Factory Panel</h1>
      <button onClick={add}>+ Machine</button>

      {machines.map(m => (
        <Draggable key={m.id} defaultPosition={{ x: m.x, y: m.y }}>
          <div style={{ width: 60, height: 60, background: "orange", position: "absolute" }}>
            ⚙
          </div>
        </Draggable>
      ))}
    </div>
  );
}
