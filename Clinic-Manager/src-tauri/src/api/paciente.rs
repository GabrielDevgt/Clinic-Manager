use tauri::command;
use crate::{db::paciente, models::paciente::Paciente};

#[command]
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
    paciente::insertar_paciente(
        nombre_1, nombre_2, nombre_3,
        apellido_1, apellido_2, apellido_casado,
        fecha_nacimiento, direccion, telefono, genero
    )
}

#[command]
pub fn obtener_pacientes() -> Result<Vec<Paciente>, String> {
    paciente::obtener_pacientes()
}



#[command]
pub fn obtener_pacientes_por_id(id: i32) -> Result<Vec<Paciente>, String> {
    paciente::obtener_paciente_por_id(id).map(|p| vec![p])
}

#[command]
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
    paciente::actualizar_paciente(
        id,
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
    )
}
