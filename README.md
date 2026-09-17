# ImageFlow Distributed

Sistema distribuido para el procesamiento concurrente de imágenes, desarrollado como mini proyecto para la asignatura **Arquitectura de Software**.

## Descripción

ImageFlow Distributed es un prototipo de arquitectura distribuida que permite procesar imágenes mediante varios nodos de trabajo independientes.

El usuario realiza una solicitud desde una interfaz web. La petición ingresa al sistema a través de un **Gateway**, posteriormente es enviada al **Coordinator**, que selecciona uno de los Workers disponibles mediante una estrategia de distribución **Round Robin**.

Cada Worker procesa la imagen utilizando la librería **Sharp** y genera una versión en escala de grises. Posteriormente, el sistema registra el evento mediante un componente **Observer**.

La solución fue inicialmente desarrollada y evaluada en un entorno local y posteriormente desplegada en una instancia **Amazon EC2**, donde los diferentes componentes se ejecutan como procesos independientes administrados mediante **PM2**.

---

## Aplicación desplegada

ImageFlow Distributed se encuentra desplegado en una instancia de **Amazon EC2 con Amazon Linux 2023**.

### Aplicación web

http://18.225.179.212

### Repositorio

https://github.com/impulsomyt-lgtm/ImageFlow-Distributed

---

## Arquitectura

La arquitectura general del sistema es:

```text
Cliente Web
    ↓
Nginx
    ↓
Gateway
    ↓
Coordinator
    ↓
┌──────────┬──────────┬──────────┐
│ Worker 1 │ Worker 2 │ Worker 3 │
└──────────┴──────────┴──────────┘
    ↓
Procesamiento con Sharp
    ↓
Observer
```

En el despliegue cloud, Nginx funciona como punto de entrada público y redirige las solicitudes hacia el Gateway.

```text
Internet
    ↓
Nginx :80
    ↓
Gateway :3000
    ↓
Coordinator :3001
    ↓
Worker 1 :4001
Worker 2 :4002
Worker 3 :4003
    ↓
Observer :5000
```

---

## Componentes

### Cliente Web

Interfaz desarrollada con HTML, CSS y JavaScript desde la cual el usuario puede iniciar el procesamiento de una imagen y visualizar:

- Imagen original.
- Imagen procesada en escala de grises.
- Nodo Worker responsable del procesamiento.
- Estado de la operación.

---

### Gateway

Actúa como punto único de entrada hacia la arquitectura interna y aplica el patrón **Proxy**.

Puerto interno:

```text
3000
```

Sus principales responsabilidades son:

- Servir la interfaz web.
- Recibir las solicitudes del cliente.
- Ocultar la estructura interna del sistema.
- Redirigir las solicitudes al Coordinator.
- Devolver el resultado al cliente.

---

### Coordinator

Se encarga de coordinar la comunicación entre los diferentes componentes y aplica el patrón **Mediator**.

Puerto interno:

```text
3001
```

Sus funciones principales son:

- Recibir las tareas enviadas por el Gateway.
- Seleccionar un Worker.
- Distribuir las solicitudes mediante Round Robin.
- Detectar Workers no disponibles.
- Redirigir una tarea hacia otro Worker cuando ocurre un fallo.
- Informar al Observer después del procesamiento.

---

### Worker 1

Nodo encargado del procesamiento de imágenes.

Puerto interno:

```text
4001
```

Utiliza la librería Sharp para convertir imágenes a escala de grises.

---

### Worker 2

Segundo nodo independiente de procesamiento.

Puerto interno:

```text
4002
```

Realiza las mismas operaciones que Worker 1 y puede ser retirado temporalmente del sistema sin detener el funcionamiento general.

---

### Worker 3

Tercer nodo independiente de procesamiento.

Puerto interno:

```text
4003
```

Participa en la distribución de tareas realizada por el Coordinator.

---

### Observer

Componente encargado de registrar los eventos generados por el procesamiento y aplica el patrón **Observer**.

Puerto interno:

```text
5000
```

Registra información como:

- Worker utilizado.
- Resultado de la operación.
- Fecha y hora del evento.

---

## Patrones de diseño implementados

### Proxy

El Gateway funciona como Proxy entre el cliente y los servicios internos.

El cliente no necesita conocer directamente las direcciones de los Workers ni del Coordinator.

### Mediator

El Coordinator implementa el patrón Mediator porque centraliza y coordina la comunicación entre los diferentes nodos.

