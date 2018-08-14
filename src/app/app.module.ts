import { BrowserModule } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TokenParams} from './Models/TokenParams';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { InternalHomeDashboardComponent } from './internal-home-dashboard/internal-home-dashboard.component';
import { ReturnsComponent } from './returns/returns.component';
import { MailtypeReturnsComponent } from './mailtype-returns/mailtype-returns.component';
import { CampaignReturnsComponent } from './campaign-returns/campaign-returns.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavigationBarComponent,
    InternalHomeDashboardComponent,
    ReturnsComponent,
    MailtypeReturnsComponent,
    CampaignReturnsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AngularFontAwesomeModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
