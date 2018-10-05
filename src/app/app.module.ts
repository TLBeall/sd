import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MainReturnsToolbarComponent } from './toolbar/main-returns-toolbar/main-returns-toolbar.component';
import { HomePageInternalToolbarComponent } from './toolbar/home-page-internal-toolbar/home-page-internal-toolbar.component';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule, MatSort, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule, 
        MatSortModule, MatProgressSpinnerModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, 
        MatCheckboxModule, MatTooltipModule, MatProgressBarModule, MatSlideToggleModule } from '@angular/material';
import { InternalHomePageComponent } from './internal-home-page/internal-home-page.component';
import { InternalHomeDashboardComponent } from './internal-home-page/internal-home-dashboard/internal-home-dashboard.component';
import { GlobalService } from './Services/global.service';
import { FormsModule } from '@angular/forms';
import { CustomReuseStrategy } from './Services/CustomReuseStrategy.service';
import { ListPerformanceToolbarComponent } from './toolbar/list-performance-toolbar/list-performance-toolbar.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    InternalHomePageComponent,
    routingComponents,
    LoaderComponent,
    ClickOutsideDirective,
    ToolbarComponent,
    MainReturnsToolbarComponent,
    HomePageInternalToolbarComponent,
    InternalHomeDashboardComponent,
    ListPerformanceToolbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  providers: [
    AuthService,
    LoaderService,
    GlobalService,
    CustomReuseStrategy

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
