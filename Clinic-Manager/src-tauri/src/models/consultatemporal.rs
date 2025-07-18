use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ConsultaTemporal {
    pub id_consulta: i32,
    pub id_paciente: i32,
    pub motivo_consulta: String,
    pub fecha_consulta: String,  // Formato: "YYYY-MM-DD HH:MM:SS"
    pub peso: Option<f64>,
    pub altura: Option<f64>,
    pub frecuencia_cardiaca: Option<i32>,
    pub presion_arterial: Option<String>, // Ej: "120/80"
    pub antecedente: Option<String>,
    pub enfermedades: Option<String>,
    pub laboratorio: Option<String>,
    pub examen_fisico: Option<String>,
    pub diagnostico: Option<String>,
    pub proxima_cita: String,    // Formato: "YYYY-MM-DD HH:MM:SS"
    pub plan_terapeutico: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConsultaTemporalInput {
    pub id_paciente: i32,
    pub motivo_consulta: String,
    pub peso: Option<f64>,
    pub altura: Option<f64>,
    pub frecuencia_cardiaca: Option<i32>,
    pub presion_arterial: Option<String>,
    pub antecedente: Option<String>,
    pub enfermedades: Option<String>,
    pub laboratorio: Option<String>,
    pub examen_fisico: Option<String>,
    pub diagnostico: Option<String>,
    pub proxima_cita: String,
    pub plan_terapeutico: Option<String>,
}