import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import { TestComponent } from './test/test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/test', pathMatch: 'full'},  // this is how to set up the default page
  {path: 'test', component: TestComponent},
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
