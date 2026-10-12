import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

// Client Pages
import { ClientDashboardComponent } from './pages/client/dashboard/dashboard';
import { ClientClaimListComponent } from './pages/client/claim-list/claim-list';
import { ClientClaimFormComponent } from './pages/client/claim-form/claim-form';
import { ClientClaimDetailComponent } from './pages/client/claim-detail/claim-detail';

// Agent Pages
import { AgentDashboardComponent } from './pages/agent/dashboard/dashboard';
import { AgentClaimListComponent } from './pages/agent/claim-list/claim-list';
import { AgentClaimDetailComponent } from './pages/agent/claim-detail/claim-detail';

// Guards
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  // Pages publiques
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes Client (protégées par Auth + Rôle CLIENT)
  {
    path: 'client',
    canActivate: [authGuard, roleGuard],
    data: { role: 'CLIENT' },
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'claims', component: ClientClaimListComponent },
      { path: 'claims/:id/edit', component: ClientClaimFormComponent }, // Edit (même composant)
      { path: 'claims/new', component: ClientClaimFormComponent },
      { path: 'claims/:id', component: ClientClaimDetailComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Routes Agent (protégées par Auth + Rôle AGENT)
  {
    path: 'agent',
    canActivate: [authGuard, roleGuard],
    data: { role: 'AGENT' },
    children: [
      { path: 'dashboard', component: AgentDashboardComponent },
      { path: 'claims', component: AgentClaimListComponent },
      { path: 'claims/:id', component: AgentClaimDetailComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Fallback (si page introuvable)
  { path: '**', redirectTo: '/login' }
];
