const TOTAL_SOLICITUDES = 100;

async function ejecutarPrueba() {
  console.log(`Iniciando prueba con ${TOTAL_SOLICITUDES} solicitudes simultáneas...`);

  const inicio = Date.now();

  const tareas = [];

  for (let i = 1; i <= TOTAL_SOLICITUDES; i++) {
    tareas.push(
      fetch("http://localhost:3000/procesar")
        .then(async (respuesta) => {
          const texto = await respuesta.text();

          return {
            numero: i,
            estado: respuesta.status,
            respuesta: texto
          };
        })
        .catch((error) => {
          return {
            numero: i,
            estado: "ERROR",
            respuesta: error.message
          };
        })
    );
  }

  const resultados = await Promise.all(tareas);

  const fin = Date.now();

  console.log("\nRESULTADOS:");
  console.log("-----------------------------");

  resultados.forEach((resultado) => {
    console.log(
      `Solicitud ${resultado.numero} | Estado: ${resultado.estado}`
    );
  });

  console.log("-----------------------------");
  console.log(`Tiempo total: ${fin - inicio} ms`);
  console.log(`Solicitudes procesadas: ${resultados.length}`);
}

ejecutarPrueba();