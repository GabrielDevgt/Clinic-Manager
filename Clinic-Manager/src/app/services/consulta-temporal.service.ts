import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { ConsultaTemporal } from '../models/consulta-temporal.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaTemporalService {

  constructor() { }

  obtenerConsultasTemporales(): Observable<ConsultaTemporal[]> {
    return from(
      invoke<ConsultaTemporal[]>('obtener_consultas_temporales')
        .then(res => res)
        .catch(error => this.handleError('Error al obtener consultas temporales', error))
    );
  }

  obtenerConsultaTemporalPorId(id: number): Observable<ConsultaTemporal> {
    return from(
      invoke<ConsultaTemporal>('obtener_consulta_temporal_por_id', { id })
        .then(res => res)
        .catch(error => this.handleError('Error al obtener consulta temporal', error))
    );
  }

  crearConsultaTemporal(consulta: ConsultaTemporal): Observable<string> {
    console.log('Enviando a Rust:', consulta); // Debug
    
    return from(
      invoke<string>('crear_consulta_temporal', {
        idPaciente: consulta.id_paciente,
        motivoConsulta: consulta.motivo_consulta,
        fechaConsulta: consulta.fecha_consulta,
        peso: consulta.peso,
        altura: consulta.altura,
        frecuenciaCardiaca: consulta.frecuencia_cardiaca,
        presionArterial: consulta.presion_arterial,
        antecedente: consulta.antecedente,
        enfermedades: consulta.enfermedades,
        laboratorio: consulta.laboratorio,
        examenFisico: consulta.examen_fisico,
        diagnostico: consulta.diagnostico,
        proximaCita: consulta.proxima_cita,
        planTerapeutico: consulta.plan_terapeutico
      })
        .then(res => {
          console.log('Respuesta de Rust:', res); // Debug
          return res;
        })
        .catch(error => this.handleError('Error al crear consulta temporal', error))
    );
  }

  actualizarConsultaTemporal(id: number, consulta: ConsultaTemporal): Observable<string> {
    return from(
      invoke<string>('actualizar_consulta_temporal', {
        idConsulta: id,
        motivoConsulta: consulta.motivo_consulta,
        fechaConsulta: consulta.fecha_consulta,
        peso: consulta.peso,
        altura: consulta.altura,
        frecuenciaCardiaca: consulta.frecuencia_cardiaca,
        presionArterial: consulta.presion_arterial,
        antecedente: consulta.antecedente,
        enfermedades: consulta.enfermedades,
        laboratorio: consulta.laboratorio,
        examenFisico: consulta.examen_fisico,
        diagnostico: consulta.diagnostico,
        proximaCita: consulta.proxima_cita,
        planTerapeutico: consulta.plan_terapeutico
      })
        .then(res => res)
        .catch(error => this.handleError('Error al actualizar consulta temporal', error))
    );
  }

  eliminarConsultaTemporal(id: number): Observable<string> {
    return from(
      invoke<string>('eliminar_consulta_temporal', { id })
        .then(res => res)
        .catch(error => this.handleError('Error al eliminar consulta temporal', error))
    );
  }
  obtenerConsultaPorId(id: number): Observable<ConsultaTemporal> {
    return from(
      invoke<ConsultaTemporal>('obtener_consulta_temporal_por_id', { id })
        .then(res => res)
        .catch(error => this.handleError('Error al obtener consulta temporal', error))
    );
  }
  crearCita(id_paciente: number, fecha_cita: string): Observable<void> {
  return from(
    invoke<void>('crear_cita', {
      idPaciente: id_paciente,
      fechaCita: fecha_cita
    }).catch(error => this.handleError('Error al crear la cita', error))
  );
}


  private handleError(context: string, error: any): never {
    console.error(`${context}:`, error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`${context}. Error: ${error.message || error}`);
  }
}