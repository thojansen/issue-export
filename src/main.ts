import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { environment } from './environment'
import { enableProdMode } from '@angular/core'
import { AppModule } from './app.module'
import 'zone.js'


if(environment.production) {
  enableProdMode()
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
