import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule, RouteReuseStrategy} from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InternalHomePageComponent } from './internal-home-page/internal-home-page.component';
import { ReturnsComponent } from './returns/main-returns/main-returns.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { CustomReuseStrategy } from './Services/CustomReuseStrategy.service';
import { ListGrossComponent } from './returns/Subviews/list-gross/list-gross.component';
import { PhaseGrossComponent } from './returns/Subviews/phase-gross/phase-gross.component';
import { WhitemailMainComponent } from './Utilities_Pages/whitemail/whitemail-main/whitemail-main.component';
import { WhitemailNewComponent } from './Utilities_Pages/whitemail/whitemail-new/whitemail-new.component';
import { WhitemailEditComponent } from './Utilities_Pages/whitemail/whitemail-edit/whitemail-edit.component';
import { LriMainComponent } from './Utilities_Pages/LRI/lri-main/lri-main.component';
import { LriNewComponent } from './Utilities_Pages/LRI/lri-new/lri-new.component';
import { LriEditComponent } from './Utilities_Pages/LRI/lri-edit/lri-edit.component';
import { IncidentalsMainComponent } from './Utilities_Pages/Incidentals/incidentals-main/incidentals-main.component';
import { IncidentalsNewComponent } from './Utilities_Pages/Incidentals/incidentals-new/incidentals-new.component';
import { IncidentalsEditComponent } from './Utilities_Pages/Incidentals/incidentals-edit/incidentals-edit.component';
import { CagingNewComponent } from './Utilities_Pages/Caging/caging-new/caging-new.component';
import { CagingCalendarComponent } from './Utilities_Pages/Caging/caging-calendar/caging-calendar.component';
import { ExceptionsMainComponent } from './Utilities_Pages/Caging/exceptions-main/exceptions-main.component';
import { ExceptionsEditComponent } from './Utilities_Pages/Caging/exceptions-edit/exceptions-edit.component';
import { PdfUploadComponent } from './Utilities_Pages/pdf-upload/pdf-upload.component';
// import { ResolvelistperformanceComponent } from './Services/resolve-listperformance/resolve-listperformance.component';

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},  // this is how to set up the default page
  {path: 'homepage', component: InternalHomePageComponent },
  {path: 'returns/:client/:startdate/:enddate', component: ReturnsComponent},
  {path: 'returns', component: ReturnsComponent},
  {path: 'listperformance/:listowner/:listmanager/:recency/:startdate/:enddate', component: ListPerformanceComponent },
  {path: 'listgross/:packagecode/:phasenumber/:mailcode', component: ListGrossComponent },
  {path: 'phasegross/:packagecode/:phasenumber', component: PhaseGrossComponent },
  {path: 'whitemail', component: WhitemailMainComponent },
  {path: 'whitemail/new', component: WhitemailNewComponent },
  {path: 'whitemail/edit/:id', component: WhitemailEditComponent, runGuardsAndResolvers: 'always' },
  {path: 'lri', component: LriMainComponent },
  {path: 'lri/new', component: LriNewComponent },
  {path: 'lri/edit/:id', component: LriEditComponent, runGuardsAndResolvers: 'always' },
  {path: 'caging/new', component: CagingNewComponent },
  {path: 'caging/calendar', component: CagingCalendarComponent },
  {path: 'exceptions', component: ExceptionsMainComponent},
  {path: 'exceptions/edit/:id', component: ExceptionsEditComponent},
  {path: 'pdf/upload', component: PdfUploadComponent},

  // {path: 'listperformance', component: ListPerformanceComponent, resolve: {rowData: ResolvelistperformanceComponent} },
  //Keep this path last since it is PageNotFound
  {path: '**', component: PageNotFoundComponent} //Setup for if URL does not match
];
//runGuardsAndResolvers allows for reinitializing the component/page every time you navigate to it, instead of reusing it

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule],
  providers: [{provide: RouteReuseStrategy, useClass: CustomReuseStrategy}],
  declarations: []
})

export class AppRoutingModule { }
export const routingComponents = [
  InternalHomePageComponent, 
  ReturnsComponent, 
  ListPerformanceComponent, 
  ListGrossComponent, 
  PhaseGrossComponent, 
  WhitemailMainComponent,
  WhitemailNewComponent,
  WhitemailEditComponent,
  LriMainComponent,
  LriNewComponent,
  LriEditComponent,
  PageNotFoundComponent,
  IncidentalsMainComponent,
  IncidentalsNewComponent,
  IncidentalsEditComponent,
  CagingNewComponent,
  CagingCalendarComponent,
  ExceptionsMainComponent,
  ExceptionsEditComponent,
  PdfUploadComponent
];

