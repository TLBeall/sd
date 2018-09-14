import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { delay, share } from 'rxjs/operators';
import { RootReturns } from '../../Models/RootReturns.model';
import 'datatables.net';
import * as $ from 'jquery';
import { ChildElement } from '../../Models/childElement.model';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../Loader/loader.service';


@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.scss']
})

export class ReturnsComponent implements OnInit {

  public RootReturns: RootReturns;
  public activeClient: string;

  constructor(private _authService: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
    route.params.subscribe(params => this.activeClient = params["id"]);
    //loading panel
    this.loaderService.display(true);
  }

  // API Call

  ngOnInit() {
    $(".clientTable").toggle(false);
    this._authService.getReturns(this.activeClient, new Date("01/01/2018"), new Date("12/31/2018"))
      .subscribe(data => {
        this.RootReturns = data;
        $(".clientTable").toggle(true);
        //loading panel
        this.loaderService.display(false);
      });
  }

  ngAfterViewInit() {
  }
}

