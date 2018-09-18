import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sort } from '@angular/material';
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
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
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
  private ChangeDetector: any;

  clientDisplayedColumns: string[] = ['Expand', 'Client', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailTypeDisplayedColumns: string[] = ['Expand', 'MailType', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  campaignDisplayedColumns: string[] = ['Expand', 'CampaignName', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  phaseDisplayedColumns: string[] = ['Expand', 'PhaseName', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailListDisplayedColumns: string[] = ['MailCode', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];

  constructor(route: ActivatedRoute, private changeDetectorRefs: ChangeDetectorRef) {
    this.route = route;
    this.ChangeDetector = changeDetectorRefs;
  }

  ngOnInit() {
    this.rowData = this.route.snapshot.data['rowData'];
  }

  GetVisibilityStyle(state: boolean): string {
    if (state)
      return 'visible';
    return 'collapse';
  }

  CollapseNextLevel(Parent: any, ChildList: any[]) {
    ChildList.forEach(a => {
      if (a.Measure.Expanded == true)
        a.Measure.Expanded = false;
    })

    if (Parent.Measure.Expanded == false)
      Parent.Measure.Expanded = true;
  }

  ToggleExpansion(Element: any) {
    Element.Measure.Expanded = !Element.Measure.Expanded;
  }

  MailTypeSort(sort: Sort, mailTypeList: any) {

    const data = this.rowData[0].MailTypeList.slice();

    if (!sort.active || sort.direction === '') {
      sort.direction = "asc";
      sort.active = "MailType";
      this.rowData[0].MailTypeList = data;
    }

    this.rowData[0].MailTypeList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'MailType': return compare(a.MailType, b.MailType, isAsc);
        case 'Mailed': return compare(a.Measure.Mailed, b.Measure.Mailed, isAsc);
        case 'Caged': return compare(a.Measure.Caged, b.Measure.Caged, isAsc);
        case 'Quantity': return compare(a.Measure.Quantity, b.Measure.Quantity, isAsc);
        case 'Donors': return compare(a.Measure.Donors, b.Measure.Donors, isAsc);
        case 'NonDonors': return compare(a.Measure.NonDonors, b.Measure.NonDonors, isAsc);
        case 'NewDonors': return compare(a.Measure.NewDonors, b.Measure.NewDonors, isAsc);
        case 'RSP': return compare(a.Measure.RSP, b.Measure.RSP, isAsc);
        case 'AVG': return compare(a.Measure.AVG, b.Measure.AVG, isAsc);
        case 'Gross': return compare(a.Measure.Gross, b.Measure.Gross, isAsc);
        case 'Cost': return compare(a.Measure.Cost, b.Measure.Cost, isAsc);
        case 'Net': return compare(a.Measure.Net, b.Measure.Net, isAsc);
        case 'GPP': return compare(a.Measure.GPP, b.Measure.GPP, isAsc);
        case 'CLM': return compare(a.Measure.CLM, b.Measure.CLM, isAsc);
        case 'NLM': return compare(a.Measure.NLM, b.Measure.NLM, isAsc);
        case 'IO': return compare(a.Measure.IO, b.Measure.IO, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}