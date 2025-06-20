// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use chrono::{DateTime, Utc};
use rusqlite::{Connection, Result};
use tauri::command;

struct Persona {
    id: i32,
    nombre: String,
    data: Option<Vec<u8>>,
    fecha: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Paciente {
    id_paciente: i32,
    nombre_1: String,
    nombre_2: String,
    nombre_3: Option<String>,
    apellido_1: String,
    apellido_2: Option<String>,
    apellido_casado: Option<String>,
    fecha_nacimiento: String,
    direccion: String,
    telefono: String,
    genero: String,
    fecha_registro: Option<String>,
}

fn inicializar_bases_datos() -> Result<()> {
    // Conexión a la base de datos original
    let conexion = Connection::open("my-db2.db3").expect("error conectando a sqlite");

    conexion
        .execute(
            "CREATE TABLE IF NOT EXISTS PERSONA(
            id INTEGER PRIMARY KEY,
            nombre TEXT NOT NULL,
            fecha TEXT NULL,
            data BLOB
        )",
            (),
        )
        .expect("Error Creando La Tabla PERSONA");

    // Insertar datos de ejemplo en PERSONA
    conexion
        .execute(
            "INSERT OR IGNORE INTO PERSONA (id, nombre, data, fecha) VALUES (?1, ?2, ?3, ?4)",
            (1, "Maria", Some(vec![3, 4, 1, 2]), Utc::now().to_rfc3339()),
        )
        .expect("Error insertando Maria");

    conexion
        .execute(
            "INSERT OR IGNORE INTO PERSONA (id, nombre, data, fecha) VALUES (?1, ?2, ?3, ?4)",
            (2, "Juan", Some(vec![10, 11]), Utc::now().to_rfc3339()),
        )
        .expect("Error insertando Juan");

    // ========== NUEVA BASE DE DATOS DE CLÍNICA ==========
    
    // Conexión a la nueva base de datos de clínica
    let conexion_clinica = Connection::open("clinica.db").expect("error conectando a base de datos clinica");

    // Crear la tabla paciente
    conexion_clinica
        .execute(
            "CREATE TABLE IF NOT EXISTS paciente (
                Id_paciente INTEGER PRIMARY KEY AUTOINCREMENT,
                Nombre_1 TEXT NOT NULL,
                Nombre_2 TEXT NOT NULL,
                Nombre_3 TEXT,
                Apellido_1 TEXT NOT NULL,
                Apellido_2 TEXT,
                Apellido_casado TEXT,
                Fecha_Nacimiento TEXT NOT NULL,
                Direccion TEXT NOT NULL,
                Telefono TEXT NOT NULL CHECK (LENGTH(Telefono) >= 8 AND Telefono GLOB '[0-9]*'),
                Genero TEXT CHECK (Genero IN ('Masculino', 'Femenino', 'Otro')),
                fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            (),
        )
        .expect("Error creando la tabla paciente");

    println!("========== BASES DE DATOS INICIALIZADAS ==========");
    println!("Base de datos 'my-db2.db3' con tabla PERSONA ✓");
    println!("Base de datos 'clinica.db' con tabla paciente ✓");
    println!("==================================================");

    Ok(())
}

// Comando Tauri para insertar pacientes (preparado para cuando lo necesites)
#[command]
fn insertar_paciente(
    nombre_1: String,
    nombre_2: String,
    nombre_3: Option<String>,
    apellido_1: String,
    apellido_2: Option<String>,
    apellido_casado: Option<String>,
    fecha_nacimiento: String,
    direccion: String,
    telefono: String,
    genero: String,
) -> Result<String, String> {
    let conexion = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    conexion
        .execute(
            "INSERT INTO paciente (Nombre_1, Nombre_2, Nombre_3, Apellido_1, Apellido_2, Apellido_casado, Fecha_Nacimiento, Direccion, Telefono, Genero) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            (
                &nombre_1,
                &nombre_2,
                &nombre_3,
                &apellido_1,
                &apellido_2,
                &apellido_casado,
                &fecha_nacimiento,
                &direccion,
                &telefono,
                &genero,
            ),
        )
        .map_err(|e| format!("Error insertando paciente: {}", e))?;

    Ok("Paciente insertado exitosamente".to_string())
}

// Comando Tauri para obtener pacientes (preparado para cuando lo necesites)
#[command]
fn obtener_pacientes() -> Result<Vec<Paciente>, String> {
    let conexion = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    let mut statement = conexion
        .prepare("SELECT Id_paciente, Nombre_1, Nombre_2, Nombre_3, Apellido_1, Apellido_2, Apellido_casado, Fecha_Nacimiento, Direccion, Telefono, Genero, fecha_registro FROM paciente")
        .map_err(|e| format!("Error preparando consulta: {}", e))?;

    let pacientes_iter = statement
        .query_map([], |row| {
            Ok(Paciente {
                id_paciente: row.get(0)?,
                nombre_1: row.get(1)?,
                nombre_2: row.get(2)?,
                nombre_3: row.get(3)?,
                apellido_1: row.get(4)?,
                apellido_2: row.get(5)?,
                apellido_casado: row.get(6)?,
                fecha_nacimiento: row.get(7)?,
                direccion: row.get(8)?,
                telefono: row.get(9)?,
                genero: row.get(10)?,
                fecha_registro: row.get(11)?,
            })
        })
        .map_err(|e| format!("Error ejecutando consulta: {}", e))?;

    let mut pacientes = Vec::new();
    for paciente in pacientes_iter {
        pacientes.push(paciente.map_err(|e| format!("Error procesando paciente: {}", e))?);
    }

    Ok(pacientes)
}

fn main() {
    // Inicializar las bases de datos al arrancar la aplicación
    inicializar_bases_datos().expect("Error inicializando bases de datos");

    // Iniciar la aplicación Tauri
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![insertar_paciente, obtener_pacientes])
        .run(tauri::generate_context!())
        .expect("Error al iniciar Tauri");
}