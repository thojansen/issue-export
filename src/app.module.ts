import { NgModule } from '@angular/core'
import { Location } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRouter } from './approuter.module'
import { HttpClientModule } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppComponent } from './app/app.component'
import { OcticonDirective } from './octicon/octicon.directive'

@NgModule({
  declarations: [
    AppComponent,
    OcticonDirective
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule,
    FormsModule,       
    ReactiveFormsModule,
    AppRouter,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [ Location ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
