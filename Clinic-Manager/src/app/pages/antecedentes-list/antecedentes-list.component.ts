import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AntecedenteView } from '../../models/antecedentes.model';
import { AntecedenteService } from '../../services/antecedentes.service';

@Component({
  selector: 'app-antecedentes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './antecedentes-list.component.html',
  styleUrls: ['./antecedentes-list.component.scss']
})
export class AntecedentesListComponent implements OnInit {
  antecedentes: AntecedenteView[] = [];
  cargando = true;

  constructor(private antecedenteService: AntecedenteService) {}

  ngOnInit(): void {
    this.cargarAntecedentes();
  }

  cargarAntecedentes(): void {
    this.cargando = true;
    this.antecedenteService.obtenerAntecedentes().subscribe({
      next: (data) => {
        this.antecedentes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando antecedentes:', err);
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}