import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';


import {MatTableModule} from '@angular/material/table';
import { ResolveReturnsComponent } from './Services/resolve-returns/resolve-returns.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    ResolveReturnsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    MatTableModule
  ],
  providers: [
    AuthService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
