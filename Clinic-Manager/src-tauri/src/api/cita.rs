use tauri::command;
use crate::db::cita::obtener_proximas_citas;
use crate::models::cita::Cita;
use rusqlite::{Connection, params}; // 👈 esto faltaba

#[command]
pub fn get_proximas_citas() -> Result<Vec<Cita>, String> {
    obtener_proximas_citas().map_err(|e| e.to_string())
}

#[command]
pub fn actualizar_estado_cita(id_cita: i32, nuevo_estado: String) -> Result<(), String> {
    let conn = Connection::open("clinica.db").map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE cita SET estado_cita = ?1 WHERE id_cita = ?2",
        params![nuevo_estado, id_cita],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn eliminar_cita(id_cita: i32) -> Result<(), String> {
    let conn = Connection::open("clinica.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM cita WHERE id_cita = ?1", [id_cita])
        .map_err(|e| e.to_string())?;
    Ok(())
}
