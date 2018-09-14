import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InternalHomeDashboardComponent } from './internal-home-dashboard/internal-home-dashboard.component';
import { ReturnsComponent } from './Returns/main-returns/main-returns.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { ResolveReturnsComponent } from './Services/resolve-returns/resolve-returns.component';

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},  // this is how to set up the default page
  {path: 'homepage', component: InternalHomeDashboardComponent},
  {path: 'returns/:client/:year', component: ReturnsComponent, resolve: {rowData: ResolveReturnsComponent} },
  {path: 'returns', component: ReturnsComponent},
  {path: 'listperformance/:listowner/:listmanager/:recency', component: ListPerformanceComponent },
  {path: 'listperformance/:listowner/:listmanager', component: ListPerformanceComponent },
  {path: 'listperformance/:listowner', component: ListPerformanceComponent },
  {path: '**', component: PageNotFoundComponent} //Setup for if URL does not match
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [ResolveReturnsComponent],
  declarations: []
})
export class AppRoutingModule { }
export const routingComponents = [InternalHomeDashboardComponent, ReturnsComponent, PageNotFoundComponent];
