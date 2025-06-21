import { Routes } from '@angular/router';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultaComponent } from './pages/consultas/consultas.component';
import { CitasComponent } from './pages/citas/citas.component';
import { TratamientosComponent } from './pages/tratamientos/tratamientos.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { HomeComponent } from './pages/home/home.component';
import { PacienteFormComponent } from './pages/pacientes/paciente-form/paciente-form.component';
import { DetallesComponent } from './pages/pacientes/detalles/detalles.component';
import { EditarPacienteComponent } from './pages/pacientes/editar-paciente/editar-paciente.component';
import { RegistroConsultaComponent } from './pages/consultas/registro-consulta/registro-consulta.component';

export const routes: Routes = [
    { path: '', component:HomeComponent},
    { path: 'pacientes', component: PacientesComponent },
    { path: 'consultas', component: ConsultaComponent },
    { path: 'citas', component: CitasComponent },
    { path: 'tratamientos', component: TratamientosComponent },
    { path: 'examenes', component: ExamenesComponent },
    { path: 'pacientes/nuevo', component: PacienteFormComponent },
    { path: 'pacientes/detalle/:id', component: DetallesComponent },
    { path: 'pacientes/editar-paciente/:id', component: EditarPacienteComponent },
    { path: 'consultas/registro-consulta', component: RegistroConsultaComponent}
];
