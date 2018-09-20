// import { Component, HostListener, OnInit } from '@angular/core';
// import { enableProdMode } from '@angular/core';
// import { ScreenDataService } from './Services/screen-data.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent implements OnInit {
//   title = 'SD360-Reporting-Angular';
//   public currentWindowWidth: number;

//   ngOnInit() {
//     this.currentWindowWidth = window.innerWidth;
//   }

//   constructor(private _testWidth: ScreenDataService) {
//     this.currentWindowWidth = window.innerWidth;
//     this._testWidth.setUserData(this.currentWindowWidth);
//   }



//   @HostListener('window:resize')
//     onResize() {
//         this.currentWindowWidth = window.innerWidth
//     }
// }



// enableProdMode();

import { Component, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { ScreenDataService } from './Services/screen-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SD360-Reporting-Angular';
  // public currentWindowWidth: number;
  public currentWindowWidth: number;

  ngOnInit() {
    // this.currentWindowWidth = window.innerWidth;
    // this._testWidth.setWidth(this.currentWindowWidth);
  }

  constructor(private _testWidth: ScreenDataService) {
    // this.currentWindowWidth = window.innerWidth;
    // this._testWidth.setWidth(this.currentWindowWidth);
  }


  @HostListener('window:load')
  onload() {
    this.currentWindowWidth = window.innerWidth;
    this._testWidth.setWidth(this.currentWindowWidth);
  }

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
    this._testWidth.setWidth(this.currentWindowWidth);
  }


  //   ngOnChanges(changes: SimpleChanges): void{
  //     this.currentWindowWidth = window.innerWidth;
  //   this._testWidth.setWidth(this.currentWindowWidth);
  // }
}



enableProdMode();

