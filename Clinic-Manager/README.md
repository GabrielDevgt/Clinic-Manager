# Clinic-Manager

[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/angular-19.2.0-red)](https://angular.io/)
[![Tauri](https://img.shields.io/badge/tauri-2.5.0-blue)](https://tauri.app/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Descripción

Clinic-Manager es una aplicación de escritorio multiplataforma para gestión clínica, desarrollada con Angular en el frontend y Tauri para empaquetar la aplicación nativa, logrando un excelente rendimiento y bajo consumo de recursos.

---

## Requisitos



Node.js (preferiblemente versión LTS)
npm
Rust (incluyendo Cargo)
Angular CLI

---

## Instalación

```bash
git clone <url-del-repositorio>
cd Clinic-Manager
||npm install
```

Si no tienes Rust y Cargo instalados, puedes hacerlo desde: https://www.rust-lang.org/tools/install

## Uso en desarrollo

Para levantar Angular y la aplicación de escritorio Tauri simultáneamente, ejecuta:

```bash
npm start
```

Esto realizará lo siguiente:
* Levanta Angular en modo desarrollo (http://localhost:4200)
* Espera que Angular esté listo
* Inicia la aplicación de escritorio Tauri apuntando al frontend en desarrollo

## Compilación para producción

1. Construye el frontend Angular:

```bash
npm run build
```

2. Empaqueta la aplicación Tauri para distribución:

```bash
||tauri build
```

Los binarios generados estarán en la carpeta `src-tauri/target/release/`.

## Estructura del proyecto

* `src/` — Código fuente Angular
* `public/` — Archivos públicos y assets
* `src-tauri/` — Configuración y código fuente de Tauri
* `dist/clinic-manager` — Carpeta de salida tras construir Angular

## Configuraciones clave

* En `tauri.conf.json`, el campo `build.frontendDist` apunta a la carpeta de distribución Angular (`../dist/clinic-manager`).
* En `package.json`, el script `start` usa `concurrently` para correr Angular y Tauri simultáneamente.
* Se utiliza `wait-on` para asegurar que Angular esté listo antes de lanzar la app Tauri.
|## Notas

* Recomendamos usar una versión LTS estable de Node.js para evitar problemas de compatibilidad.
* Más información:
   * [Tauri](https://tauri.app/)
   * [Angular](https://angular.io/)

## Autor

Gabriel Roldá|

---

¡Gracias por usar Clinic-Manager!