import { Component } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { PacienteInput } from '../../../models/paciente.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-form',
  imports:[FormsModule, CommonModule],
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.scss']
})
export class PacienteFormComponent {
  showMessage = false;
  message = '';
  messageType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  private showNotification(message: string, type: 'success' | 'error' | 'warning') {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;
    
    setTimeout(() => {
      this.showMessage = false;
    }, 5000);
  }

  private validarCampos(form: HTMLFormElement): boolean {
    const camposObligatorios = [
      {id: 'nombre1', nombre: 'Primer Nombre'},
      {id: 'apellido1', nombre: 'Primer Apellido'},
      {id: 'telefono', nombre: 'Teléfono'},
      {id: 'fechaNacimiento', nombre: 'Fecha de Nacimiento'}
    ];

    for (const campo of camposObligatorios) {
      const input = form[campo.id] as HTMLInputElement;
      if (!input.value.trim()) {
        this.showNotification(`El campo ${campo.nombre} es obligatorio`, 'error');
        input.focus();
        return false;
      }
    }

    // Validación específica para teléfono
    const telefono = form['telefono'] as HTMLInputElement;
    if (telefono.value.length !== 8 || !/^\d+$/.test(telefono.value)) {
      this.showNotification('El teléfono debe tener exactamente 8 dígitos', 'error');
      telefono.focus();
      return false;
    }

    return true;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (!this.validarCampos(form)) return;

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
      next: () => {
        this.showNotification('Paciente guardado correctamente', 'success');
        setTimeout(() => this.router.navigate(['/pacientes']), 1500);
      },
      error: (err) => {
        this.showNotification('Error al guardar paciente: ' + err.message, 'error');
      }
    });
  }

  guardarYRedireccionar(event: Event) {
    event.preventDefault();
    const form = document.querySelector('form') as HTMLFormElement;

    if (!this.validarCampos(form)) return;

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
          this.showNotification('Paciente guardado correctamente', 'success');
          setTimeout(() => {
            this.router.navigate(['/consultas-temporales/registro'], { 
              queryParams: { id_paciente: idPaciente } 
            });
          }, 1500);
        } else {
          this.showNotification('Paciente guardado, pero no se pudo obtener el ID', 'warning');
          setTimeout(() => this.router.navigate(['/pacientes']), 1500);
        }
      },
      error: (err) => {
        this.showNotification('Error al guardar paciente: ' + err.message, 'error');
      }
    });
  }

  volverAPerfil(): void {
    this.router.navigate(['pacientes']);
  }
}