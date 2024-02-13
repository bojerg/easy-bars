import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AuthConfig, AuthModule } from '@auth0/auth0-angular';
import { environment as env } from './environments/environment';

// merged app.config.ts into main.ts

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), 
    provideRouter(routes), 
    provideAnimations(),
    importProvidersFrom(
      AuthModule.forRoot({
        ...env.auth0,
        cacheLocation: 'memory'
    })
    )
  ]
})
  .catch((err) => console.error(err));
