import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Hada kaykhli l'Interceptors ykhdmo
    provideAnimations(), // Khdama dyal Angular Material
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Hada mhm bach yzid l'Interceptor f l'chaine
    }
  ]
};
