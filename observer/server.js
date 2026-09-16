const express = require("express");

const app = express();

app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Observer de ImageFlow funcionando correctamente");
});

app.post("/evento", (req, res) => {
  const evento = req.body;

  console.log("EVENTO RECIBIDO:");
  console.log(`Worker: ${evento.worker}`);
  console.log(`Mensaje: ${evento.mensaje}`);
  console.log(`Fecha: ${new Date().toLocaleString()}`);
  console.log("-----------------------------");

  res.json({
    estado: "Evento registrado correctamente"
  });
});

app.listen(PORT, () => {
  console.log(`Observer ejecutándose en http://localhost:${PORT}`);
});