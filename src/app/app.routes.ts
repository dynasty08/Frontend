import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Dashboard } from './dashboard/dashboard';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'users', component: UsersComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
