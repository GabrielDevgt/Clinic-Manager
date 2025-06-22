import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citas',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.cargarProximasCitas();
  }

  cargarProximasCitas(): void {
    this.cargando = true;
    this.error = null;

    this.citaService.obtenerProximasCitas().subscribe({
      next: (citas) => {
        this.citas = citas;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las próximas citas';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  formatearFecha(fecha: string): string {
    try {
      return new Date(fecha).toLocaleDateString('es-GT', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  }
}