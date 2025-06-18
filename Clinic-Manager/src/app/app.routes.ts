import { Routes } from '@angular/router';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { CitasComponent } from './pages/citas/citas.component';
import { TratamientosComponent } from './pages/tratamientos/tratamientos.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component:HomeComponent},
    { path: 'pacientes', component: PacientesComponent },
    { path: 'consultas', component: ConsultasComponent },
    { path: 'citas', component: CitasComponent },
    { path: 'tratamientos', component: TratamientosComponent },
    { path: 'examenes', component: ExamenesComponent },
];
