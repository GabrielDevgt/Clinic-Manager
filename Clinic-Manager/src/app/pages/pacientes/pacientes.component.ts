import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Paciente } from '../../models/paciente.model';
import { PacienteService } from '../../services/paciente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit, OnDestroy {
  pacientes: Paciente[] = [];
  cargando = false;
  error: string | null = null;
  pacienteFiltrado: Paciente[] = [];
  terminoBusqueda = '';
 


  private destroy$ = new Subject<void>();

  constructor(private pacienteService: PacienteService, private router: Router) { } 
    // Navegación
  irANuevoPaciente() {
    this.router.navigate(['/pacientes/nuevo']);
  
}

  ngOnInit(): void {
    this.cargarPacientes();
  }
   
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga la lista de pacientes desde la base de datos
   */
  cargarPacientes(): void {
    this.cargando = true;
    this.error = null;

    this.pacienteService.obtenerPacientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pacientes) => {
          this.pacientes = pacientes;
          this.pacienteFiltrado = [...pacientes];
          this.cargando = false;
          console.log(`Se cargaron ${pacientes.length} pacientes`);
        },
        error: (error) => {
          this.error = 'Error al cargar los pacientes: ' + error;
          this.cargando = false;
          console.error('Error cargando pacientes:', error);
        }
      });
  }

  /**
   * Filtra pacientes por término de búsqueda
   * @param termino Término de búsqueda
   */
  filtrarPacientes(termino: string): void {
    this.terminoBusqueda = termino.toLowerCase();
    
    if (!this.terminoBusqueda.trim()) {
      this.pacienteFiltrado = [...this.pacientes];
      return;
    }

    this.pacienteFiltrado = this.pacientes.filter(paciente => {
      const nombreCompleto = this.pacienteService.obtenerNombreCompleto(paciente).toLowerCase();
      const telefono = paciente.telefono.toLowerCase();
      const direccion = paciente.direccion.toLowerCase();
      
      return nombreCompleto.includes(this.terminoBusqueda) ||
             telefono.includes(this.terminoBusqueda) ||
             direccion.includes(this.terminoBusqueda);
    });
  }

  /**
   * Obtiene el nombre completo del paciente
   * @param paciente Objeto paciente
   * @returns Nombre completo
   */
  obtenerNombreCompleto(paciente: Paciente): string {
    return this.pacienteService.obtenerNombreCompleto(paciente);
  }

  /**
   * Formatea la fecha de registro
   * @param fecha Fecha a formatear
   * @returns Fecha formateada
   */
  formatearFecha(fecha?: string): string {
    return this.pacienteService.formatearFechaRegistro(fecha);
  }

  /**
   * Refresca la lista de pacientes
   */
  refrescar(): void {
    this.cargarPacientes();
  }

  /**
   * Obtiene el color de fondo según el género
   * @param genero Género del paciente
   * @returns Clase CSS
   */
  obtenerColorGenero(genero: string): string {
    switch (genero) {
      case 'Masculino':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'Femenino':
        return 'bg-pink-50 border-l-4 border-pink-400';
      case 'Otro':
        return 'bg-purple-50 border-l-4 border-purple-400';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400';
    }
  }

  /**
   * Método para manejar cambios en el input de búsqueda
   * @param value Valor del input
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtrarPacientes(target.value);
  }

  /**
   * TrackBy function para optimizar el rendimiento del *ngFor
   * @param index Índice del elemento
   * @param paciente Objeto paciente
   * @returns ID único del paciente
   */
  trackByPacienteId(index: number, paciente: Paciente): number {
    return paciente.id_paciente;
  }
}