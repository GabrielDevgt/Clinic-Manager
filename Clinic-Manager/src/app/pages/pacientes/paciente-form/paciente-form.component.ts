import { Component } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { PacienteInput } from '../../../models/paciente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.scss']
})
export class PacienteFormComponent {

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  // Guardar solo al paciente (formulario normal)
  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    const paciente: PacienteInput = {
      nombre_1: (form['nombre1'] as HTMLInputElement).value,
      nombre_2: (form['nombre2'] as HTMLInputElement).value,
      nombre_3: (form['nombre3'] as HTMLInputElement)?.value || '',
      apellido_1: (form['apellido1'] as HTMLInputElement).value,
      apellido_2: (form['apellido2'] as HTMLInputElement).value,
      apellido_casado: (form['apellidoCasado'] as HTMLInputElement).value,
      fecha_nacimiento: (form['fechaNacimiento'] as HTMLInputElement).value,
      direccion: (form['direccion'] as HTMLInputElement).value,
      telefono: (form['telefono'] as HTMLInputElement).value,
      genero: (form['genero'] as HTMLSelectElement).value as 'Masculino' | 'Femenino' | 'Otro'
    };
    
    this.pacienteService.insertarPaciente(paciente).subscribe({
      next: (mensaje) => {
        alert(mensaje);
        form.reset();
      },
      error: (err) => {
        alert('Error al guardar paciente: ' + err);
      }
    });
  }

  guardarYRedireccionar(event: Event) {
  event.preventDefault();
  const form = document.querySelector('form') as HTMLFormElement;

  const paciente: PacienteInput = {
    nombre_1: (form['nombre1'] as HTMLInputElement).value,
    nombre_2: (form['nombre2'] as HTMLInputElement).value,
    nombre_3: (form['nombre3'] as HTMLInputElement)?.value || '',
    apellido_1: (form['apellido1'] as HTMLInputElement).value,
    apellido_2: (form['apellido2'] as HTMLInputElement).value,
    apellido_casado: (form['apellidoCasado'] as HTMLInputElement).value,
    fecha_nacimiento: (form['fechaNacimiento'] as HTMLInputElement).value,
    direccion: (form['direccion'] as HTMLInputElement).value,
    telefono: (form['telefono'] as HTMLInputElement).value,
    genero: (form['genero'] as HTMLSelectElement).value as 'Masculino' | 'Femenino' | 'Otro'
  };

  this.pacienteService.insertarPaciente(paciente).subscribe({
    next: (idPaciente) => {
      if (idPaciente) {
        this.router.navigate(['/consultas-temporales/registro'], { queryParams: { id_paciente: idPaciente } });

      } else {
        alert('Paciente guardado, pero no se pudo obtener el ID');
      }
    },
    error: (err) => {
      alert('Error al guardar paciente: ' + err);
    }
  });
}


  // Cancelar y volver a la lista
  volverAPerfil(): void {
    this.router.navigate(['pacientes']);
  }
}
