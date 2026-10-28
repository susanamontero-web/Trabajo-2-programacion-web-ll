# Inventario tecnológico

Aplicación web para registrar, consultar, editar, eliminar y buscar equipos tecnológicos

## Estudiante

Susana Montero Paredes

## Tecnologías

- Vue.js y Vite
- NestJS
- TypeORM
- MySQL
- TypeScript y JavaScript

## Requisitos

- Node.js 24 y npm
- MySQL 8
- Git

## Instalación

instalación del repositorio:
git clone https://github.com/susanamontero-web/Trabajo-2-programacion-web-ll.git
cd Trabajo-2-programacion-web-ll
npm.cmd run install:all

Crear la base de datos en MySQL:

CREATE DATABASE IF NOT EXISTS inventario_tecnologico
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

reemplazar el env.example por el .env y completar lo faltante.

env
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=TU_CONTRASEÑA
DB_DATABASE=inventario_tecnologico
DB_SYNCHRONIZE=true


`DB_SYNCHRONIZE=true` permite crear la tabla automáticamente en desarrollo local


## Ejecución

Desde la carpeta principal abrir dos terminales cmd

Backend:
copiar y pegar esto en la terminal
npm.cmd run dev:backend

Frontend:
copiar y pegar esto en la terminal
npm.cmd run dev:frontend

Abrir http://localhost:5173 en el navegador


Para cargar cinco equipos de ejemplo:
copiar y pegar esto en la terminal
npm.cmd --prefix backend run seed

## Endpoints
|
Para probar en Postman, usar http://localhost:3000/equipos


## Estructura

- `backend/`: API REST, entidad, DTO, servicio y conexión a MySQL.
- `frontend/`: interfaz y comunicación con la API.
- `database/`: script para crear la base de datos.

## Pruebas

Se comprobó el registro, listado, detalle, edición, eliminación y búsqueda desde el navegador, las pruebas automáticas verifican las validaciones, los errores de la API y la persistencia en MySQL después de reiniciar la aplicación, también se uso postman como prueba para ver el funcionamiento de la API.


Para ejecutarlas:
copiar y pegar esto en la terminal
npm.cmd --prefix backend test -- --runInBand
npm.cmd --prefix backend run test:e2e -- --runInBand

Las pruebas de integración requieren MySQL y el archivo `backend/.env` configurado.

## Uso de inteligencia artificial

Se utilizó Codex como apoyo para configurar el proyecto, generar código del backend y frontend, revisar errores y ejecutar pruebas...

