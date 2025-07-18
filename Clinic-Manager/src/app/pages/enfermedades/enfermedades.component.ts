import { Component, OnInit } from '@angular/core';
import { EnfermedadService } from '../../services/enfermedad.service';
import { CategoriaEnfermedadService } from '../../services/categoria-enfermedad.service';
import { Enfermedad } from '../../models/enfermedad.model';
import { CategoriaEnfermedad } from '../../models/categoria-enfermedad.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface NuevaEnfermedad {
  nombre: string;
  id_categoria_enfermedades: number | null;
  es_cronica: boolean;
}

@Component({
  selector: 'app-enfermedad',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './enfermedades.component.html',
  styleUrls: ['./enfermedades.component.scss']
})
export class EnfermedadComponent implements OnInit {
  enfermedades: Enfermedad[] = [];
  categorias: CategoriaEnfermedad[] = [];
  
  nuevaEnfermedad: NuevaEnfermedad = {
    nombre: '',
    id_categoria_enfermedades: null,
    es_cronica: false
  };

  editandoId: number | null = null;
  enfermedadEditando: Omit<Enfermedad, 'id_enfermedad'> & { id_enfermedad?: number } = {
    nombre: '',
    id_categoria_enfermedades: null,
    es_cronica: false
  };

  constructor(
    private enfermedadService: EnfermedadService,
    private categoriaService: CategoriaEnfermedadService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar enfermedades
    this.enfermedadService.obtenerEnfermedades().subscribe({
      next: (data) => {
        this.enfermedades = data;
      },
      error: (err) => console.error('Error cargando enfermedades:', err)
    });

    // Cargar categorías
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  obtenerNombreCategoria(id: number | null): string {
    if (id === null) return 'N/A';
    const categoria = this.categorias.find(c => c.id_categoria_enfermedades === id);
    return categoria ? categoria.nombre_catenfermedades : 'N/A';
  }

  agregarEnfermedad(): void {
    if (!this.nuevaEnfermedad.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    this.enfermedadService.crearEnfermedad(
      this.nuevaEnfermedad.nombre,
      this.nuevaEnfermedad.id_categoria_enfermedades,
      this.nuevaEnfermedad.es_cronica
    ).subscribe({
      next: () => {
        this.cargarDatos();
        this.nuevaEnfermedad = { 
          nombre: '', 
          id_categoria_enfermedades: null, 
          es_cronica: false 
        };
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al crear enfermedad');
      }
    });
  }

  iniciarEdicion(enfermedad: Enfermedad): void {
    this.editandoId = enfermedad.id_enfermedad;
    this.enfermedadEditando = {
      nombre: enfermedad.nombre,
      id_categoria_enfermedades: enfermedad.id_categoria_enfermedades,
      es_cronica: enfermedad.es_cronica
    };
  }

  guardarEdicion(): void {
    if (!this.editandoId || !this.enfermedadEditando.nombre.trim()) {
      alert('Datos incompletos para edición');
      return;
    }

    this.enfermedadService.actualizarEnfermedad(
      this.editandoId,
      this.enfermedadEditando.nombre,
      this.enfermedadEditando.id_categoria_enfermedades,
      this.enfermedadEditando.es_cronica
    ).subscribe({
      next: () => {
        this.cargarDatos();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al actualizar enfermedad');
      }
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.enfermedadEditando = {
      nombre: '',
      id_categoria_enfermedades: null,
      es_cronica: false
    };
  }

  eliminarEnfermedad(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta enfermedad?')) {
      return;
    }

    this.enfermedadService.eliminarEnfermedad(id).subscribe({
      next: () => {
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al eliminar enfermedad');
      }
    });
  }
}