import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-internal-home-dashboard',
  templateUrl: './internal-home-dashboard.component.html',
  styleUrls: ['./internal-home-dashboard.component.scss']
})
export class InternalHomeDashboardComponent implements OnInit {

  public currentWindowWidth: number;


  constructor() { }

  ngOnInit() {
    this.currentWindowWidth = window.innerWidth;

  }

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth
  }
  
}