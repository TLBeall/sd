import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../Services/global.service';

@Component({
  selector: 'app-main-returns-toolbar',
  templateUrl: './main-returns-toolbar.component.html',
  styleUrls: ['./main-returns-toolbar.component.scss']
})
export class MainReturnsToolbarComponent implements OnInit {

  public size_lg = this._g.size_lg;
  public size_md = this._g.size_md;
  public size_sm = this._g.size_sm;
  public size_xs = this._g.size_xs;
  

  @ViewChild('widgetContent', { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  constructor(public _g: GlobalService) {
   }

  ngOnInit() {
  }


}
