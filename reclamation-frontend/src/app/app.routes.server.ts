import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Pages protégées : le JWT est disponible uniquement dans le navigateur.
  // Le prerender serveur provoquerait un appel API sans token (403).
  {
    path: 'client/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'agent/**',
    renderMode: RenderMode.Client
  },
  // Les routes avec :id sont dynamiques et ne peuvent pas être prerenderées
  // sans fournir une liste d'identifiants à getPrerenderParams.
  {
    path: 'client/claims/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'client/claims/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'agent/claims/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
