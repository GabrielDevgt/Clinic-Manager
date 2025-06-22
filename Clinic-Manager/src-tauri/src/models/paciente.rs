

//Aquí definimos cómo se ve un paciente
use serde::{Serialize, Deserialize};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Paciente {
    pub id_paciente: i32,
    pub nombre_1: String,
    pub nombre_2: String,
    pub nombre_3: Option<String>,
    pub apellido_1: String,
    pub apellido_2: Option<String>,
    pub apellido_casado: Option<String>,
    pub fecha_nacimiento: String,
    pub direccion: String,
    pub telefono: String,
    pub genero: String,
    pub fecha_registro: Option<String>,
}