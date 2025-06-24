// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;
mod api;

use db::setup::inicializar_bases_datos;


fn main() {
    // Inicializar las bases de datos al arrancar la aplicación
    inicializar_bases_datos().expect("Error inicializando bases de datos");

    // Iniciar la aplicación Tauri
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            api::paciente::insertar_paciente, //para el formulario de insertado
            api::paciente::obtener_pacientes, //para la tabla general 
            api::paciente::obtener_paciente_por_id, //para la busqueda
            api::paciente::actualizar_paciente,  //para actualizar paciente
            // api::consultatemporal::crear_consulta_temporal, //para crear consulta
            // api::consultatemporal::obtener_consultas_temporales, //para la tabla de consulta que esta fallando
            // api::consultatemporal::obtener_consulta_temporal_por_id, // para busquedá de consulta fallando
            // api::consultatemporal::actualizar_consulta_temporal, //prefiero de momento no usarlo pero puede funcionar
            // api::consultatemporal::eliminar_consulta_temporal // prefiero de momento no usarlo pero puede funcionar 
     //============PAUSADAS TEMPORALMENTE================//
            // api::consulta::obtener_consultas, //pa
            // api::consulta::obtener_consulta_por_id,
            // api::consulta::crear_consulta,
            // api::enfermedad::obtener_categorias_enfermedades,
            // api::enfermedad::crear_categoria_enfermedad,
            // api::enfermedad::actualizar_categoria_enfermedad,
            // api::enfermedad::eliminar_categoria_enfermedad,
            // api::enfermedad::obtener_enfermedades,
            // api::enfermedad::obtener_enfermedad_por_id,
            // api::enfermedad::crear_enfermedad,
            // api::enfermedad::actualizar_enfermedad,
            // api::enfermedad::eliminar_enfermedad,
            // api::antecedente::crear_antecedente,
            // api::antecedente::obtener_antecedentes_por_paciente,
            // api::antecedente::obtener_antecedente_por_id,
            // api::antecedente::actualizar_antecedente,
            // api::antecedente::eliminar_antecedente,
     //==========FIN DE PAUSADAS =============//    
        ])
        .run(tauri::generate_context!())
        .expect("Error al iniciar Tauri");
}