import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { ForbiddenComponent } from './core/pages/forbidden/forbidden.component';
import { UsersPageComponent } from './feature/users-page/users-page/users-page.component';
import { authForRootGuard } from './core/routing/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    canActivate: [authForRootGuard],
    component: UsersPageComponent,
  },
  {
    path: '403',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
