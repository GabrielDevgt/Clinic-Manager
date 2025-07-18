import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConsultaService } from '../../services/consulta.service';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-consultas',
  imports: [CommonModule],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.scss'
})
export class ConsultaComponent implements OnInit {
  consultas: any[] = [];
  consultasFiltradas: any[] = [];
  pacientes: any[] = [];
  cargando: boolean = true;
  error: string | null = null;
  terminoBusqueda: string = '';

  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = null;

    // Cargar pacientes primero
    this.pacienteService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        // Luego cargar consultas
        this.cargarConsultas();
      },
      error: (err) => {
        this.error = 'Error al cargar los pacientes';
        this.cargando = false;
        console.error('Error cargando pacientes:', err);
      }
    });
  }

  cargarConsultas(): void {
    this.consultaService.obtenerConsultas().subscribe({
      next: (consultas) => {
        this.consultas = consultas;
        this.consultasFiltradas = [...consultas];
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las consultas';
        this.cargando = false;
        console.error('Error cargando consultas:', err);
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
        this.consultaService.formatearFecha(consulta.fecha_consulta).toLowerCase().includes(this.terminoBusqueda)
      );
    });
  }

  obtenerNombrePaciente(idPaciente: number): string {
    const paciente = this.pacientes.find(p => p.id_paciente === idPaciente);
    return paciente ? this.pacienteService.obtenerNombreCompleto(paciente) : 'Paciente no encontrado';
  }

  formatearFecha(fecha: string): string {
    return this.consultaService.formatearFecha(fecha);
  }

  verDetalles(idConsulta: number): void {
    this.router.navigate(['/consultas/detalle', idConsulta]);
  }

  editarConsulta(idConsulta: number): void {
    this.router.navigate(['/consultas/editar', idConsulta]);
  }

  irANuevaConsulta(): void {
    this.router.navigate(['consultas/registro-consulta']);
  }

  refrescar(): void {
    this.cargando = true;
    this.consultas = [];
    this.consultasFiltradas = [];
    this.cargarDatos();
  }

  trackByConsultaId(index: number, consulta: any): number {
    return consulta.id_consulta;
  }
}
