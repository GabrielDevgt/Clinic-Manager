import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { CategoriaEnfermedad } from '../models/categoria-enfermedad.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaEnfermedadService {
  constructor() { }

  obtenerCategorias(): Observable<CategoriaEnfermedad[]> {
    return from(invoke<CategoriaEnfermedad[]>('obtener_categorias_enfermedades'));
  }

  crearCategoria(nombre: string): Observable<string> {
    return from(invoke<string>('crear_categoria_enfermedad', { nombre }));
  }

  actualizarCategoria(id: number, nombre: string): Observable<string> {
    return from(invoke<string>('actualizar_categoria_enfermedad', { id, nombre }));
  }

  eliminarCategoria(id: number): Observable<string> {
    return from(invoke<string>('eliminar_categoria_enfermedad', { id }));
  }
}