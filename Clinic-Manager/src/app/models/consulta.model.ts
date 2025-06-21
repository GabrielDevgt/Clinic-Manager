export interface Consulta {
  id_consulta: number;
  id_paciente: number;
  motivo_consulta: string;
  fecha_consulta: string;
  peso?: number;
  altura?: number;
  frecuencia_cardiaca?: number;
  presion_arterial?: string;
  id_antecedente?: number;
  id_episodio?: number;
  id_laboratorio?: number;
  id_examen_fisico?: number;
  id_diagnostico?: number;
  proxima_cita: string;
  id_plan_terapeutico?: number;
  fecha_registro?: string;
  
  // Campos calculados para la vista (opcional)
  nombre_paciente?: string;
  edad_paciente?: number;
  imc?: number;
  estado_consulta?: 'Completada' | 'Pendiente' | 'En Proceso';
}

export interface ConsultaInput {
  id_paciente: number;
  motivo_consulta: string;
  fecha_consulta: string;
  peso?: number;
  altura?: number;
  frecuencia_cardiaca?: number;
  presion_arterial?: string;
  id_antecedente?: number;
  id_episodio?: number;
  id_laboratorio?: number;
  id_examen_fisico?: number;
  id_diagnostico?: number;
  proxima_cita: string;
  id_plan_terapeutico?: number;
}

export interface ConsultaConPaciente extends Consulta {
  paciente: {
    nombre_completo: string;
    edad: number;
    genero: 'Masculino' | 'Femenino' | 'Otro';
    telefono: string;
  };
}

export interface SignosVitales {
  peso?: number;
  altura?: number;
  frecuencia_cardiaca?: number;
  presion_arterial?: string;
  imc?: number;
  temperatura?: number;
  saturacion_oxigeno?: number;
}

export interface ResumenConsulta {
  total_consultas: number;
  consultas_hoy: number;
  consultas_semana: number;
  consultas_mes: number;
  citas_pendientes: number;
  citas_urgentes: number;
}

export interface FiltroConsulta {
  fecha_inicio?: string;
  fecha_fin?: string;
  id_paciente?: number;
  estado?: 'Completada' | 'Pendiente' | 'En Proceso';
  periodo?: 'hoy' | 'semana' | 'mes' | 'trimestre' | 'año';
}