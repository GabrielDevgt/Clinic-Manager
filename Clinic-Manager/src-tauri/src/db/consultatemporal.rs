use rusqlite::{Connection, Result, params};
use crate::models::consultatemporal::ConsultaTemporal;

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
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    conn.execute(
        "INSERT INTO consultatemporales (
            id_paciente, motivo_consulta, fecha_consulta,
            peso, altura, frecuencia_cardiaca, presion_arterial,
            antecedente, enfermedades, laboratorio,
            examen_fisico, diagnostico, proxima_cita, plan_terapeutico
        ) VALUES (?1, ?2, datetime('now'), ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
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
        ],
    )
    .map_err(|e| format!("Error insertando consulta: {}", e))?;

    Ok(conn.last_insert_rowid() as i32)
}

pub fn obtener_consultas() -> Result<Vec<ConsultaTemporal>, String> {
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    let mut stmt = conn.prepare("SELECT * FROM consultatemporales")
        .map_err(|e| format!("Error preparando consulta: {}", e))?;

    let consultas = stmt.query_map([], |row| {
        Ok(ConsultaTemporal {
            id_consulta: row.get(0)?,
            id_paciente: row.get(1)?,
            motivo_consulta: row.get(2)?,
            fecha_consulta: row.get(3)?,
            peso: row.get(4)?,
            altura: row.get(5)?,
            frecuencia_cardiaca: row.get(6)?,
            presion_arterial: row.get(7)?,
            antecedente: row.get(8)?,
            enfermedades: row.get(9)?,
            laboratorio: row.get(10)?,
            examen_fisico: row.get(11)?,
            diagnostico: row.get(12)?,
            proxima_cita: row.get(13)?,
            plan_terapeutico: row.get(14)?,
        })
    })
    .map_err(|e| format!("Error ejecutando consulta: {}", e))?
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| format!("Error procesando resultados: {}", e))?;

    Ok(consultas)
}

// ... (implementar las demás funciones con el mismo patrón)

pub fn eliminar_consulta_temporal(id_consulta: i32) -> Result<String, String> {
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    conn.execute(
        "DELETE FROM consultatemporales WHERE id_consulta = ?1",
        params![id_consulta],
    )
    .map_err(|e| format!("Error eliminando consulta: {}", e))?;

    Ok("Consulta eliminada correctamente".to_string())
}

pub fn obtener_consultas_por_paciente(id_paciente: i32) -> Result<Vec<ConsultaTemporal>, String> {
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    let mut stmt = conn.prepare(
        "SELECT * FROM consultatemporales WHERE id_paciente = ?1 ORDER BY fecha_consulta DESC"
    )
    .map_err(|e| format!("Error preparando consulta: {}", e))?;

    let consultas = stmt.query_map(params![id_paciente], |row| {
        Ok(ConsultaTemporal {
            id_consulta: row.get(0)?,
            id_paciente: row.get(1)?,
            motivo_consulta: row.get(2)?,
            fecha_consulta: row.get(3)?,
            peso: row.get(4)?,
            altura: row.get(5)?,
            frecuencia_cardiaca: row.get(6)?,
            presion_arterial: row.get(7)?,
            antecedente: row.get(8)?,
            enfermedades: row.get(9)?,
            laboratorio: row.get(10)?,
            examen_fisico: row.get(11)?,
            diagnostico: row.get(12)?,
            proxima_cita: row.get(13)?,
            plan_terapeutico: row.get(14)?,
        })
    })
    .map_err(|e| format!("Error ejecutando consulta: {}", e))?
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| format!("Error procesando resultados: {}", e))?;

    Ok(consultas)
}

pub fn obtener_consulta_por_id(id_consulta: i32) -> Result<ConsultaTemporal, String> {
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    conn.query_row(
        "SELECT * FROM consultatemporales WHERE id_consulta = ?1",
        params![id_consulta],
        |row| {
            Ok(ConsultaTemporal {
                id_consulta: row.get(0)?,
                id_paciente: row.get(1)?,
                motivo_consulta: row.get(2)?,
                fecha_consulta: row.get(3)?,
                peso: row.get(4)?,
                altura: row.get(5)?,
                frecuencia_cardiaca: row.get(6)?,
                presion_arterial: row.get(7)?,
                antecedente: row.get(8)?,
                enfermedades: row.get(9)?,
                laboratorio: row.get(10)?,
                examen_fisico: row.get(11)?,
                diagnostico: row.get(12)?,
                proxima_cita: row.get(13)?,
                plan_terapeutico: row.get(14)?,
            })
        }
    )
    .map_err(|e| format!("Error obteniendo consulta: {}", e))
}

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
    let conn = Connection::open("clinica.db")
        .map_err(|e| format!("Error conectando a la base de datos: {}", e))?;

    conn.execute(
        "UPDATE consultatemporales SET
            id_paciente = ?1,
            motivo_consulta = ?2,
            peso = ?3,
            altura = ?4,
            frecuencia_cardiaca = ?5,
            presion_arterial = ?6,
            antecedente = ?7,
            enfermedades = ?8,
            laboratorio = ?9,
            examen_fisico = ?10,
            diagnostico = ?11,
            proxima_cita = ?12,
            plan_terapeutico = ?13
        WHERE id_consulta = ?14",
        params![
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
            plan_terapeutico,
            id_consulta
        ],
    )
    .map_err(|e| format!("Error actualizando consulta: {}", e))?;

    Ok(format!("Consulta con ID {} actualizada correctamente", id_consulta))
}