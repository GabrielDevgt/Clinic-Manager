import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteInput } from '../../../models/paciente.model';
import { PacienteService } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-editar-paciente',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-paciente.component.html',
  styleUrl: './editar-paciente.component.scss'
})
export class EditarPacienteComponent implements OnInit {
  pacienteId!: number;
  paciente: PacienteInput = {
    nombre_1: '',
    nombre_2: '',
    nombre_3: '',
    apellido_1: '',
    apellido_2: '',
    apellido_casado: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    genero: 'Masculino'
  };
  isLoading = true;
  isSaving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteId = +id;
      this.cargarPaciente(this.pacienteId);
    } else {
      this.error = 'No se proporcionó ID de paciente';
      this.isLoading = false;
    }
  }

  cargarPaciente(id: number): void {
    this.isLoading = true;
    this.pacienteService.obtenerPacientePorId(id).subscribe({
      next: (data) => {
        this.paciente = {
          nombre_1: data.nombre_1,
          nombre_2: data.nombre_2,
          nombre_3: data.nombre_3 || '',
          apellido_1: data.apellido_1,
          apellido_2: data.apellido_2 || '',
          apellido_casado: data.apellido_casado || '',
          fecha_nacimiento: data.fecha_nacimiento.split('T')[0], // Formato YYYY-MM-DD
          direccion: data.direccion,
          telefono: data.telefono,
          genero: data.genero
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar paciente: ' + err;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.pacienteService.validarTelefono(this.paciente.telefono)) {
      this.error = 'El teléfono debe tener al menos 8 dígitos numéricos';
      return;
    }

    this.isSaving = true;
    this.error = null;

    this.pacienteService.actualizarPaciente(this.pacienteId, this.paciente).subscribe({
      next: () => {
        this.router.navigate(['/paciente', this.pacienteId]);
      },
      error: (err) => {
        this.error = 'Error al actualizar paciente: ' + err;
        this.isSaving = false;
      }
    });
  }

  volverAPerfil(): void {
    this.router.navigate(['pacientes/detalle', this.pacienteId]);
  }
}