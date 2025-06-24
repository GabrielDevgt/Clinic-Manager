import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { Enfermedad } from '../models/enfermedad.model';

@Injectable({
  providedIn: 'root'
})
export class EnfermedadService {
  constructor() { }

  obtenerEnfermedades(): Observable<Enfermedad[]> {
    return from(invoke<Enfermedad[]>('obtener_enfermedades'));
  }

  crearEnfermedad(nombre: string, id_categoria: number | null, esCronica: boolean): Observable<string> {
    return from(invoke<string>('crear_enfermedad', { 
      nombre: nombre,
      id_categoria: id_categoria,
      esCronica: esCronica  // <-- Nombre exacto que espera Rust
    }));
  }

actualizarEnfermedad(
  id: number, 
  nombre: string, 
  id_categoria: number | null, 
  esCronica: boolean  // Cambiado de es_cronica a esCronica
): Observable<string> {
  return from(invoke<string>('actualizar_enfermedad', {
    id,
    nombre,
    id_categoria,
    esCronica  // Nombre debe coincidir exactamente con Rust
  }));
}

  eliminarEnfermedad(id_enfermedad: number): Observable<string> {
    return from(invoke<string>('eliminar_enfermedad', { 
      id: id_enfermedad 
    }));
  }
}