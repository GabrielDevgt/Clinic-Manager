import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita.service';


@Component({
  selector: 'app-citas',
  imports:[FormsModule, CommonModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
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
}