import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import CustomMaterialTheme from './theme.config';
import { AuthInterceptorService } from './auth/interceptor/auth-interceptor.service';
import { AuthGuard } from './auth/auth-guard';
import { JwtService } from './auth/jwt/jwt.service';

export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideAnimationsAsync(), provideHttpClient(withFetch()),
    providePrimeNG({
        ripple: false
    }),
    providePrimeNG({
        theme: {
            preset: CustomMaterialTheme,
            options: {
                // Use class selector for dark mode instead of system preference
                darkModeSelector: '.dark-mode'
            }
        }
    }),
    provideHttpClient(withInterceptorsFromDi())
        , { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        AuthGuard,
    provideAppInitializer(() => {
        const jwtService = inject(JwtService);
        // Initialize auth synchronously before app renders
        jwtService.initAuthState();
        // Return void since this is synchronous
    })
    ]
};