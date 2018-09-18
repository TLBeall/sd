import {Component, OnInit} from '@angular/core';
import {Sort} from '@angular/material';
import { LoaderService } from '../../Loader/loader.service';
import { ActivatedRoute } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';
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
  private TempList: any;
  private RootDataSource: any;

  clientDisplayedColumns: string[] = ['Expand','Client', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailTypeDisplayedColumns: string[] = ['Expand','MailType', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  campaignDisplayedColumns: string[] = ['Expand','CampaignName', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  phaseDisplayedColumns: string[] = ['Expand','PhaseName', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailListDisplayedColumns: string[] = ['MailCode', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];

  constructor(route: ActivatedRoute) {
    this.route = route;
  }  

  ngOnInit() {
    this.rowData = this.route.snapshot.data['rowData'];
    // this.rowData[0].MailTypeList.forEach(a => 
    //   { 
    //     a.CampaignList.forEach(b => 
    //     { 
    //       b.PhaseList.forEach(c => 
    //         { c.MailDataSource = new MatTableDataSource(c.MailList); 
    //         });
    //         b.PhaseDataSource = new MatTableDataSource(b.PhaseList);
    //     });
    //     a.CampaingDataSource = new MatTableDataSource(a.CampaignList); 
    //   });
    //   this.rowData[0].MailTypeDataSource = new MatTableDataSource(this.rowData[0].MailTypeList);
    //   this.rowData[0].MailTypeDataSource.sort = this.mailTypeSort;
    }

  GetVisibilityStyle(state: boolean): string
  {
    if (state)
      return 'visible';
    return 'collapse';
  }

  CollapseNextLevel(Parent: any, ChildList: any[])
  {
    ChildList.forEach(a =>  {
      if (a.Measure.Expanded == true)
        a.Measure.Expanded = false;
    })

    if (Parent.Measure.Expanded == false)
      Parent.Measure.Expanded = true;
   }

   ToggleExpansion(Element: any)
   {
     Element.Measure.Expanded = ! Element.Measure.Expanded;
   }

   MailTypeSort(sort: Sort, mailTypeList: any){
    this.rowData[0].MailTypeList[0] = this.rowData[0].MailTypeList[1];
   }
}

