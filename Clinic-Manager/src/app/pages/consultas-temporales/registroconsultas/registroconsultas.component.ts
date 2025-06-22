import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../services/paciente.service';
import { ConsultaTemporalService } from '../../../services/consulta-temporal.service';
import { Paciente } from '../../../models/paciente.model';
import { Router } from '@angular/router';
import { ConsultaTemporal } from '../../../models/consulta-temporal.model';

@Component({
  selector: 'app-registroconsultas',
  imports: [CommonModule],
  templateUrl: './registroconsultas.component.html',
  styleUrl: './registroconsultas.component.scss'
})
export class RegistroConsultaTemporalComponent implements OnInit {
  pacientes: Paciente[] = [];
  fechaHoy: string = '';
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private pacienteService: PacienteService,
    private consultaService: ConsultaTemporalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toISOString().split('T')[0];
    this.obtenerPacientes();
  }

  obtenerPacientes(): void {
    this.cargando = true;
    this.pacienteService.obtenerPacientes().subscribe({
      next: data => {
        this.pacientes = data;
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error al cargar los pacientes.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

registrarConsulta(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  // Objeto sin id_consulta (lo genera la BD)
  const consultaData = {
    id_paciente: Number(formData.get('id_paciente')),
    motivo_consulta: String(formData.get('motivo_consulta')),
    fecha_consulta: String(formData.get('fecha_consulta')),
    peso: this.toNullableNumber(formData.get('peso')),
    altura: this.toNullableNumber(formData.get('altura')),
    frecuencia_cardiaca: this.toNullableNumber(formData.get('frecuencia_cardiaca')),
    presion_arterial: this.toNullableString(formData.get('presion_arterial')),
    Antecedente: this.toNullableString(formData.get('antecedente')),
    Enfermedades: this.toNullableString(formData.get('enfermedades')),
    Laboratorio: this.toNullableString(formData.get('laboratorio')),
    Examen_fisico: this.toNullableString(formData.get('examen_fisico')),
    Diagnostico: this.toNullableString(formData.get('diagnostico')),
    proxima_cita: String(formData.get('proxima_cita')),
    Plan_terapeutico: this.toNullableString(formData.get('plan_terapeutico'))
  };

  this.consultaService.crearConsultaTemporal(consultaData).subscribe({
    next: () => {
      alert('Consulta registrada exitosamente');
      this.router.navigate(['/consultas-temporales']);
    },
    error: err => {
      alert('Error al registrar la consulta');
      console.error(err);
    }
  });
}
  cancelarConsulta(): void {
    this.router.navigate(['/consultas-temporales']);
  }

  private toNullableNumber(value: FormDataEntryValue | null): number | null {
    if (!value) return null;
    const val = Number(value);
    return isNaN(val) ? null : val;
  }

  private toNullableString(value: FormDataEntryValue | null): string | null {
    if (!value) return null;
    const str = String(value).trim();
    return str === '' ? null : str;
  }
}