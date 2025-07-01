use rusqlite::{params, Connection, Result};
use chrono::Utc;
use crate::models::cita::Cita;

pub fn obtener_proximas_citas() -> Result<Vec<Cita>> {
    let conn = Connection::open("clinica.db")?;

    let mut stmt = conn.prepare(
        "
        SELECT
            c.id_cita,
            c.id_paciente,
            c.fecha_cita,
            c.estado_cita,
            p.Nombre_1 || ' ' || IFNULL(p.Nombre_2 || ' ', '') || IFNULL(p.Apellido_1 || ' ', '') || IFNULL(p.Apellido_2 || '', '') AS nombre_completo
        FROM cita c
        JOIN paciente p ON p.Id_paciente = c.id_paciente
        WHERE datetime(c.fecha_cita) > datetime(?1)
        ORDER BY datetime(c.fecha_cita) ASC
        "
    )?;

    let ahora = Utc::now().to_rfc3339();
    let citas_iter = stmt.query_map(params![ahora], |row| {
        Ok(Cita {
            id_cita: row.get(0)?,
            id_paciente: row.get(1)?,
            fecha_cita: row.get(2)?,
            estado_cita: row.get(3)?,
            nombre_completo: row.get(4)?,
        })
    })?;

    let mut citas = Vec::new();
    for cita in citas_iter {
        citas.push(cita?);
    }

    Ok(citas)
}
