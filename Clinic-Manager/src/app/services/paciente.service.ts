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

  /**
 * Obtiene un paciente específico por ID
 * @param id ID del paciente a buscar
 * @returns Observable con el paciente encontrado
 */
  obtenerPacientePorId(id: number): Observable<Paciente> {
    return from(
      invoke<Paciente>('obtener_pacientes_por_id', { id })
        .then(paciente => {
          console.log('Paciente obtenido:', paciente);
          return paciente;
        })
        .catch(error => {
          console.error('Error obteniendo paciente:', error);
          throw error;
        })
    );
  }

  
/**
 * Actualiza un paciente existente en la base de datos
 * @param id ID del paciente a actualizar
 * @param paciente Datos actualizados del paciente
 * @returns Observable con mensaje de confirmación
 */
actualizarPaciente(id: number, paciente: PacienteInput): Observable<string> {
  return from(
    invoke<string>('actualizar_paciente', {
      id,
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
      console.log('Paciente actualizado:', resultado);
      return resultado;
    })
    .catch(error => {
      console.error('Error actualizando paciente:', error);
      throw error;
    })
  );
}



}