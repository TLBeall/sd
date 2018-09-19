import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-main-returns-toolbar',
  templateUrl: './main-returns-toolbar.component.html',
  styleUrls: ['./main-returns-toolbar.component.scss']
})
export class MainReturnsToolbarComponent implements OnInit {

  public innerWidth: any;
  public mobileStatus:boolean;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 900){
      this.mobileStatus = false;
    } else {
      this.mobileStatus = true;
    }
  }

  @ViewChild('widgetContent', { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  constructor() {
    this.onResize(event); //required to work on mobile (since resize doesnt happen)
   }

  ngOnInit() {
  }

}
