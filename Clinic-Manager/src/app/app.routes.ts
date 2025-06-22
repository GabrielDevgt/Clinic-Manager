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
import { CategoriaEnfermedadComponent } from './pages/categorias-enfermedad/categorias-enfermedad.component';
import { EnfermedadComponent } from './pages/enfermedades/enfermedades.component';
import { AntecedentesListComponent } from './pages/antecedentes-list/antecedentes-list.component';
import { ConsultasTemporalesComponent } from './pages/consultas-temporales/consultas-temporales.component';
import { RegistroConsultaTemporalComponent } from './pages/consultas-temporales/registroconsultas/registroconsultas.component';
import { DetalleConsultaComponent } from './pages/consultas-temporales/detalles/detalles.component';

export const routes: Routes = [
    { path: '', component:HomeComponent},
    { path: 'pacientes', component: PacientesComponent },
    {path: 'consultas', component: ConsultasTemporalesComponent},
    { path: 'citas', component: CitasComponent },
    { path: 'pacientes/nuevo', component: PacienteFormComponent },
    { path: 'pacientes/detalle/:id', component: DetallesComponent },
    { path: 'pacientes/editar-paciente/:id', component: EditarPacienteComponent },
    { path: 'consultas-temporales/registro', component: RegistroConsultaTemporalComponent},
    { path: 'consultas-temporales/detalles/:id', component: DetalleConsultaComponent}
    // { path: 'categorias', component: CategoriaEnfermedadComponent},
    // { path: 'enfermedades', component: EnfermedadComponent},
    // { path: 'antecedentes', component: AntecedentesListComponent}
];
