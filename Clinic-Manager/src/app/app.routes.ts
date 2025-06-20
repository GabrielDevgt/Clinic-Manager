import { Routes } from '@angular/router';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { CitasComponent } from './pages/citas/citas.component';
import { TratamientosComponent } from './pages/tratamientos/tratamientos.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { HomeComponent } from './pages/home/home.component';
import { PacienteFormComponent } from './pages/pacientes/paciente-form/paciente-form.component';
import { DetallesComponent } from './pages/pacientes/detalles/detalles.component';

export const routes: Routes = [
    { path: '', component:HomeComponent},
    { path: 'pacientes', component: PacientesComponent },
    { path: 'consultas', component: ConsultasComponent },
    { path: 'citas', component: CitasComponent },
    { path: 'tratamientos', component: TratamientosComponent },
    { path: 'examenes', component: ExamenesComponent },
    { path: 'pacientes/nuevo', component: PacienteFormComponent },
    { path: 'pacientes/detalle/:id', component: DetallesComponent }
];
