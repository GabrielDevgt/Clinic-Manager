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

    // Crear las nuevas tablas y triggers
    conexion_clinica.execute_batch(
        r#"
        -- Tabla de categorías de enfermedades
        CREATE TABLE IF NOT EXISTS categorias_enfermedades (
            id_categoria_enfermedades INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_catenfermedades TEXT NOT NULL UNIQUE
        );

        -- Tabla de enfermedades
        CREATE TABLE IF NOT EXISTS enfermedades (
            id_enfermedad INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre        TEXT    NOT NULL UNIQUE,
            id_categoria_enfermedades INTEGER,
            es_cronica    BOOLEAN NOT NULL CHECK (es_cronica IN (0, 1)),
            FOREIGN KEY (id_categoria_enfermedades) REFERENCES categorias_enfermedades (id_categoria_enfermedades) 
        );

        -- Tabla de antecedentes patológicos (para crónicas)
        CREATE TABLE IF NOT EXISTS antecedentes_patologicos (
            id_antecedente    INTEGER PRIMARY KEY AUTOINCREMENT,
            id_paciente       INTEGER NOT NULL,
            id_enfermedad     INTEGER NOT NULL,
            fecha_diagnostico TEXT NOT NULL,
            tratamiento       TEXT,
            FOREIGN KEY (id_paciente) REFERENCES paciente (Id_paciente),
            FOREIGN KEY (id_enfermedad) REFERENCES enfermedades (id_enfermedad) 
        );

        -- Tabla de historial de enfermedades (para agudas)
        CREATE TABLE IF NOT EXISTS historial_enfermedades (
            id_episodio   INTEGER PRIMARY KEY AUTOINCREMENT,
            id_paciente   INTEGER NOT NULL,
            id_enfermedad INTEGER NOT NULL,
            fecha_inicio  TEXT NOT NULL,
            fecha_fin     TEXT,
            sintomas      TEXT,
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
            FOREIGN KEY (id_enfermedad) REFERENCES enfermedades (id_enfermedad) 
        );

        -- Tabla de tipo de examen
        CREATE TABLE IF NOT EXISTS tipo_examen (
            id_tipo_examen          INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_tipo_examen      TEXT NOT NULL UNIQUE,
            descripcion_tipo_examen TEXT
        );

        -- Tabla de laboratorios
        CREATE TABLE IF NOT EXISTS laboratorios (
            id_laboratorio  INTEGER PRIMARY KEY AUTOINCREMENT,
            id_tipo_examen  INTEGER NOT NULL,
            id_paciente     INTEGER NOT NULL,
            Fecha_toma      TEXT,
            Fecha_resultado TEXT,
            Observaciones   TEXT,
            Resultado_valor REAL,
            Resultado_texto TEXT CHECK (Resultado_texto IN ('Positivo', 'Negativo', 'Pendiente', 'Otro')) NOT NULL,
            FOREIGN KEY (id_tipo_examen) REFERENCES tipo_examen (id_tipo_examen),
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) 
        );

        -- Tabla de examen físico
        CREATE TABLE IF NOT EXISTS examen_fisico (
            id_examen_fisico    INTEGER PRIMARY KEY AUTOINCREMENT,
            id_paciente         INTEGER NOT NULL,
            estado_general      TEXT CHECK (estado_general IN ('Consciente orientado', 'Consciente desorientado', 'Decaído', 'Inconsciente')),
            piel_mucosas        TEXT CHECK (piel_mucosas IN ('Normal', 'Pálido', 'Cianótico', 'Ictérico', 'Eritematoso', 'Lesiones presentes')),
            cardiopulmonar      TEXT CHECK (cardiopulmonar IN ('Normal', 'Taquicardia', 'Bradicardia', 'Soplo', 'Sibilancias', 'Crepitantes')),
            abdomen             TEXT CHECK (abdomen IN ('Blando depresible', 'Dolor a la palpación', 'Rigidez', 'Distendido', 'Masas palpables')),
            extremidades        TEXT CHECK (extremidades IN ('Normal', 'Edema', 'Pulsos disminuidos', 'Pulsos ausentes', 'Deformidad')),
            neurologico         TEXT CHECK (neurologico IN ('Normal', 'Reflejos disminuidos', 'Reflejos aumentados', 'Déficit motor', 'Parestesias')),
            extra_examen_fisico TEXT,
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) 
        );

        -- Tabla de diagnóstico
        CREATE TABLE IF NOT EXISTS diagnostico (
            id_diagnostico          INTEGER PRIMARY KEY AUTOINCREMENT,
            Tipo_diagnostico        TEXT CHECK (Tipo_diagnostico IN ('Principal', 'Secundario', 'Presuntivo')) NOT NULL,
            descripcion_diagnostico TEXT,
            id_paciente             INTEGER NOT NULL,
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) 
        );

        -- Tabla de plan terapéutico
        CREATE TABLE IF NOT EXISTS plan_terapeutico (
            id_plan_terapeutico INTEGER PRIMARY KEY AUTOINCREMENT,
            id_diagnostico      INTEGER NOT NULL,
            Objetivo            TEXT NOT NULL,
            Recomendaciones     TEXT NOT NULL,
            id_paciente         INTEGER NOT NULL,
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
            FOREIGN KEY (id_diagnostico) REFERENCES diagnostico (id_diagnostico) 
        );

        -- Tabla de tratamiento
        CREATE TABLE IF NOT EXISTS tratamiento (
            id_tratamiento       INTEGER PRIMARY KEY AUTOINCREMENT,
            via                  TEXT CHECK (via IN ('Oral', 'IV', 'IM', 'Topica', 'Otro')) NOT NULL,
            duracion_tratamiento TEXT,
            frecuencia           TEXT NOT NULL,
            dosis                TEXT NOT NULL,
            medicamento          TEXT NOT NULL,
            id_paciente          INTEGER NOT NULL,
            id_plan_terapeutico  INTEGER,
            FOREIGN KEY (id_plan_terapeutico) REFERENCES plan_terapeutico(id_plan_terapeutico),
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
        );

        -- Tabla de consulta
        CREATE TABLE IF NOT EXISTS consulta (
            id_consulta         INTEGER PRIMARY KEY AUTOINCREMENT,
            id_paciente         INTEGER NOT NULL,
            motivo_consulta     TEXT NOT NULL,
            fecha_consulta      TEXT NOT NULL,
            peso                REAL,
            altura              REAL,
            frecuencia_cardiaca INTEGER,
            presion_arterial    TEXT,
            id_antecedente      INTEGER,
            id_episodio         INTEGER,
            id_laboratorio      INTEGER,
            id_examen_fisico    INTEGER,
            id_diagnostico      INTEGER,
            proxima_cita        TEXT NOT NULL,
            id_plan_terapeutico INTEGER,
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente),
            FOREIGN KEY (id_antecedente) REFERENCES antecedentes_patologicos (id_antecedente),
            FOREIGN KEY (id_episodio) REFERENCES historial_enfermedades (id_episodio),
            FOREIGN KEY (id_laboratorio) REFERENCES laboratorios (id_laboratorio),
            FOREIGN KEY (id_examen_fisico) REFERENCES examen_fisico (id_examen_fisico),
            FOREIGN KEY (id_diagnostico) REFERENCES diagnostico (id_diagnostico),
            FOREIGN KEY (id_plan_terapeutico) REFERENCES plan_terapeutico (id_plan_terapeutico) 
        );

        -- Tabla de cita
        CREATE TABLE IF NOT EXISTS cita (
            id_cita INTEGER PRIMARY KEY AUTOINCREMENT,
            id_paciente INTEGER NOT NULL,
            fecha_cita  TEXT NOT NULL,
            estado_cita TEXT CHECK (estado_cita IN ('Pendiente', 'Atendida', 'Cancelada')) NOT NULL,
            FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) 
        );

        -- Trigger para antecedentes_patologicos (solo enfermedades crónicas)
        CREATE TRIGGER IF NOT EXISTS valida_antecedente_cronico
                BEFORE INSERT ON antecedentes_patologicos
              FOR EACH ROW
        BEGIN
            SELECT CASE WHEN (SELECT es_cronica FROM enfermedades WHERE id_enfermedad = NEW.id_enfermedad) != 1 
            THEN RAISE(ABORT, 'Error: Esta enfermedad no es crónica. Usa historial_enfermedades.') END;
        END;

        -- Trigger para historial_enfermedades (solo enfermedades agudas)
        CREATE TRIGGER IF NOT EXISTS valida_historial_agudo
                BEFORE INSERT ON historial_enfermedades
              FOR EACH ROW
        BEGIN
            SELECT CASE WHEN (SELECT es_cronica FROM enfermedades WHERE id_enfermedad = NEW.id_enfermedad) != 0 
            THEN RAISE(ABORT, 'Error: Esta enfermedad es crónica. Usa antecedentes_patologicos.') END;
        END;
        "#
    ).expect("Error creando tablas adicionales y triggers");

    println!("========== BASES DE DATOS INICIALIZADAS ==========");
    println!("Base de datos 'my-db2.db3' con tabla PERSONA ✓");
    println!("Base de datos 'clinica.db' con todas las tablas y triggers ✓");
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

