import { BrowserModule } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TokenParams} from './Models/TokenParams';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, rountingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { MailtypeReturnsComponent } from './mailtype-returns/mailtype-returns.component';
import { CampaignReturnsComponent } from './campaign-returns/campaign-returns.component';
import { PhaseReturnsComponent } from './phase-returns/phase-returns.component';
import { MaillistReturnsComponent } from './maillist-returns/maillist-returns.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    MailtypeReturnsComponent,
    CampaignReturnsComponent,
    PhaseReturnsComponent,
    MaillistReturnsComponent,
    rountingComponents
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
