import { Routes } from '@angular/router';
import { ProgramCreateComponent } from './program/program-create/program-create.component';
import { ProgramDetailsComponent } from './program/program-details/program-details.component';
import { WorkoutTrackerComponent } from './workout/workout-tracker/workout-tracker.component';
import { StartedProgramsPageComponent } from './layout/started-programs-page/started-programs-page.component';
import { ProgramHistoryComponent } from './program/program-history/program-history.component';
import { HomeComponent } from './layout/home/home.component';
import { SearchProgramsPageComponent } from './layout/search-programs-page/search-programs-page.component';
import { ProfileComponent } from './user/profile/profile.component';
import { MyProgramsPageComponent } from './layout/my-programs-page/my-programs-page.component';
import { AuthGuard } from './auth/auth-guard';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';


export const routes: Routes = [
    // {
    //     path: 'landing',
    //     component: LandingPageComponent,
    //     title: 'Landing page'
    // },
    {
        path: 'dashboard',
        component: HomeComponent,
        title: 'Dashboard',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path:'me',
        component: ProfileComponent,
        title: 'Profile',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'my-programs',
        component: MyProgramsPageComponent,
        title: 'My programs',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'update-program/:id',
        component: ProgramCreateComponent,
        title: 'Update program',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'create-program',
        component: ProgramCreateComponent,
        title: 'Create program',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'programs/:id',
        component: ProgramDetailsComponent,
        title:'Program details',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'workout-tracker/:id',
        component: WorkoutTrackerComponent,
        title:'Workout tracker',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'started-programs',
        component: StartedProgramsPageComponent,
        title:'Started programs',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'programs-history/:id',
        component: ProgramHistoryComponent,
        title:'Program history',
        canActivate: [AuthGuard] // Protected route
    },
    {
        path: 'search',
        component: SearchProgramsPageComponent,
        title: 'Search programs',
        canActivate: [AuthGuard] // Protected route
    }
];
export default routes;