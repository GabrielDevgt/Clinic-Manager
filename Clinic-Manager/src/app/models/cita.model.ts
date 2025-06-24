export interface Cita {
  id_cita: number;
  id_paciente: number;
  fecha_cita: string;
  estado_cita: 'Pendiente' | 'Atendida' | 'Cancelada';
  paciente?: {  // Opcional: datos del paciente para mostrar
    nombre_completo: string;
  };
  consulta_vinculada?: {  // Opcional: datos de la consulta vinculada
    motivo_consulta: string;
  };
}