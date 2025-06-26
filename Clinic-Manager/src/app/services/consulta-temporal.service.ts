import { Injectable } from '@angular/core';
import { Observable, catchError, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { ConsultaTemporal, ConsultaTemporalInput } from '../models/consulta-temporal.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaTemporalService {

  constructor() { }

  obtenerTodas(): Observable<ConsultaTemporal[]> {
    return from(
      invoke<ConsultaTemporal[]>('obtener_consultas_temporales')
        .catch(error => this.handleError('Error al obtener consultas', error))
    );
  }

  obtenerPorPaciente(idPaciente: number): Observable<ConsultaTemporal[]> {
    return from(
      invoke<ConsultaTemporal[]>('obtener_consultas_por_paciente', { id_paciente: idPaciente })
        .catch(error => this.handleError('Error al obtener consultas por paciente', error))
    );
  }

obtenerPorId(id: number): Observable<ConsultaTemporal> {
  return from(
    invoke<ConsultaTemporal>('obtener_consulta_temporal_por_id', { idConsulta: id })
      .catch(error => this.handleError('Error al obtener consulta', error))
  );
}


crear(consulta: ConsultaTemporalInput): Observable<number> {
  // Transforma los nombres de snake_case a camelCase
  const requestData = {
    idPaciente: consulta.id_paciente,
    motivoConsulta: consulta.motivo_consulta,
    // fechaConsulta: this.formatDateForBackend(consulta.fecha_consulta),
    peso: consulta.peso ?? null,
    altura: consulta.altura ?? null,
    frecuenciaCardiaca: consulta.frecuencia_cardiaca ?? null,
    presionArterial: consulta.presion_arterial ?? null,
    antecedente: consulta.antecedente ?? null,
    enfermedades: consulta.enfermedades ?? null,
    laboratorio: consulta.laboratorio ?? null,
    examenFisico: consulta.examen_fisico ?? null,
    diagnostico: consulta.diagnostico ?? null,
    proximaCita: this.formatDateForBackend(consulta.proxima_cita),
    planTerapeutico: consulta.plan_terapeutico ?? null
  };

  console.log('Datos transformados para Rust:', requestData);

  return from(
    invoke<number>('insertar_consulta_temporal', requestData)
  ).pipe(
    catchError(error => {
      console.error('Error completo:', error);
      throw new Error(`Error al crear consulta: ${error.message || error}`);
    })
  );
}

private formatDateForBackend(dateString: string): string {
  // Convierte a formato 'YYYY-MM-DD HH:MM:SS' que espera Rust
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} 12:00:00`;
}

  actualizar(id: number, consulta: ConsultaTemporal): Observable<string> {
    return from(
      invoke<string>('actualizar_consulta_temporal', {
        id_consulta: id,
        id_paciente: consulta.id_paciente,
        motivo_consulta: consulta.motivo_consulta,
        peso: consulta.peso,
        altura: consulta.altura,
        frecuencia_cardiaca: consulta.frecuencia_cardiaca,
        presion_arterial: consulta.presion_arterial,
        antecedente: consulta.antecedente,
        enfermedades: consulta.enfermedades,
        laboratorio: consulta.laboratorio,
        examen_fisico: consulta.examen_fisico,
        diagnostico: consulta.diagnostico,
        proxima_cita: consulta.proxima_cita,
        plan_terapeutico: consulta.plan_terapeutico
      })
      .catch(error => this.handleError('Error al actualizar consulta', error))
    );
  }

  eliminar(id: number): Observable<string> {
    return from(
      invoke<string>('eliminar_consulta_temporal', { id })
        .catch(error => this.handleError('Error al eliminar consulta', error))
    );
  }

  private handleError(context: string, error: any): never {
    console.error(`${context}:`, error);
    throw new Error(`${context}: ${error.message || error}`);
  }
}