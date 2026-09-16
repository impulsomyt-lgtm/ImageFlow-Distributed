const express = require("express");
const sharp = require("sharp");
const path = require("path");

const app = express();

const PORT = 4003;

app.get("/", (req, res) => {
  res.send("Worker 3 de ImageFlow funcionando correctamente");
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
      "procesada-worker3.jpg"
    );

    await sharp(imagenEntrada)
      .grayscale()
      .toFile(imagenSalida);

    res.send(
      "Worker 3 procesó la imagen correctamente en escala de grises"
    );

  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Error al procesar la imagen"
    );
  }
});

app.listen(PORT, () => {
  console.log(`Worker 3 ejecutándose en http://localhost:${PORT}`);
});