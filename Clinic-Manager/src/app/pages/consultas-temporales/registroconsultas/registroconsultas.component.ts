import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { ConsultaTemporalService } from '../../../services/consulta-temporal.service';
import { Router } from '@angular/router';
import { Paciente } from '../../../models/paciente.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Añade esta importación

@Component({
  selector: 'app-registroconsultas',
  imports:[ FormsModule, CommonModule],
  templateUrl: './registroconsultas.component.html',
  styleUrls: ['./registroconsultas.component.scss']
})
export class RegistroConsultaTemporalComponent implements OnInit {
  pacientes: Paciente[] = [];
  cargando = true;
  error: string | null = null;

  formData = {
    id_paciente: null as number | null,
    fecha_consulta: new Date().toISOString().split('T')[0],
    motivo_consulta: '',
    peso: null as number | null,
    altura: null as number | null,
    frecuencia_cardiaca: null as number | null,
    presion_arterial: null as string | null,
    antecedente: null as string | null,
    enfermedades: null as string | null,
    laboratorio: null as string | null,
    examen_fisico: null as string | null,
    diagnostico: null as string | null,
    proxima_cita: '',
    plan_terapeutico: null as string | null
  };

  constructor(
    private pacienteService: PacienteService,
    private consultaService: ConsultaTemporalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar pacientes';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  registrarConsulta(): void {
    console.log('Datos del formulario:', this.formData);
    
    if (!this.formData.id_paciente || !this.formData.motivo_consulta || !this.formData.proxima_cita) {
      alert('Por favor complete los campos requeridos (*)');
      return;
    }

    const datosParaInsertar = {
      id_paciente: Number(this.formData.id_paciente),
      motivo_consulta: this.formData.motivo_consulta,
      fecha_consulta: this.formatoFechaRust(this.formData.fecha_consulta),
      peso: this.formData.peso,
      altura: this.formData.altura,
      frecuencia_cardiaca: this.formData.frecuencia_cardiaca,
      presion_arterial: this.formData.presion_arterial,
      antecedente: this.formData.antecedente,
      enfermedades: this.formData.enfermedades,
      laboratorio: this.formData.laboratorio,
      examen_fisico: this.formData.examen_fisico,
      diagnostico: this.formData.diagnostico,
      proxima_cita: this.formatoFechaRust(this.formData.proxima_cita),
      plan_terapeutico: this.formData.plan_terapeutico
    };

    console.log('Datos a enviar al backend:', datosParaInsertar);

    this.consultaService.crear(datosParaInsertar).subscribe({
      next: (id) => {
        alert(`Consulta registrada exitosamente (ID: ${id})`);
        this.router.navigate(['/consultas-temporales']);
      },
      error: (err) => {
        console.error('Error al registrar consulta:', err);
        alert('Error al registrar la consulta: ' + (err.message || 'Por favor intente nuevamente'));
      }
    });
  }

  private formatoFechaRust(fecha: string): string {
    return `${fecha} 12:00:00`;
  }

  cancelarConsulta(): void {
    if(confirm('¿Está seguro que desea cancelar el registro?')) {
      this.router.navigate(['/consultas-temporales']);
    }
  }
}