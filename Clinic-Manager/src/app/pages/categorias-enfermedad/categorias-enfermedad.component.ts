import { Component, OnInit } from '@angular/core';
import { CategoriaEnfermedadService } from '../../services/categoria-enfermedad.service';
import { CategoriaEnfermedad } from '../../models/categoria-enfermedad.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-enfermedad',
  imports: [FormsModule, CommonModule],
  templateUrl: './categorias-enfermedad.component.html',
  styleUrls: ['./categorias-enfermedad.component.scss']
})
export class CategoriaEnfermedadComponent implements OnInit {
  categorias: CategoriaEnfermedad[] = [];
  nuevaCategoriaNombre = '';
  editandoId: number | null = null;
  editandoNombre = '';

  constructor(private categoriaService: CategoriaEnfermedadService) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  agregarCategoria(): void {
    if (!this.nuevaCategoriaNombre.trim()) return;

    this.categoriaService.crearCategoria(this.nuevaCategoriaNombre).subscribe({
      next: () => {
        this.cargarCategorias();
        this.nuevaCategoriaNombre = '';
      },
      error: (err) => console.error('Error creando categoría:', err)
    });
  }

  iniciarEdicion(categoria: CategoriaEnfermedad): void {
    this.editandoId = categoria.id_categoria_enfermedades;
    this.editandoNombre = categoria.nombre_catenfermedades;
  }

  guardarEdicion(): void {
    if (!this.editandoId || !this.editandoNombre.trim()) return;

    this.categoriaService.actualizarCategoria(this.editandoId, this.editandoNombre).subscribe({
      next: () => {
        this.cargarCategorias();
        this.cancelarEdicion();
      },
      error: (err) => console.error('Error actualizando categoría:', err)
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editandoNombre = '';
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => this.cargarCategorias(),
        error: (err) => console.error('Error eliminando categoría:', err)
      });
    }
  }
}