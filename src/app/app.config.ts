import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { NetworkInterceptor } from './interceptors/network.interceptor';
import { NetworkService } from './services/network.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    NetworkService,
    { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true },
    provideHttpClient()
  ]
};
