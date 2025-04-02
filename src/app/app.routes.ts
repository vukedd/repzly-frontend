import { Routes } from '@angular/router';
import { ProgramListComponent } from './program/program-list/program-list.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ProgramCreateComponent } from './program/program-create/program-create.component';
import { ProgramDetailsComponent } from './program/program-details/program-details.component';
import { WorkoutTrackerComponent } from './workout/workout-tracker/workout-tracker.component';
import { StartedProgramsPageComponent } from './layout/started-programs-page/started-programs-page.component';
import { ProgramHistoryComponent } from './program/program-history/program-history.component';
import { HomeProgramsPageComponent } from './layout/home-programs-page/home-programs-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeProgramsPageComponent,
        title: 'Home'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
    }, 
    {
        path: 'login',
        component: LoginComponent,
        title: 'Log in'
    },
    {
        path: 'create-program',
        component: ProgramCreateComponent,
        title: 'Create program'
    },
    {
        path: 'programs/:id',
        component: ProgramDetailsComponent,
        title:'Program details'
    },
    {
        path: 'workout-tracker/:id',
        component: WorkoutTrackerComponent,
        title:'Workout tracker'
    },
    {
        path: 'started-programs',
        component: StartedProgramsPageComponent,
        title:'Started programs'
    },
    {
        path: 'programs-history/:id',
        component: ProgramHistoryComponent,
        title:'Program history'
    }
];

export default routes;