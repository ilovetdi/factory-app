
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

const API = "http://192.168.88.30:3000";

export default function App() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch(API + "/machines");
    const data = await res.json();
    setMachines(data);
  };

  const add = async () => {
    await fetch(API + "/machines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    await fetch(API + "/machines/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y })
    });
  };

  return (
    <div style={{ padding: 20, background: "#1e1e1e", color: "white", minHeight: "100vh" }}>
      <h1>🏭 Industrial Panel</h1>
      <button onClick={add}>+ Machine</button>

      <div style={{
        position: "relative",
        height: "80vh",
        border: "2px solid #555",
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
              background: m.status === "green" ? "#2ecc71" : "#e67e22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              cursor: "pointer"
            }}>
              {m.name}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
