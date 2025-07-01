import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { ConsultaTemporalService } from '../../../services/consulta-temporal.service';
import { Router } from '@angular/router';
import { Paciente } from '../../../models/paciente.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registroconsultas',
  imports: [FormsModule, CommonModule],
  templateUrl: './registroconsultas.component.html',
  styleUrls: ['./registroconsultas.component.scss']
})
export class RegistroConsultaTemporalComponent implements OnInit {
  pacientes: Paciente[] = [];
  cargando = true;
  error: string | null = null;
  showMessage = false;
  message = '';
  messageType: 'success' | 'error' | 'warning' = 'success';

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idPacienteParam = params['id_paciente'];
      if (idPacienteParam) {
        this.formData.id_paciente = Number(idPacienteParam);
      }
      this.cargarPacientes();
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning') {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;
    
    setTimeout(() => {
      this.showMessage = false;
    }, 5000);
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
        this.showNotification('Error al cargar la lista de pacientes', 'error');
      }
    });
  }

  validarCampos(): boolean {
    const camposObligatorios = [
      { campo: 'id_paciente', nombre: 'Paciente' },
      { campo: 'motivo_consulta', nombre: 'Motivo de la Consulta' },
      { campo: 'proxima_cita', nombre: 'Próxima Cita' }
    ];

    for (const item of camposObligatorios) {
      if (!this.formData[item.campo as keyof typeof this.formData]) {
        this.showNotification(`El campo ${item.nombre} es obligatorio`, 'error');
        return false;
      }
    }

    // Validación adicional para fecha de próxima cita
    if (this.formData.proxima_cita) {
      const proximaCitaDate = new Date(this.formData.proxima_cita);
      const fechaConsultaDate = new Date(this.formData.fecha_consulta);
      
      if (proximaCitaDate < fechaConsultaDate) {
        this.showNotification('La fecha de próxima cita no puede ser anterior a la fecha de consulta', 'error');
        return false;
      }
    }

    return true;
  }

  registrarConsulta(): void {
    if (!this.validarCampos()) {
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

    this.consultaService.crear(datosParaInsertar).subscribe({
      next: (id) => {
        this.showNotification('Consulta registrada exitosamente', 'success');
        setTimeout(() => {
          this.router.navigate(['/consultas-temporales']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al registrar consulta:', err);
        this.showNotification('Error al registrar la consulta: ' + (err.message || 'Por favor intente nuevamente'), 'error');
      }
    });
  }

  private formatoFechaRust(fecha: string): string {
    return `${fecha} 12:00:00`;
  }

  cancelarConsulta(): void {
    this.router.navigate(['/consultas']);
  }
}

