const express = require("express");
const sharp = require("sharp");
const path = require("path");

const app = express();

const PORT = 4001;

app.get("/", (req, res) => {
  res.send("Worker 1 de ImageFlow funcionando correctamente");
});

app.get("/procesar-imagen", async (req, res) => {
  try {
    const imagenEntrada = path.join(
      __dirname,
      "..",
      "images",
      "prueba.jpg"
    );

    const imagenSalida = path.join(
      __dirname,
      "..",
      "images",
      "procesada-worker1.jpg"
    );

    await sharp(imagenEntrada)
      .grayscale()
      .toFile(imagenSalida);

    res.send(
      "Worker 1 procesó la imagen correctamente en escala de grises"
    );

  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Error al procesar la imagen"
    );
  }
});

app.listen(PORT, () => {
  console.log(`Worker 1 ejecutándose en http://localhost:${PORT}`);
});