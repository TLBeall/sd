import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientList } from '../../../Models/ClientList.model';
import { AuthService } from '../../../Services/auth.service';
import { GlobalService } from '../../../Services/global.service'
import { resolve } from 'url';

@Component({
  selector: 'app-main-returns-toolbox',
  templateUrl: './main-returns-toolbox.component.html',
  styleUrls: ['./main-returns-toolbox.component.scss']
})
export class MainReturnsToolboxComponent implements OnInit {

  @Input() client:string;
  @Input() fromDate:Date;
  @Input() toDate:Date;
  toolsOpened: Boolean;
  demoOpened: Boolean;
  hide: Boolean = false;
  visibility: string = "hidden";
  toolsIcon: string = "settings";
  l2Icon: string = "group";
  public ClientArr: ClientList[];


  toggle(tag: number) {
    if (tag === 1) {
      this.toolsOpened = !this.toolsOpened;
      this.hide = !this.hide;
      this.toolsIcon = this.toolsOpened?  "arrow_forward_ios": "settings";
      this.visibleFunction();
    } else if (tag === 2) {
      this.demoOpened = !this.demoOpened;
      this.hide = !this.hide;
      this.l2Icon = this.demoOpened? "arrow_forward_ios": "group";
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

  constructor(private _authService: AuthService, private router: Router, private _g: GlobalService) {
    this._authService.getClientList("All")
            .subscribe(data => {
                this.ClientArr = data;
            });
  }

  ApplyChanges()
  {
    alert('hello');
  }

  ngOnInit() {
  }

  // this._g.startDate = new Date('01/01/'+ this.fromDate.toString());
  // this._g.endDate = new Date('12/31/'+ this.toDate.toString());
  // this._g.client = this.client;
  // this._authService.getReturns(this._g.client,this._g.startDate,this._g.endDate).subscribe( data => {
  //   this._g.rootReturns = data;
  // });

}

