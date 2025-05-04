import { Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ProgramCreateComponent } from './program/program-create/program-create.component';
import { ProgramDetailsComponent } from './program/program-details/program-details.component';
import { WorkoutTrackerComponent } from './workout/workout-tracker/workout-tracker.component';
import { StartedProgramsPageComponent } from './layout/started-programs-page/started-programs-page.component';
import { ProgramHistoryComponent } from './program/program-history/program-history.component';
import { HomeComponent } from './layout/home/home.component';
import { SearchProgramsPageComponent } from './layout/search-programs-page/search-programs-page.component';
import { ProfileComponent } from './user/profile/profile.component';
<<<<<<< HEAD
import { MyProgramsPageComponent } from './layout/my-programs-page/my-programs-page.component';
=======
import { AuthGuard } from './auth/auth-guard';
>>>>>>> main

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path:'me',
        component: ProfileComponent,
        title: 'Profile',
        canActivate: [AuthGuard]
    },
    {
        path: 'my-programs',
        component: MyProgramsPageComponent,
        title: 'My programs'
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
        path: 'update-program/:id',
        component: ProgramCreateComponent,
        title: 'Update program'
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
    },
    {
        path: 'search',
        component: SearchProgramsPageComponent,
        title: 'Search programs'
    }
];

export default routes;