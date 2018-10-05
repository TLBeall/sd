import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientList } from '../../../Models/ClientList.model';
import { AuthService } from '../../../Services/auth.service';
import { GlobalService } from '../../../Services/global.service'
import { resolve } from 'url';
import { RootReturns } from '../../../Models/RootReturns.model';

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

  @Output() results: EventEmitter<any> = new EventEmitter<any>();

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


  constructor(private _authService: AuthService, private router: Router, private _g: GlobalService, route: ActivatedRoute) {
    // this.client = _g.client;
    // this.fromDate = _g.startDate;
    // this.toDate = _g.endDate;
    route.params.subscribe(params => {
      this.LoadValues(params['client'], params['from'], params['to']);   
    });
    this._authService.getClientList("All")
    .subscribe(data => {
        this.ClientArr = data;
      });  

  }

  LoadValues(client:string, startDate:any, endDate:any)
  {
    this.client = client;
    this.fromDate = new Date(Date.parse(startDate.split('.')[0].toString() + '/' + startDate.split('.')[1].toString() + '/' + startDate.split('.')[2].toString())) ;
    this.toDate = new Date(Date.parse(endDate.split('.')[0].toString() + '/' + endDate.split('.')[1].toString() + '/' + endDate.split('.')[2].toString())) ;
  }

  applyChanges() {

    var Results:RootReturns;
    var clientparam = "";
    this.client.forEach(element => {
      clientparam = clientparam + '.' + element; 
    });
    this._authService.getReturns(clientparam, this.fromDate, this.toDate).subscribe(data => {
      if (data)
      Results = data;
      Results = this._g.SetLastElements(Results);
      this.results.emit(Results);
    });
  }

  ngOnInit() {
  }



}

