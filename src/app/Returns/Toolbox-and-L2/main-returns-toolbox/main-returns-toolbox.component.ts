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
  client: string;
  clientName: string;
  fromDate: Date;
  toDate: Date;
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
      this.toolsIcon = this.toolsOpened ? "arrow_forward_ios" : "settings";
      this.visibleFunction();
    } else if (tag === 2) {
      this.demoOpened = !this.demoOpened;
      this.hide = !this.hide;
      this.l2Icon = this.demoOpened ? "arrow_forward_ios" : "group";
      this.visibleFunction();
    }
  }

  visibleFunction() {
    if (this.visibility == "hidden") {
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
    this.client = _g.client;
    this.fromDate = _g.startDate;
    this.toDate = _g.endDate;
    this._authService.getClientList("All")
    .subscribe(data => {
        this.ClientArr = data;
      });
  }

  applyChanges() {
    this._g.startDate = this.fromDate;
    this._g.endDate = this.toDate;
    this._g.client = this.client;
    this._g.clientName = this.ClientArr.find(p => p.gClientAcronym == this.client).gClientName;
    this._authService.getReturns(this._g.client, this._g.startDate, this._g.endDate).subscribe(data => {
      if (data)
      this._g.rootReturns = data;
      this._g.SetLastElements();
      this._g.showlistperformance = false;
    });
  }

  ngOnInit() {
  }



}

