import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})


export class ToolbarComponent implements OnInit {
  public location = '';
  public toolbarHeight: any;
  public clearFixHeight: any = 115;
  // @ViewChild('toolbar', { read: ElementRef })
  // public toolbar: ElementRef<any>;


  constructor(private _router: Router) {
    this.location = _router.url;
  }

<<<<<<< HEAD
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.toolbarHeight = this.toolbar.nativeElement.clientHeight;
  //   this.clearFixHeight = this.toolbarHeight + 73;
  // }
=======
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.toolbarHeight = this.toolbar.nativeElement.clientHeight;
    // this.clearFixHeight = this.toolbarHeight + 73;
  }
>>>>>>> 71afef0f145c9cafc17520a599b9de1b1484c80b

  ngOnInit() {
    // this.toolbarHeight = this.toolbar.nativeElement.clientHeight;
  }

  runPageReference() {

  }

}