#[command]
fn obtener_paciente_por_id(id: i32) -> Result<Paciente, String> {
    let conexion = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    let mut statement = conexion
        .prepare(
            "SELECT 
                Id_paciente, 
                Nombre_1, 
                Nombre_2, 
                Nombre_3, 
                Apellido_1, 
                Apellido_2, 
                Apellido_casado, 
                Fecha_Nacimiento, 
                Direccion, 
                Telefono, 
                Genero, 
                fecha_registro 
             FROM paciente 
             WHERE Id_paciente = ?1"
        )
        .map_err(|e| format!("Error preparando consulta: {}", e))?;

    match statement.query_row([id], |row| {
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
    }) {
        Ok(paciente) => Ok(paciente),
        Err(rusqlite::Error::QueryReturnedNoRows) => Err(format!("No se encontró el paciente con ID {}", id)),
        Err(e) => Err(format!("Error obteniendo paciente: {}", e)),
    }
}



fn main() {
    // Inicializar las bases de datos al arrancar la aplicación
    inicializar_bases_datos().expect("Error inicializando bases de datos");

    // Iniciar la aplicación Tauri
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![insertar_paciente, obtener_pacientes, obtener_paciente_por_id])
        .run(tauri::generate_context!())
        .expect("Error al iniciar Tauri");
}