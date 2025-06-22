import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaTemporal } from '../../../models/consulta-temporal.model';
import { Paciente } from '../../../models/paciente.model';
import { ConsultaTemporalService } from '../../../services/consulta-temporal.service';
import { PacienteService } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detalles',
  imports:[CommonModule, FormsModule],
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
      const id = Number(params.get('id'));
      this.cargarConsulta(id);
    });
  }

  cargarConsulta(id: number): void {
    this.consultaService.obtenerConsultaPorId(id).subscribe({
      next: (consulta) => {
        this.consulta = consulta;
        this.cargarPaciente(consulta.id_paciente);
      },
      error: (err) => {
        this.error = 'Error al cargar la consulta: ' + err.message;
        this.cargando = false;
      }
    });
  }

  cargarPaciente(idPaciente: number): void {
    this.pacienteService.obtenerPacientePorId(idPaciente).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el paciente: ' + err.message;
        this.cargando = false;
      }
    });
  }

  obtenerNombrePaciente(): string {
    if (!this.paciente) return 'Paciente no encontrado';
    
    const nombres = [
      this.paciente.nombre_1, 
      this.paciente.nombre_2, 
      this.paciente.nombre_3
    ].filter(n => n).join(' ');
    
    const apellidos = [
      this.paciente.apellido_1, 
      this.paciente.apellido_2, 
      this.paciente.apellido_casado
    ].filter(a => a).join(' ');
    
    return `${nombres} ${apellidos}`.trim();
  }

  volverALista(): void {
    this.router.navigate(['consultas']);
  }

  editarConsulta(): void {
    if (this.consulta) {
      this.router.navigate(['/consultas-temporales/editar', this.consulta.id_consulta]);
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return 'No disponible';
    
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fecha;
    }
  }

  // Método para formatear campos específicos de tu modelo
  formatearCampo(valor: any, campo: string): string {
    if (valor === undefined || valor === null) {
      return 'No especificado';
    }
    
    // Formateo especial para algunos campos
    switch(campo) {
      case 'peso':
        return `${valor} kg`;
      case 'altura':
        return `${valor} cm`;
      case 'temperatura':
        return `${valor} °C`;
      case 'frecuencia_cardiaca':
        return `${valor} lpm`;
      default:
        return valor.toString();
    }
  }
}