Esto evita que el Gateway tenga que comunicarse directamente con cada Worker.

### Observer

El Observer recibe eventos relacionados con el procesamiento de las imágenes y registra la actividad realizada por los diferentes Workers.

---

## Balanceo de carga

El Coordinator utiliza una estrategia **Round Robin** para distribuir las tareas.

Ejemplo:

```text
Solicitud 1 → Worker 1
Solicitud 2 → Worker 2
Solicitud 3 → Worker 3
Solicitud 4 → Worker 1
Solicitud 5 → Worker 2
Solicitud 6 → Worker 3
```

Esta estrategia distribuye las solicitudes entre los nodos disponibles.

---

## Tolerancia a fallos

El sistema incorpora un mecanismo básico de tolerancia a fallos.

Si uno de los Workers no está disponible, el Coordinator detecta el error y continúa intentando procesar la tarea utilizando otro nodo disponible.

Ejemplo:

```text
Worker 1 → ONLINE
Worker 2 → OFFLINE
Worker 3 → ONLINE
```

En este escenario, el sistema continúa procesando solicitudes utilizando Worker 1 y Worker 3.

Cuando Worker 2 vuelve a estar disponible, se reincorpora nuevamente al conjunto de nodos utilizados para el procesamiento.

Esta funcionalidad fue comprobada tanto en el entorno local como en el despliegue realizado en AWS EC2.

---

## Procesamiento de imágenes

El procesamiento se realiza mediante la librería **Sharp**.

La operación implementada en el prototipo consiste en transformar una imagen a escala de grises.

Flujo:

```text
Imagen original
      ↓
Worker seleccionado
      ↓
Sharp
      ↓
Conversión a escala de grises
      ↓
Imagen procesada
```

---

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- HTML5
- CSS3
- Sharp
- PlantUML
- Git
- GitHub
- Amazon EC2
- Amazon Linux 2023
- Nginx
- PM2

---

## Modelado UML

El proyecto incluye los siguientes diagramas UML:

### Diagrama de componentes

Representa los módulos principales del sistema y las relaciones entre:

- Cliente Web.
- Gateway.
- Coordinator.
- Workers.
- Observer.
- Sharp.
- Sistema de archivos.

### Diagrama de secuencia

Representa el flujo completo de procesamiento:

```text
Usuario
↓
Cliente Web
↓
Gateway
↓
Coordinator
↓
Worker seleccionado
↓
Sharp
↓
Observer
↓
Resultado al usuario
```

### Diagrama de despliegue

Representa la infraestructura real utilizada para publicar ImageFlow Distributed en AWS:

```text
Internet
↓
Amazon EC2
↓
Nginx
↓
Gateway
↓
Coordinator
↓
Workers
↓
Observer
```

Los procesos Node.js son administrados mediante PM2.

Los archivos PlantUML se encuentran en:

```text
docs/uml
```

---

## Pruebas de concurrencia y escalabilidad

Se realizaron pruebas de carga con diferentes cantidades de solicitudes simultáneas.

Cada escenario principal fue ejecutado cinco veces para obtener resultados más representativos.

| Solicitudes simultáneas | Tiempo promedio | Tiempo mínimo | Tiempo máximo | Errores | Throughput aproximado |
|---:|---:|---:|---:|---:|---:|
| 10 | 86.20 ms | 71 ms | 139 ms | 0 | 116.01 solicitudes/s |
| 50 | 358.40 ms | 311 ms | 461 ms | 0 | 139.51 solicitudes/s |
| 100 | 683.80 ms | 627 ms | 793 ms | 0 | 146.24 solicitudes/s |

En las tres configuraciones se procesó el 100 % de las solicitudes sin errores.

---

## Prueba de robustez

Se realizó una prueba adicional con:

```text
100 solicitudes simultáneas
5 repeticiones
Worker 2 fuera de servicio
```

Resultados:

```text
Tiempo promedio: 658.00 ms
Tiempo mínimo: 574 ms
Tiempo máximo: 813 ms
Solicitudes exitosas: 500
Errores: 0
Throughput aproximado: 151.98 solicitudes/s
```

Durante la prueba, el Coordinator detectó que Worker 2 no estaba disponible y continuó procesando las solicitudes mediante Worker 1 y Worker 3.

La prueba evidencia que la caída de un nodo de procesamiento no provoca la interrupción completa del servicio.

