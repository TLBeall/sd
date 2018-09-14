
import { Component } from '@angular/core';
import { LoaderService } from '../../Loader/loader.service';
import { AuthService } from '../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import {animate, state, style, transition, trigger} from '@angular/animations';

import { RootReturns } from '../../Models/RootReturns.model';

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

  constructor(route: ActivatedRoute) {
    this.route = route;
  }   

  ngOnInit() {
    this.rowData = this.route.snapshot.data['rowData'];
  }

  GetVisibilityStyle(state: boolean): string
  {
    if (state)
      return 'visible';
    return 'collapse';
  }
}