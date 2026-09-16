# ImageFlow Distributed

Sistema distribuido para el procesamiento concurrente de imágenes, desarrollado como mini proyecto para la asignatura Arquitectura de Software.

## Descripción

ImageFlow Distributed permite procesar imágenes mediante una arquitectura distribuida compuesta por varios nodos independientes.

El usuario realiza una solicitud desde una interfaz web. La petición pasa por un Gateway, luego es enviada a un Coordinator, que selecciona uno de los Workers disponibles mediante una estrategia Round Robin.

Cada Worker procesa la imagen y la convierte a escala de grises. Posteriormente, el sistema registra el evento mediante un componente Observer.

## Arquitectura

La arquitectura general del sistema es:

Cliente Web  
↓  
Gateway  
↓  
Coordinator  
↓  
Worker 1 / Worker 2 / Worker 3  
↓  
Observer

## Componentes

### Gateway

Actúa como punto único de entrada al sistema y aplica el patrón Proxy.

Puerto:

```text
3000