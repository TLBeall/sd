<<<<<<< HEAD

import { Component } from '@angular/core';
import { LoaderService } from '../../Loader/loader.service';
=======
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ContentChildren } from '@angular/core';
>>>>>>> 79755303ffa6d4afd21c979ac11387b9f00abf06
import { AuthService } from '../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import {animate, state, style, transition, trigger} from '@angular/animations';

import { RootReturns } from '../../Models/RootReturns.model';
<<<<<<< HEAD
=======
import 'datatables.net';
import * as $ from 'jquery';
import { ChildElement } from '../../Models/childElement.model';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../Loader/loader.service';
>>>>>>> 79755303ffa6d4afd21c979ac11387b9f00abf06


@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

<<<<<<< HEAD
export class ReturnsComponent {
  title = 'SD360-Reporting-Angular';

  private rowData: RootReturns;
  private route: any;
  private valueToReturn: boolean = false;

  clientDisplayedColumns: string[] = ['Client', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailTypeDisplayedColumns: string[] = ['MailType', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  campaignDisplayedColumns: string[] = ['CampaignName', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  phaseDisplayedColumns: string[] = ['PhaseName', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailListDisplayedColumns: string[] = ['MailCode', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
=======
export class ReturnsComponent implements OnInit {

  public RootReturns: RootReturns;
  public activeClient: string;

  constructor(private _authService: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
    route.params.subscribe(params => this.activeClient = params["id"]);
    //loading panel
    this.loaderService.display(true);
  }
>>>>>>> 79755303ffa6d4afd21c979ac11387b9f00abf06

  constructor(route: ActivatedRoute) {
    this.route = route;
  }   

  ngOnInit() {
<<<<<<< HEAD
    this.rowData = this.route.snapshot.data['rowData'];
  }

  GetVisibilityStyle(state: boolean): string
  {
    if (state)
      return 'visible';
    return 'collapse';
  }
}
=======
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

>>>>>>> 79755303ffa6d4afd21c979ac11387b9f00abf06
