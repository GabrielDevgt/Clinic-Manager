import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Paciente, PacienteInput } from '../models/paciente.model';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor() { }

  /**
   * Obtiene todos los pacientes de la base de datos
   * @returns Observable con array de pacientes
   */
  obtenerPacientes(): Observable<Paciente[]> {
    return from(
      invoke<Paciente[]>('obtener_pacientes')
        .then(pacientes => {
          console.log('Pacientes obtenidos:', pacientes);
          return pacientes;
        })
        .catch(error => {
          console.error('Error obteniendo pacientes:', error);
          throw error;
        })
    );
  }

  /**
   * Inserta un nuevo paciente en la base de datos
   * @param paciente Datos del paciente a insertar
   * @returns Observable con mensaje de confirmación
   */
  insertarPaciente(paciente: PacienteInput): Observable<string> {
    return from(
      invoke<string>('insertar_paciente', {
        nombre1: paciente.nombre_1,
        nombre2: paciente.nombre_2,
        nombre3: paciente.nombre_3 || null,
        apellido1: paciente.apellido_1,
        apellido2: paciente.apellido_2 || null,
        apellidoCasado: paciente.apellido_casado || null,
        fechaNacimiento: paciente.fecha_nacimiento,
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        genero: paciente.genero
      })
        .then(resultado => {
          console.log('Paciente insertado:', resultado);
          return resultado;
        })
        .catch(error => {
          console.error('Error insertando paciente:', error);
          throw error;
        })
    );
  }

  /**
   * Obtiene el nombre completo del paciente
   * @param paciente Objeto paciente
   * @returns String con nombre completo
   */
  obtenerNombreCompleto(paciente: Paciente): string {
    const nombres = [paciente.nombre_1, paciente.nombre_2, paciente.nombre_3]
      .filter(nombre => nombre && nombre.trim() !== '')
      .join(' ');
    
    const apellidos = [paciente.apellido_1, paciente.apellido_2, paciente.apellido_casado]
      .filter(apellido => apellido && apellido.trim() !== '')
      .join(' ');
    
    return `${nombres} ${apellidos}`.trim();
  }

  /**
   * Formatea la fecha de registro para mostrar
   * @param fechaRegistro Fecha en formato string
   * @returns Fecha formateada
   */
  formatearFechaRegistro(fechaRegistro?: string): string {
    if (!fechaRegistro) return 'No disponible';
    
    try {
      const fecha = new Date(fechaRegistro);
      return fecha.toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fechaRegistro;
    }
  }

  /**
   * Valida el formato del teléfono
   * @param telefono Número de teléfono
   * @returns True si es válido
   */
  validarTelefono(telefono: string): boolean {
    const telefonoLimpio = telefono.replace(/\s/g, '');
    return telefonoLimpio.length >= 8 && /^\d+$/.test(telefonoLimpio);
  }
}