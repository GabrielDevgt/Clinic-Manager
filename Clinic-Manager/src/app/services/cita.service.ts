import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Cita } from '../models/cita.model';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  obtenerProximasCitas(): Observable<Cita[]> {
    return from(invoke<Cita[]>('get_proximas_citas'));
  }
}
