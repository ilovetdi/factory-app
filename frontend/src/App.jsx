
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

export default function App() {
  const [machines, setMachines] = useState([]);

  const load = async () => {
    const res = await fetch("/api/machines");
    const data = await res.json();
    setMachines(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await fetch("/api/machines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Machine",
        x: 100,
        y: 100,
        status: "green"
      })
    });
    load();
  };

  const update = async (id, x, y) => {
    await fetch("/api/machines/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ x, y })
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏭 Industrial Panel</h1>
      <button onClick={add}>+ Machine</button>

      <div style={{
        position: "relative",
        height: "80vh",
        border: "2px solid #ccc",
        marginTop: 20
      }}>
        {machines.map(m => (
          <Draggable
            key={m.id}
            defaultPosition={{ x: m.x, y: m.y }}
            onStop={(e, d) => update(m.id, d.x, d.y)}
          >
            <div style={{
              position: "absolute",
              width: 100,
              height: 60,
              background: "green",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {m.name}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
