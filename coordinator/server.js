const express = require("express");

const app = express();

const PORT = 3001;

const workers = [
  "http://localhost:4001",
  "http://localhost:4002",
  "http://localhost:4003"
];

let siguienteWorker = 0;

app.get("/", (req, res) => {
  res.send("Coordinator de ImageFlow funcionando correctamente");
});

app.get("/procesar", async (req, res) => {

  let intentos = 0;

  while (intentos < workers.length) {

    const indiceActual = siguienteWorker;
    const workerSeleccionado = workers[indiceActual];

    siguienteWorker = (siguienteWorker + 1) % workers.length;

    try {

      const respuesta = await fetch(
        `${workerSeleccionado}/procesar-imagen`
      );

      if (!respuesta.ok) {
        throw new Error("Worker no disponible");
      }

      const texto = await respuesta.text();

      // Avisar al Observer sin afectar el procesamiento
      try {
        await fetch("http://localhost:5000/evento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            worker: workerSeleccionado,
            mensaje: texto
          })
        });
      } catch (error) {
        console.log("Observer no disponible");
      }

      return res.send(
        `Tarea procesada por ${workerSeleccionado} - ${texto}`
      );

    } catch (error) {

      console.log(
        `Worker no disponible: ${workerSeleccionado}`
      );

      intentos++;
    }
  }

  res.status(503).send(
    "No hay Workers disponibles para procesar la tarea"
  );
});

app.listen(PORT, () => {
  console.log(`Coordinator ejecutándose en http://localhost:${PORT}`);
});