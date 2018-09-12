import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
// import {AppModuleNgFactory} from "../aot/app/app.module.ngfactory";

import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';


import {LicenseManager} from "ag-grid-enterprise";
import { GroupRowInnerRenderer } from './group-row-inner-render/group-row-inner-render.component';
LicenseManager.setLicenseKey("Evaluation_License_Valid_Until__7_November_2018__MTU0MTU0ODgwMDAwMA==85765fef4e02a59e323b51600fb9fea3");

// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    GroupRowInnerRenderer
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AgGridModule.withComponents([GroupRowInnerRenderer])
  ],
  providers: [
    AuthService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
