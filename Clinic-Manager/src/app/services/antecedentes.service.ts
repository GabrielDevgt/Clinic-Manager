import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { Enfermedad } from '../models/enfermedad.model';

@Injectable({
  providedIn: 'root'
})
export class AntecedenteService {
  
  // Para listar antecedentes
  obtenerAntecedentes(): Observable<any[]> {
    return from(invoke<any[]>('obtener_antecedentes_con_detalles'));
  }

  // Específico para enfermedades crónicas
  obtenerEnfermedadesCronicas(): Observable<Enfermedad[]> {
    return from(invoke<Enfermedad[]>('obtener_enfermedades_cronicas'));
  }
}