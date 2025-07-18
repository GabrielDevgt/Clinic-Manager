import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { Consulta, ConsultaInput } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor() { }

  // Método mejorado para obtener consultas con tipado
  obtenerConsultas(): Observable<Consulta[]> {
    return from(
      invoke<Consulta[]>('obtener_consultas')
        .then(consultas => {
          console.log('Consultas obtenidas:', consultas);
          return consultas.map(c => this.enriquecerConsulta(c));
        })
        .catch(error => this.handleError('Error obteniendo consultas', error))
    );
  }

  // Método mejorado para obtener consulta por ID
  obtenerConsultaPorId(id: number): Observable<Consulta> {
    return from(
      invoke<Consulta>('obtener_consulta_por_id', { id })
        .then(consulta => {
          console.log('Consulta obtenida:', consulta);
          return this.enriquecerConsulta(consulta);
        })
        .catch(error => this.handleError('Error obteniendo consulta', error))
    );
  }

  // Método para crear consulta con tipo ConsultaInput
  crearConsulta(consulta: ConsultaInput): Observable<string> {
    return from(
      invoke<string>('crear_consulta', this.prepareConsultaData(consulta))
        .then(resultado => {
          console.log('Consulta creada:', resultado);
          return resultado;
        })
        .catch(error => this.handleError('Error creando consulta', error))
    );
  }

  // Método para actualizar consulta
  actualizarConsulta(id: number, consulta: ConsultaInput): Observable<string> {
    return from(
      invoke<string>('actualizar_consulta', { 
        id, 
        ...this.prepareConsultaData(consulta) 
      })
        .then(resultado => {
          console.log('Consulta actualizada:', resultado);
          return resultado;
        })
        .catch(error => this.handleError('Error actualizando consulta', error))
    );
  }

  // Métodos existentes (sin cambios)
  eliminarConsulta(id: number): Observable<string> {
    return from(
      invoke<string>('eliminar_consulta', { id })
        .then(resultado => {
          console.log('Consulta eliminada:', resultado);
          return resultado;
        })
        .catch(error => this.handleError('Error eliminando consulta', error))
    );
  }

  obtenerConsultasPorPaciente(idPaciente: number): Observable<Consulta[]> {
    return from(
      invoke<Consulta[]>('obtener_consultas_por_paciente', { idPaciente })
        .then(consultas => {
          console.log(`Consultas del paciente ${idPaciente} obtenidas:`, consultas);
          return consultas.map(c => this.enriquecerConsulta(c));
        })
        .catch(error => this.handleError('Error obteniendo consultas por paciente', error))
    );
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
    
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Error formateando fecha:', error);
      return fecha;
    }
  }

  // Nuevos métodos de ayuda
// SOLO CAMBIA ESTO (línea 111 del error):
private enriquecerConsulta(consulta: Consulta): Consulta {
  return {
    ...consulta,
    nombre_paciente: consulta.nombre_paciente || 'Paciente no disponible',
    imc: this.calcularIMC(consulta.peso, consulta.altura) || undefined // Añade esto
  };
}

  private calcularIMC(peso?: number, altura?: number): number | null {
    if (!peso || !altura || altura <= 0) return null;
    return parseFloat((peso / Math.pow(altura / 100, 2)).toFixed(2));
  }

  private prepareConsultaData(consulta: ConsultaInput): any {
    return {
      idPaciente: consulta.id_paciente,
      motivoConsulta: consulta.motivo_consulta,
      fechaConsulta: consulta.fecha_consulta,
      peso: consulta.peso || null,
      altura: consulta.altura || null,
      frecuenciaCardiaca: consulta.frecuencia_cardiaca || null,
      presionArterial: consulta.presion_arterial || null,
      idAntecedente: consulta.id_antecedente || null,
      idEpisodio: consulta.id_episodio || null,
      idLaboratorio: consulta.id_laboratorio || null,
      idExamenFisico: consulta.id_examen_fisico || null,
      idDiagnostico: consulta.id_diagnostico || null,
      proximaCita: consulta.proxima_cita,
      idPlanTerapeutico: consulta.id_plan_terapeutico || null
    };
  }

  private handleError(context: string, error: any): never {
    console.error(`${context}:`, error);
    throw new Error(`${context}. Ver consola para más detalles.`);
  }

  // Método adicional para formatear signos vitales
  formatearSignosVitales(consulta: Consulta): string {
    const partes = [];
    if (consulta.peso) partes.push(`Peso: ${consulta.peso} kg`);
    if (consulta.altura) partes.push(`Altura: ${consulta.altura} cm`);
    if (consulta.presion_arterial) partes.push(`PA: ${consulta.presion_arterial}`);
    if (consulta.frecuencia_cardiaca) partes.push(`FC: ${consulta.frecuencia_cardiaca} lpm`);
    if (this.calcularIMC(consulta.peso, consulta.altura)) {
      partes.push(`IMC: ${this.calcularIMC(consulta.peso, consulta.altura)}`);
    }
    
    return partes.join(' | ') || 'No registrados';
  }
}