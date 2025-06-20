import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente.model';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-detalles',
  imports: [CommonModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.scss'
})
export class DetallesComponent implements OnInit{
  paciente: Paciente | null = null;
  error: string | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) { }

ngOnInit(): void {
  this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return this.pacienteService.obtenerPacientePorId(id);
    })
  ).subscribe({
    next: (paciente) => {
      this.paciente = paciente;
      this.cargando = false;
    },
    error: (err) => {
      this.error = 'Error al cargar el paciente: ' + err;
      this.cargando = false;
    }
  });
}

  obtenerNombreCompleto(): string {
    if (!this.paciente) return '';
    
    const nombres = [
      this.paciente.nombre_1, 
      this.paciente.nombre_2, 
      this.paciente.nombre_3
    ].filter(n => n && n.trim() !== '').join(' ');
    
    const apellidos = [
      this.paciente.apellido_1, 
      this.paciente.apellido_2, 
      this.paciente.apellido_casado
    ].filter(a => a && a.trim() !== '').join(' ');
    
    return `${nombres} ${apellidos}`.trim();
  }

  calcularEdad(): string {
    if (!this.paciente?.fecha_nacimiento) return 'N/A';
    
    const fechaNac = new Date(this.paciente.fecha_nacimiento);
    const hoy = new Date();
    
    let meses = (hoy.getFullYear() - fechaNac.getFullYear()) * 12;
    meses += hoy.getMonth() - fechaNac.getMonth();
    
    if (hoy.getDate() < fechaNac.getDate()) {
      meses--;
    }
    
    if (meses < 24) {
      return meses <= 0 ? 'Recién nacido' : `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }
    
    const años = Math.floor(meses / 12);
    return `${años} ${años === 1 ? 'año' : 'años'}`;
  }

  volverALista(): void {
    this.router.navigate(['/pacientes']);
  }

  editarPaciente(): void {
    if (this.paciente) {
      this.router.navigate(['/pacientes/editar', this.paciente.id_paciente]);
    }
  }

  verHistorial(): void {
    if (this.paciente) {
      this.router.navigate(['/pacientes/historial', this.paciente.id_paciente]);
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
}
