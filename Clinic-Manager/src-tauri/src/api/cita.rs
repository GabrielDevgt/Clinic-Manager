use tauri::command;
use crate::db::cita::obtener_proximas_citas;
use crate::models::cita::Cita;

#[command]
pub fn get_proximas_citas() -> Result<Vec<Cita>, String> {
    obtener_proximas_citas().map_err(|e| e.to_string())
}
