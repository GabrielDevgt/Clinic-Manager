export interface Antecedente {
  id_antecedente: number;
  id_paciente: number;
  id_enfermedad: number;
  fecha_diagnostico: string; // Formato 'YYYY-MM-DD'
  tratamiento?: string;
}

export interface AntecedenteView extends Antecedente {
  nombre_enfermedad: string;
  nombre_paciente: string;
}