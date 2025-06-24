import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { Episodio } from '../models/episodio.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodioService {
  constructor() { }

  obtenerPorPaciente(idPaciente: number): Observable<Episodio[]> {
    return from(invoke<Episodio[]>('obtener_episodios_por_paciente', { idPaciente }));
  }

  obtenerPorId(idEpisodio: number): Observable<Episodio> {
    return from(invoke<Episodio>('obtener_episodio_por_id', { idEpisodio }));
  }

  crear(episodio: Omit<Episodio, 'id_episodio'>): Observable<number> {
    return from(invoke<number>('crear_episodio', episodio));
  }

   actualizar(episodio: Episodio): Observable<boolean> {
    const payload = {
      id_episodio: episodio.id_episodio,
      id_enfermedad: episodio.id_enfermedad,
      fecha_inicio: episodio.fecha_inicio,
      fecha_fin: episodio.fecha_fin || null, // Convertir undefined a null
      sintomas: episodio.sintomas || null    // Convertir undefined a null
    };
    return from(invoke<boolean>('actualizar_episodio', payload));
  }

  eliminar(idEpisodio: number): Observable<boolean> {
    return from(invoke<boolean>('eliminar_episodio', { id_episodio: idEpisodio }));
  }
}