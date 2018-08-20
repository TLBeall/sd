import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InternalHomeDashboardComponent } from './internal-home-dashboard/internal-home-dashboard.component';
import { ReturnsComponent } from './Returns/main-returns/main-returns.component';

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},  // this is how to set up the default page
  {path: 'homepage', component: InternalHomeDashboardComponent},
  {path: 'returns/:id', component: ReturnsComponent },
  {path: '**', component: PageNotFoundComponent} //Setup for if URL does not match
  //This is how you set up child routes below
  //Need to add <router-outlet></router-outlet> to the parent settings page in order to route/append on child 
  // {
  //   path: 'settings',
  //   component: SettingsComponent,
  //   children:[
  //       {path: 'contact', component: SettingsContactComponent}
  //   ]
  // }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
export const rountingComponents = [InternalHomeDashboardComponent, ReturnsComponent, PageNotFoundComponent];
