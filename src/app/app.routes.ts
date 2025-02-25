import { Routes } from '@angular/router';
import { ProgramListComponent } from './program/program-list/program-list.component';
import { RegisterComponent } from './user/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: ProgramListComponent,
        title: 'Program list'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
    }

];

export default routes;