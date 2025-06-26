  export interface Paciente {
    id_paciente: number;
    nombre_1: string;
    nombre_2: string;
    nombre_3?: string;
    apellido_1: string;
    apellido_2?: string;
    apellido_casado?: string;
    fecha_nacimiento: string;
    direccion: string;
    telefono: string;
    genero: 'Masculino' | 'Femenino' | 'Otro';
    fecha_registro?: string;
  }

  export interface PacienteInput {
    nombre_1: string;
    nombre_2: string;
    nombre_3?: string;
    apellido_1: string;
    apellido_2?: string;
    apellido_casado?: string;
    fecha_nacimiento: string;
    direccion: string;
    telefono: string;
    genero: 'Masculino' | 'Femenino' | 'Otro';
  }
  