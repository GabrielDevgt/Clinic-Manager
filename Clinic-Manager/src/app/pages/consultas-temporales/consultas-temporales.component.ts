import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultaTemporalService } from '../../services/consulta-temporal.service';
import { PacienteService } from '../../services/paciente.service';
import { ConsultaTemporal } from '../../models/consulta-temporal.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultas-temporales',
  standalone: true, // Añadido para Angular 17+
  imports: [FormsModule, CommonModule],
  templateUrl: './consultas-temporales.component.html',
  styleUrl: './consultas-temporales.component.scss'
})
export class ConsultasTemporalesComponent implements OnInit {
  consultas: ConsultaTemporal[] = [];
  consultasFiltradas: ConsultaTemporal[] = [];
  pacientes: any[] = [];
  cargando = true;
  error: string | null = null;
  terminoBusqueda = '';

  constructor(
    private consultaService: ConsultaTemporalService,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = null;

    this.pacienteService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.consultaService.obtenerConsultasTemporales().subscribe({
          next: (consultas) => {
            this.consultas = consultas;
            this.consultasFiltradas = [...consultas];
            this.cargando = false;
          },
          error: (err) => {
            this.error = 'Error al cargar las consultas temporales.';
            this.cargando = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.error = 'Error al cargar los pacientes.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  onSearchInput(event: any): void {
    this.terminoBusqueda = event.target.value.toLowerCase();
    this.filtrarConsultas();
  }

  filtrarConsultas(): void {
    if (!this.terminoBusqueda) {
      this.consultasFiltradas = [...this.consultas];
      return;
    }

    this.consultasFiltradas = this.consultas.filter(consulta => {
      const paciente = this.pacientes.find(p => p.id_paciente === consulta.id_paciente);
      const nombrePaciente = paciente ? this.pacienteService.obtenerNombreCompleto(paciente).toLowerCase() : '';
      return (
        nombrePaciente.includes(this.terminoBusqueda) ||
        consulta.motivo_consulta.toLowerCase().includes(this.terminoBusqueda) ||
        this.formatearFecha(consulta.fecha_consulta).toLowerCase().includes(this.terminoBusqueda)
      );
    });
  }

  obtenerNombrePaciente(id: number): string {
    const paciente = this.pacientes.find(p => p.id_paciente === id);
    return paciente ? this.pacienteService.obtenerNombreCompleto(paciente) : 'Paciente no encontrado';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch {
      return fecha;
    }
  }

  verDetalles(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID de consulta no definido');
      return;
    }
    this.router.navigate(['consultas-temporales/detalles', id]);
  }

  editarConsulta(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID de consulta no definido');
      return;
    }
    this.router.navigate(['/consultas-temporales/editar', id]);
  }

  irANuevaConsulta(): void {
    this.router.navigate(['/consultas-temporales/registro']);
  }

  refrescar(): void {
    this.cargarDatos();
  }

  trackByConsultaId(index: number, consulta: ConsultaTemporal): number {
    // Asumimos que si es undefined, usamos -1 o algún valor que no existirá en la BD
    return consulta.id_consulta ?? -1;
  }
}