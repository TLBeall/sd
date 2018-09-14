import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-returns-toolbox',
  templateUrl: './main-returns-toolbox.component.html',
  styleUrls: ['./main-returns-toolbox.component.scss']
})
export class MainReturnsToolboxComponent implements OnInit {

  opened: Boolean;
  demoOpened: Boolean;
  hide: Boolean = false;
  visibility: string = "hidden";


  toggle(tag: number) {
    if (tag === 1) {
      this.opened = !this.opened;
      this.hide = !this.hide;
      this.visibleFunction();
      
    } else if (tag === 2) {
      this.demoOpened = !this.demoOpened;
      this.hide = !this.hide;
      this.visibleFunction();
    }
  }

  visibleFunction() {
    if (this.visibility == "hidden"){
      setTimeout(() => {
            this.visibility = "visible";
          }, 200);
        } else {
            this.visibility = "hidden";
        }
  }

  closeToolbox() {
    // this.opened = !this.opened;
    // this.demoOpened = false;
    //not sure if these should close on click outside?
  }

  constructor() {
  }

  ngOnInit() {
  }

}

