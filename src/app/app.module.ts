import { BrowserModule } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TokenParams} from './Models/TokenParams.model';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTreeModule, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule} from '@angular/material';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { InternalHomeDashboardComponent } from './internal-home-dashboard/internal-home-dashboard.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { MainReturnsToolboxComponent } from './Returns/Toolbox-and-L2/main-returns-toolbox/main-returns-toolbox.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MainReturnsToolbarComponent } from './toolbar/main-returns-toolbar/main-returns-toolbar.component';
import { HomePageInternalToolbarComponent } from './toolbar/home-page-internal-toolbar/home-page-internal-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    InternalHomeDashboardComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    MainReturnsToolboxComponent,
    ClickOutsideDirective,
    ToolbarComponent,
    MainReturnsToolbarComponent,
    HomePageInternalToolbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatToolbarModule
  ],
  providers: [
    AuthService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
