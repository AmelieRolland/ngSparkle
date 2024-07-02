import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor, jwtInterceptorProvider } from './jwt.interceptor';
import { ApiService } from './shared/services/api.service';
import { AuthService } from './shared/services/auth/auth.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(),
    jwtInterceptorProvider,
    ApiService,
    AuthService,
    
  ]
};
