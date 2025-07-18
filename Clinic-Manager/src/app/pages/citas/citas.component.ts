import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita.service';
import localeEs from '@angular/common/locales/es';

// Registra el locale español solo para este componente
registerLocaleData(localeEs);

@Component({
  selector: 'app-citas',
  imports: [FormsModule, CommonModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  providers: [
    DatePipe, // Asegúrate de incluir DatePipe en los providers
    { provide: LOCALE_ID, useValue: 'es' } // Configura el locale español
  ]
})
export class CitasComponent implements OnInit {
 citas: Cita[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.citaService.obtenerProximasCitas().subscribe({
      next: data => {
        this.citas = data;
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error cargando las citas';
        this.cargando = false;
      }
    });
  }

 cambiarEstado(cita: Cita, event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const nuevoEstado = selectElement.value;
  console.log('Nuevo estado seleccionado:', nuevoEstado); // 🔍

  if (!nuevoEstado) return;

  if (nuevoEstado === 'Cancelada') {
    this.citaService.eliminarCita(cita.id_cita).subscribe(() => {
      this.citas = this.citas.filter(c => c.id_cita !== cita.id_cita);
    });
  } else if (nuevoEstado === 'Atendida') {
  this.citaService.actualizarEstadoCita(cita.id_cita, nuevoEstado).subscribe(() => {
    const index = this.citas.findIndex(c => c.id_cita === cita.id_cita);
    if (index !== -1) {
      this.citas[index] = { ...this.citas[index], estado_cita: nuevoEstado };
    }
  });
}

}




}
