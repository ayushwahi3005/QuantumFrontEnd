import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { LoginService } from './app/login/login.service';
import { SecretService } from './secret.service';
import { APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// function initializeApp(secretsService: SecretService) {
//   return (): Promise<void> => secretsService.initializeEnvironmentVariables();
// }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

