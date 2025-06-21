import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente.model';
// Importa la interfaz

  @Component({
    selector: 'app-registro-consulta',
    imports: [CommonModule],
    templateUrl: './registro-consulta.component.html',
    styleUrl: './registro-consulta.component.scss'
  })
export class RegistroConsultaComponent implements OnInit {
  pacientes: Paciente[] = []; // Usa la interfaz Paciente
  fechaHoy: string = '';
  cargando: boolean = true;
  error: string | null = null;

  // Inyecta el servicio en el constructor
  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    // Obtener fecha actual
    const hoy = new Date();
    this.fechaHoy = hoy.toISOString().split('T')[0];

    // Obtener pacientes reales
    this.obtenerPacientesReales();
  }

  obtenerPacientesReales(): void {
    this.cargando = true;
    this.error = null;

    this.pacienteService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pacientes';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  // El resto de tus métodos permanece igual
  registrarConsulta(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const datos = {
      id_paciente: formData.get('id_paciente'),
      motivo_consulta: formData.get('motivo_consulta'),
      fecha_consulta: this.fechaHoy,
      peso: formData.get('peso'),
      altura: formData.get('altura'),
      frecuencia_cardiaca: formData.get('frecuencia_cardiaca'),
      presion_arterial: formData.get('presion_arterial'),
      id_diagnostico: formData.get('id_diagnostico') || null,
      diagnostico_custom: formData.get('diagnostico_custom') || null,
      proxima_cita: formData.get('proxima_cita')
    };

    console.log('Datos de la consulta:', datos);
  }

  cancelarConsulta(): void {
    console.log('Consulta cancelada');
  }
  }