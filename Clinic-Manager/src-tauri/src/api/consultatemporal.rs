use tauri::command;
use crate::{db::consultatemporal, models::consultatemporal::ConsultaTemporal};

#[command]
pub fn insertar_consulta_temporal(
    id_paciente: i32,
    motivo_consulta: String,
    peso: Option<f64>,
    altura: Option<f64>,
    frecuencia_cardiaca: Option<i32>,
    presion_arterial: Option<String>,
    antecedente: Option<String>,
    enfermedades: Option<String>,
    laboratorio: Option<String>,
    examen_fisico: Option<String>,
    diagnostico: Option<String>,
    proxima_cita: String,
    plan_terapeutico: Option<String>,
) -> Result<i32, String> {
    consultatemporal::insertar_consulta_temporal(
        id_paciente,
        motivo_consulta,
        peso,
        altura,
        frecuencia_cardiaca,
        presion_arterial,
        antecedente,
        enfermedades,
        laboratorio,
        examen_fisico,
        diagnostico,
        proxima_cita,
        plan_terapeutico
    )
}

#[command]
pub fn obtener_consultas_temporales() -> Result<Vec<ConsultaTemporal>, String> {
    consultatemporal::obtener_consultas()
}

#[command]
pub fn obtener_consultas_por_paciente(id_paciente: i32) -> Result<Vec<ConsultaTemporal>, String> {
    consultatemporal::obtener_consultas_por_paciente(id_paciente)
}

#[command]
pub fn obtener_consulta_temporal_por_id(id_consulta: i32) -> Result<ConsultaTemporal, String> {
    consultatemporal::obtener_consulta_por_id(id_consulta)
}

#[command]
pub fn actualizar_consulta_temporal(
    id_consulta: i32,
    id_paciente: i32,
    motivo_consulta: String,
    peso: Option<f64>,
    altura: Option<f64>,
    frecuencia_cardiaca: Option<i32>,
    presion_arterial: Option<String>,
    antecedente: Option<String>,
    enfermedades: Option<String>,
    laboratorio: Option<String>,
    examen_fisico: Option<String>,
    diagnostico: Option<String>,
    proxima_cita: String,
    plan_terapeutico: Option<String>,
) -> Result<String, String> {
    consultatemporal::actualizar_consulta_temporal(
        id_consulta,
        id_paciente,
        motivo_consulta,
        peso,
        altura,
        frecuencia_cardiaca,
        presion_arterial,
        antecedente,
        enfermedades,
        laboratorio,
        examen_fisico,
        diagnostico,
        proxima_cita,
        plan_terapeutico
    )
}

#[command]
pub fn eliminar_consulta_temporal(id_consulta: i32) -> Result<String, String> {
    consultatemporal::eliminar_consulta_temporal(id_consulta)
}