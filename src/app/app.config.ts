import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { JwtInterceptor, jwtInterceptorProvider } from './jwt.interceptor';
import { ApiService } from './shared/services/api.service';
import { AuthService } from './shared/services/auth/auth.service';
import { authInterceptor } from './interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    jwtInterceptorProvider,
    ApiService,
    AuthService,
    
  ]
};
