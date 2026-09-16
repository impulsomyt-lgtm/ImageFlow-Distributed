const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Servir la interfaz web
app.use(
  express.static(
    path.join(__dirname, "..", "client")
  )
);

// Permitir visualizar las imágenes
app.use(
  "/images",
  express.static(
    path.join(__dirname, "..", "images")
  )
);

// Enviar solicitudes al Coordinator
app.get("/procesar", async (req, res) => {
  try {

    const respuesta = await fetch(
      "http://localhost:3001/procesar"
    );

    const texto = await respuesta.text();

    res.send(
      `Gateway recibió: ${texto}`
    );

  } catch (error) {

    res.status(500).send(
      "No fue posible comunicarse con el Coordinator"
    );

  }
});

app.listen(PORT, () => {
  console.log(
    `Gateway ejecutándose en http://localhost:${PORT}`
  );
});