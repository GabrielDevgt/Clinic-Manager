export interface Enfermedad {
  id_enfermedad: number;
  nombre: string;
  id_categoria_enfermedades: number | null; // Este es el nombre correcto
  es_cronica: boolean;
}