export interface ConsultaTemporal {
  id_consulta?: number;  // Opcional porque lo genera la BD
  id_paciente: number;
  motivo_consulta: string;
  fecha_consulta: string;
  peso?: number | null;
  altura?: number | null;
  frecuencia_cardiaca?: number | null;
  presion_arterial?: string | null;
  antecedente?: string | null;
  enfermedades?: string | null;
  laboratorio?: string | null;
  examen_fisico?: string | null;
  diagnostico?: string | null;
  proxima_cita: string;
  plan_terapeutico?: string | null;
}
// 👇 Tipo para inserciones (sin id_consulta)
export type ConsultaTemporalInput = Omit<ConsultaTemporal, 'id_consulta'>;
