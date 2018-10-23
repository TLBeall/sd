import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule, RouteReuseStrategy} from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InternalHomePageComponent } from './internal-home-page/internal-home-page.component';
import { ReturnsComponent } from './Returns/main-returns/main-returns.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { CustomReuseStrategy } from './Services/CustomReuseStrategy.service';
// import { ResolvelistperformanceComponent } from './Services/resolve-listperformance/resolve-listperformance.component';

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},  // this is how to set up the default page
  {path: 'homepage', component: InternalHomePageComponent },
  {path: 'returns/:client/:from/:to', component: ReturnsComponent},
  {path: 'returns', component: ReturnsComponent},
  {path: 'listperformance/:listowner/:listmanager/:recency/:startdate/:enddate', component: ListPerformanceComponent },
  // {path: 'listperformance', component: ListPerformanceComponent, resolve: {rowData: ResolvelistperformanceComponent} },
  {path: '**', component: PageNotFoundComponent} //Setup for if URL does not match
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [{provide: RouteReuseStrategy, useClass: CustomReuseStrategy}],
  declarations: []
})
export class AppRoutingModule { }
export const routingComponents = [InternalHomePageComponent, ReturnsComponent, PageNotFoundComponent];

