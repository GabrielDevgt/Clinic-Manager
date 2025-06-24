// episodio.model.ts
export interface Episodio {
  id_episodio: number;
  id_paciente: number;
  id_enfermedad: number;
  fecha_inicio: string;
  fecha_fin?: string;
  sintomas?: string;
}