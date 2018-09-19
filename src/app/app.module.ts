import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
<<<<<<< HEAD
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule } from '@angular/material';
=======
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTreeModule, MatSort, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule, MatSortModule} from '@angular/material';

>>>>>>> c1330f52ecafb8977584611432a1bdb07a7573b7
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { MainReturnsToolboxComponent } from './Returns/Toolbox-and-L2/main-returns-toolbox/main-returns-toolbox.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MainReturnsToolbarComponent } from './toolbar/main-returns-toolbar/main-returns-toolbar.component';
import { HomePageInternalToolbarComponent } from './toolbar/home-page-internal-toolbar/home-page-internal-toolbar.component';
import { MatTableModule } from '@angular/material/table';
import { ResolveReturnsComponent } from './Services/resolve-returns/resolve-returns.component';
import { InternalHomePageComponent } from './internal-home-page/internal-home-page.component';
import { InternalHomeDashboardComponent } from './internal-home-page/internal-home-dashboard/internal-home-dashboard.component';
import { InternalHomeToolboxComponent } from './internal-home-page/internal-home-toolbox/internal-home-toolbox.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    ResolveReturnsComponent,
    InternalHomePageComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    MainReturnsToolboxComponent,
    ClickOutsideDirective,
    ToolbarComponent,
    MainReturnsToolbarComponent,
    HomePageInternalToolbarComponent,
    InternalHomeDashboardComponent,
    InternalHomeToolboxComponent,
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
