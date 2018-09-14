import { Component } from '@angular/core';
import { enableProdMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SD360-Reporting-Angular';
  

  constructor() {
  }
}

enableProdMode();
