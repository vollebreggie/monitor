import { RegisterComponent } from './Components/Register/register.component';
import { LoginComponent } from './Components/Login/login.component';
import { AuthGuard } from './Services/AuthGuardService';
import { ConfigureSystemComponent } from './Components/ConfigureSystem/configure-system.component';
import { ErrorComponent } from './Components/Error_Page/error-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent }   from './Components/Dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // otherwise redirect to home

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'configureSystem', component: ConfigureSystemComponent, canActivate: [AuthGuard]},
  { path: 'connectionRefused', component: ErrorComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
