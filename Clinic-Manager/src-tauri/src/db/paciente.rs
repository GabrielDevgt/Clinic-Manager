//(Aquí van las operaciones directas con la base de datos)

use rusqlite::{Connection, Result};
use crate::models::paciente::Paciente;



//============Crear un nuevo paciente en la base de datos
pub fn insertar_paciente(
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
///================ Obtiene todos los pacientes de la base de datos
pub fn obtener_pacientes() -> Result<Vec<Paciente>, String> {
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



///================ Obtiene unicamente paciente por ID

pub fn obtener_paciente_por_id(id: i32) -> Result<Paciente, String> {
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
             WHERE Id_paciente = ?1",
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
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            Err(format!("No se encontró el paciente con ID {}", id))
        }
        Err(e) => Err(format!("Error obteniendo paciente: {}", e)),
    }
}

///================ Actualizar Paciente
pub fn actualizar_paciente(
    id: i32,
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
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    conn.execute(
        "UPDATE paciente SET 
            nombre_1 = ?1, 
            nombre_2 = ?2, 
            nombre_3 = ?3, 
            apellido_1 = ?4, 
            apellido_2 = ?5, 
            apellido_casado = ?6, 
            fecha_nacimiento = ?7, 
            direccion = ?8, 
            telefono = ?9, 
            genero = ?10 
        WHERE id_paciente = ?11",
        rusqlite::params![
            nombre_1,
            nombre_2,
            nombre_3,
            apellido_1,
            apellido_2,
            apellido_casado,
            fecha_nacimiento,
            direccion,
            telefono,
            genero,
            id
        ],
    )
    .map_err(|e| format!("Error actualizando paciente: {}", e))?;

    Ok(format!("Paciente con ID {} actualizado correctamente", id))
}
