


# 🏥 Clinic Manager

Aplicación de escritorio para gestionar pacientes y consultas médicas, desarrollada con **Tauri** (Rust) y **Angular**, usando **SQLite3** como base de datos local.

 SECCIÓN: DESCRIPCIÓN GENERAL 

## 📋 Descripción

Clinic Manager es una herramienta de escritorio diseñada para facilitar el trabajo administrativo y clínico de un consultorio médico.

El sistema permite registrar pacientes, almacenar su historial médico, gestionar consultas médicas completas y mantener organizada toda la información de forma local, sin necesidad de conexión a internet.

 SECCIÓN: FUNCIONALIDADES PRINCIPALES 

## 🚀 Funcionalidades

- 📁 Registro de pacientes con datos personales.
- 🩺 Registro de consultas con datos clínicos: motivo, signos vitales, diagnóstico, tratamiento, próxima cita.
- 🕐 Historial de consultas por paciente.
- 🔍 Búsqueda rápida por número de expediente o DPI.
- 🧠 Validaciones de campos obligatorios y control de errores.
- 💾 Almacenamiento local usando SQLite3.
- 💻 Interfaz moderna y fluida con Angular.
- 🛠️ Backend optimizado con Rust a través de Tauri.


 SECCIÓN: TECNOLOGÍAS UTILIZADAS 

## 🛠️ Tecnologías utilizadas

| Tecnología   | Descripción                                |
|--------------|--------------------------------------------|
| **Angular**  | Framework frontend para SPA                |
| **Tauri**    | Framework para crear apps de escritorio    |
| **Rust**     | Lenguaje de backend seguro y rápido        |
| **SQLite3**  | Base de datos ligera y local               |
| **TypeScript** | Tipado fuerte para código más mantenible |
| **HTML/CSS** | Estructura y estilos básicos               |

 SECCIÓN: REQUISITOS DE INSTALACIÓN 

## 📦 Requisitos

Antes de iniciar, asegúrate de tener instalado:

- Node.js: https://nodejs.org/
- Rust: https://www.rust-lang.org/tools/install
- Tauri CLI: `cargo install tauri-cli`


SECCIÓN: INSTALACIÓN DEL PROYECTO 

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/GabrielDevgt/Clinic-Manager.git
cd Clinic-Manager
Instala las dependencias de Angular:

cd src-tauri-app
npm install
Ejecuta la app con Tauri:

npm run tauri dev
Este comando abrirá la aplicación en una ventana de escritorio lista para usar.
```

 SECCIÓN: ESTRUCTURA DEL PROYECTO
  ## 📁 Estructura del proyecto
  ```bash Clinic-Manager/  
  ├── src-tauri/ # Código backend (Rust) │
  ├── src/
  │ └── tauri.conf.json # Configuración principal de Tauri
  │ ├── src-tauri-app/ # Proyecto Angular (frontend)
  │ ├── app/
  │ ├── assets/
  │ └── index.html
  │ └── README.md # Este archivo
```
 SECCIÓN: FUNCIONALIDADES CLÍNICAS DETALLADAS 
 ## 🩺 Información clínica registrada En cada consulta médica se almacena: 
- **Antecedentes Patológicos**
- **Motivo de la consulta**
- **Historia de la enfermedad actual**
- **Signos vitales:** Presión Arterial (PA), Frecuencia Cardíaca (FC), Peso, Talla
- **Examen físico**
- **Diagnósticos**
- **Lboratorios** - **Plan terapéutico**
- **Próxima cita**
- Los datos se almacenan en la base de datos local y están asociados al paciente correspondiente.
   SECCIÓN: POSIBLES MEJORAS
 ## 🌱 Funcionalidades futuras (pendientes o en desarrollo) 
 - Exportar consultas a PDF
 - Agregar autenticación de usuario
 - Implementar backup en la nube
 - Soporte para múltiples usuarios
 - Filtros avanzados por fecha o diagnóstico
   SECCIÓN: CONTRIBUIR AL PROYECTO
 ## 🤝 Contribuciones Si deseas contribuir al proyecto: 
 1. Haz un fork del repositorio.
 2. Crea una nueva rama: `git checkout -b feature/nueva-funcion`
 3. Realiza tus cambios y haz commit: `git commit -m "Agrega nueva función"`
 4. Sube tus cambios: `git push origin feature/nueva-funcion`
 5. Abre un Pull Request. ¡Gracias por apoyar este proyecto!

    SECCIÓN: LICENCIA
     📄 Licencia Este proyecto está bajo la licencia MIT. Puedes usar, modificar y distribuir el código libremente siempre que se incluya una copia del archivo LICENSE.
SECCIÓN FINAL: CRÉDITOS
 ## 🙌 Autor Creado por [Gabriel Roldan](https://github.com/GabrielDevgt) — Guatemala 🇬🇹 Sígueme para más proyectos. ```
