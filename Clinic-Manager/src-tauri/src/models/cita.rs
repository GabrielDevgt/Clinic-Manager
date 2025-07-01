use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Cita {
    pub id_cita: i32,
    pub id_paciente: i32,
    pub fecha_cita: String,
    pub estado_cita: String,
    pub nombre_completo: String,
}
