import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultaTemporalService } from '../../services/consulta-temporal.service';
import { PacienteService } from '../../services/paciente.service';
import { ConsultaTemporal } from '../../models/consulta-temporal.model';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-consultas-temporales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas-temporales.component.html',
  styleUrls: ['./consultas-temporales.component.scss']
})
export class ConsultasTemporalesComponent implements OnInit {
  consultas: ConsultaTemporal[] = [];
  consultasFiltradas: ConsultaTemporal[] = [];
  pacientes: Paciente[] = [];
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

    forkJoin({
      pacientes: this.pacienteService.obtenerPacientes(),
      consultas: this.consultaService.obtenerTodas()
    }).subscribe({
      next: ({ pacientes, consultas }) => {
        this.pacientes = pacientes;
        this.consultas = consultas;
        this.consultasFiltradas = [...consultas];
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda = input.value.toLowerCase();
    this.filtrarConsultas();
  }

  filtrarConsultas(): void {
    if (!this.terminoBusqueda.trim()) {
      this.consultasFiltradas = [...this.consultas];
      return;
    }

    this.consultasFiltradas = this.consultas.filter(consulta => {
      const paciente = this.pacientes.find(p => p.id_paciente === consulta.id_paciente);
      const nombrePaciente = paciente ? 
        this.pacienteService.obtenerNombreCompleto(paciente).toLowerCase() : '';
      
      const camposBusqueda = [
        nombrePaciente,
        consulta.motivo_consulta.toLowerCase(),
        this.formatearFecha(consulta.fecha_consulta).toLowerCase(),
        consulta.diagnostico?.toLowerCase() || '',
        consulta.antecedente?.toLowerCase() || ''
      ];

      return camposBusqueda.some(campo => campo.includes(this.terminoBusqueda));
    });
  }

  obtenerNombrePaciente(id: number): string {
    const paciente = this.pacientes.find(p => p.id_paciente === id);
    return paciente ? this.pacienteService.obtenerNombreCompleto(paciente) : 'Paciente no encontrado';
  }

formatearFecha(fecha: string): string {
  if (!fecha) return 'No especificada';

  try {
    const fechaObj = new Date(fecha.includes('T') ? fecha : fecha.replace(' ', 'T'));
    return fechaObj.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  } catch {
    return fecha;
  }
}


  verDetalles(id: number): void {
    this.router.navigate(['/consultas-temporales/detalles', id]);
  }

  editarConsulta(id: number): void {
    this.router.navigate(['/consultas-temporales/editar', id]);
  }

  irANuevaConsulta(): void {
    this.router.navigate(['consultas-temporales/registro']);
  }

  refrescar(): void {
    this.cargarDatos();
  }

  trackByConsultaId(index: number, consulta: ConsultaTemporal): number {
    return consulta.id_consulta ?? index;
  }
}