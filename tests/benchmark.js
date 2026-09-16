const CARGA = 100;
const REPETICIONES = 5;

async function ejecutarRonda(numeroRonda) {
  const inicio = Date.now();

  const tareas = [];

  for (let i = 0; i < CARGA; i++) {
    tareas.push(
      fetch("http://localhost:3000/procesar")
        .then((respuesta) => respuesta.status)
        .catch(() => "ERROR")
    );
  }

  const resultados = await Promise.all(tareas);

  const fin = Date.now();
  const tiempo = fin - inicio;

  const exitosas = resultados.filter(
    (estado) => estado === 200
  ).length;

  const errores = resultados.length - exitosas;

  console.log(
    `Ronda ${numeroRonda}: ${tiempo} ms | Exitosas: ${exitosas} | Errores: ${errores}`
  );

  return {
    tiempo,
    exitosas,
    errores
  };
}

async function ejecutarBenchmark() {
  console.log("");
  console.log("======================================");
  console.log("      BENCHMARK IMAGEFLOW");
  console.log("======================================");
  console.log(`Carga: ${CARGA} solicitudes simultáneas`);
  console.log(`Repeticiones: ${REPETICIONES}`);
  console.log("--------------------------------------");

  const resultados = [];

  for (let i = 1; i <= REPETICIONES; i++) {
    const resultado = await ejecutarRonda(i);
    resultados.push(resultado);
  }

  const tiempos = resultados.map(
    (resultado) => resultado.tiempo
  );

  const promedio =
    tiempos.reduce((suma, tiempo) => suma + tiempo, 0) /
    tiempos.length;

  const minimo = Math.min(...tiempos);
  const maximo = Math.max(...tiempos);

  const totalExitosas = resultados.reduce(
    (suma, resultado) => suma + resultado.exitosas,
    0
  );

  const totalErrores = resultados.reduce(
    (suma, resultado) => suma + resultado.errores,
    0
  );

  const throughput = CARGA / (promedio / 1000);

  console.log("--------------------------------------");
  console.log("RESULTADO FINAL");
  console.log("--------------------------------------");
  console.log(`Tiempo promedio: ${promedio.toFixed(2)} ms`);
  console.log(`Tiempo mínimo: ${minimo} ms`);
  console.log(`Tiempo máximo: ${maximo} ms`);
  console.log(`Solicitudes exitosas: ${totalExitosas}`);
  console.log(`Errores: ${totalErrores}`);
  console.log(
    `Throughput aproximado: ${throughput.toFixed(2)} solicitudes/s`
  );
  console.log("======================================");
}

ejecutarBenchmark();