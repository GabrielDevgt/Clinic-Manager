import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pacientes',
  imports: [],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {
  constructor(
    private router: Router,
  ) {}
  // Navegación
  irANuevoPaciente() {
    this.router.navigate(['/pacientes/nuevo']);
  
}
 
}
