import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  constructor() { }

  obtenerProximasCitas(): Observable<Cita[]> {
    return from(
      invoke<Cita[]>('obtener_proximas_citas')
        .then(res => res)
        .catch(error => this.handleError('Error al obtener citas', error))
    );
  }

  private handleError(context: string, error: any): never {
    console.error(`${context}:`, error);
    throw new Error(`${context}. Error: ${error.message || error}`);
  }
}