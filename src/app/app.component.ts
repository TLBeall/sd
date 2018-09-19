import { Component, HostListener, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SD360-Reporting-Angular';
  
  ngOnInit() {

  }

  constructor() {
  }
}



enableProdMode();
