import { Component, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { GlobalService } from './Services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SD360-Reporting-Angular';
  public currentWindowWidth: number;
  public WidthService: any;

  ngOnInit() {
  }

  constructor(private _g: GlobalService) {
  }


  @HostListener('window:load')
  onload() {
    this._g.cwWidth = window.innerWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this._g.cwWidth = window.innerWidth;
  }
}



enableProdMode();

