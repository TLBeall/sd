import { BrowserModule } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TokenParams} from './Models/TokenParams';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { MailtypeReturnsComponent } from './Returns/mailtype-returns/mailtype-returns.component';
import { CampaignReturnsComponent } from './Returns/campaign-returns/campaign-returns.component';
import { PhaseReturnsComponent } from './Returns/phase-returns/phase-returns.component';
import { MaillistReturnsComponent } from './Returns/maillist-returns/maillist-returns.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    MailtypeReturnsComponent,
    CampaignReturnsComponent,
    PhaseReturnsComponent,
    MaillistReturnsComponent,
    routingComponents,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AngularFontAwesomeModule
  ],
  providers: [
    AuthService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
