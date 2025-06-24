export interface ConsultaTemporal {
  id_consulta: number;  // Cambiado a requerido porque siempre lo tendrás al obtener datos
  id_paciente: number;
  motivo_consulta: string;
  fecha_consulta: string; // Formato: "YYYY-MM-DD HH:MM:SS"
  peso?: number | null;
  altura?: number | null;
  frecuencia_cardiaca?: number | null;
  presion_arterial?: string | null;
  antecedente?: string | null;
  enfermedades?: string | null;
  laboratorio?: string | null;
  examen_fisico?: string | null;
  diagnostico?: string | null;
  proxima_cita: string; // Formato: "YYYY-MM-DD HH:MM:SS"
  plan_terapeutico?: string | null;
}

// Tipo para creación (sin id_consulta y fecha_consulta se genera en backend)
export type ConsultaTemporalInput = Omit<ConsultaTemporal, 'id_consulta' | 'fecha_consulta'>;