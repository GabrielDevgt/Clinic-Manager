import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaTemporal } from '../../../models/consulta-temporal.model';
import { Paciente } from '../../../models/paciente.model';
import { ConsultaTemporalService } from '../../../services/consulta-temporal.service';
import { PacienteService } from '../../../services/paciente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalles',
  imports:[FormsModule, CommonModule],
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetalleConsultaComponent implements OnInit {
  consulta: ConsultaTemporal | null = null;
  paciente: Paciente | null = null;
  error: string | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaService: ConsultaTemporalService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id || isNaN(+id)) {
        this.error = 'ID de consulta inválido';
        this.cargando = false;
        return;
      }
      this.cargarConsulta(+id);
    });
  }

  cargarConsulta(id: number): void {
    this.consultaService.obtenerPorId(id).subscribe({
      next: (consulta) => {
        this.consulta = consulta;
        if (this.consulta) {
          this.cargarPaciente(this.consulta.id_paciente);
        } else {
          this.error = 'No se encontró la consulta solicitada';
          this.cargando = false;
        }
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de la consulta';
        console.error('Error al cargar consulta:', err);
        this.cargando = false;
      }
    });
  }

  cargarPaciente(idPaciente: number): void {
    this.pacienteService.obtenerPacientePorId(idPaciente).subscribe({
      next: (paciente) => {
        this.paciente = paciente || null;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del paciente';
        console.error('Error al cargar paciente:', err);
        this.cargando = false;
      }
    });
  }

  obtenerNombrePaciente(): string {
    if (!this.paciente) return 'Paciente no encontrado';
    
    return [
      this.paciente.nombre_1,
      this.paciente.nombre_2,
      this.paciente.apellido_1,
      this.paciente.apellido_2
    ]
    .filter(nombre => nombre !== null && nombre !== undefined)
    .join(' ');
  }

  volverALista(): void {
    this.router.navigate(['consultas']);
  }

  formatearFecha(fechaString?: string | null): string {
    if (!fechaString) return 'No especificada';
    
    try {
      // Elimina la parte de la hora si existe
      const fechaPart = fechaString.split(' ')[0];
      const [year, month, day] = fechaPart.split('-');
      const fecha = new Date(+year, +month - 1, +day);
      
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return 'Fecha inválida';
    }
  }
}