Las diferencias de tiempo entre las ejecuciones con dos y tres Workers pueden estar asociadas con variaciones normales de ejecución, carga del sistema, caché y operaciones de entrada/salida; por tanto, no se interpretan como evidencia de que una configuración con menos Workers sea más rápida.

---

## Despliegue en AWS EC2

La aplicación fue desplegada en una instancia **Amazon EC2** utilizando **Amazon Linux 2023**.

### Arquitectura de despliegue

```text
Internet
    ↓
Puerto 80
    ↓
Nginx
    ↓
Gateway :3000
    ↓
Coordinator :3001
    ↓
┌─────────────────────────────┐
│ Worker 1 :4001              │
│ Worker 2 :4002              │
│ Worker 3 :4003              │
└─────────────────────────────┘
    ↓
Observer :5000
```

### Nginx

Nginx funciona como **reverse proxy**.

Es el único componente expuesto públicamente mediante el puerto:

```text
80
```

Nginx redirige internamente las solicitudes hacia:

```text
localhost:3000
```

donde se encuentra el Gateway.

Los puertos internos de los demás componentes no se exponen directamente a Internet.

---

## Administración de procesos con PM2

Los seis servicios Node.js se encuentran administrados mediante PM2:

```text
gateway
coordinator
observer
worker1
worker2
worker3
```

Esto permite:

- Mantener los procesos activos.
- Reiniciar servicios individualmente.
- Recuperar procesos después de un reinicio.
- Consultar el estado de cada componente.
- Facilitar las pruebas de tolerancia a fallos.

Ejemplo:

```bash
pm2 status
```

Detener un Worker:

```bash
pm2 stop worker2
```

Recuperarlo:

```bash
pm2 start worker2
```

Guardar la configuración:

```bash
pm2 save
```

---

## Seguridad del despliegue

En el Security Group de AWS se habilitó el acceso HTTP mediante:

```text
Puerto 80
```

Los servicios internos:

```text
3000
3001
4001
4002
4003
5000
```

no necesitan estar expuestos directamente a Internet.

La comunicación entre estos componentes ocurre internamente dentro de la instancia EC2.

---

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/impulsomyt-lgtm/ImageFlow-Distributed.git
```

Ingresar al proyecto:

```bash
cd ImageFlow-Distributed
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución local

Gateway:

```bash
node gateway/server.js
```

Coordinator:

```bash
node coordinator/server.js
```

Worker 1:

```bash
node worker1/server.js
```

Worker 2:

```bash
node worker2/server.js
```

Worker 3:

```bash
node worker3/server.js
```

Observer:

```bash
node observer/server.js
```

Abrir en el navegador:

```text
http://localhost:3000
```

---

## Pruebas

### Prueba de carga

```bash
node tests/load-test.js
```

### Benchmark

```bash
node tests/benchmark.js
```

El benchmark permite medir:

- Tiempo promedio.
- Tiempo mínimo.
- Tiempo máximo.
- Solicitudes exitosas.
- Errores.
- Throughput aproximado.

---

## Estructura del proyecto

```text
ImageFlow-Distributed
│
├── client
│   └── index.html
│
├── coordinator
│   └── server.js
│
├── gateway
│   └── server.js
│
├── images
│
├── observer
│   └── server.js
│
├── tests
│   ├── benchmark.js
│   └── load-test.js
│
├── worker1
│   └── server.js
│
├── worker2
│   └── server.js
│
├── worker3
│   └── server.js
│
├── docs
│   └── uml
│
├── README.md
├── package.json
└── package-lock.json
```

---

## Resultados principales

El prototipo permitió verificar:

- Comunicación entre componentes distribuidos.
- Procesamiento de imágenes mediante múltiples nodos.
- Distribución de carga entre tres Workers.
- Implementación de Proxy, Mediator y Observer.
- Procesamiento concurrente de solicitudes.
- Escalabilidad frente a diferentes niveles de carga.
- Detección de Workers no disponibles.
- Continuidad del servicio ante el fallo de un nodo.
- Recuperación de nodos.
- Despliegue funcional en infraestructura cloud mediante AWS EC2.
- Administración persistente de procesos mediante PM2.
- Acceso público mediante Nginx.

---

## Autor

Proyecto desarrollado para la asignatura **Arquitectura de Software**.

## Licencia

Proyecto académico desarrollado con fines educativos.