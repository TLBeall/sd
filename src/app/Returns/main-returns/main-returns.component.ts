import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Sort, MatTableModule, MatTable } from '@angular/material';
import { LoaderService } from '../../Loader/loader.service';
import { ActivatedRoute, Params } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RootReturns } from '../../Models/RootReturns.model';
import { GlobalService } from '../../Services/global.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})

export class ReturnsComponent {


  title = 'SD360-Reporting-Angular';

  private route: any;
  private startDate: any;
  private endDate:any;
  private showlistperformance:boolean = false;


  // @ViewChild('PseudoDescription', { read: ElementRef })
  // public pseudoDescription: ElementRef;
  clientDisplayedColumns: string[] = ['Expand', 'Client', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailTypeDisplayedColumns: string[] = ['Expand', 'MailType', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  campaignDisplayedColumns: string[] = ['Expand', 'CampaignName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  phaseDisplayedColumns: string[] = ['Expand', 'PhaseName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];
  mailListDisplayedColumns: string[] = ['PseudoExpand', 'MailCode', 'MailDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];

  constructor(route: ActivatedRoute, private _g: GlobalService, private router:Router) {
    this.route = route;
    _g.showlistperformance = false;
  }

  ngOnInit() {
    this._g.rootReturns = new RootReturns();
    this._g.rootReturns = this.route.snapshot.data['rowData'];
    this.SetLastElements();
  }

  // NavigateToListPerformance(element.ListOwner, element.ListManager, element.Recency, '01/01/2018', '12/31/2018')

  NavigateToListPerformance(ListOwner:number, ListManager:number, Recency:number, startDate:Date, endDate:Date) {
    this._g.startDate = startDate;
    this._g.endDate = endDate;
    this._g.listowner = ListOwner;
    this._g.listmanager = ListManager;
    this._g.recency = Recency;
    this.router.navigate(['listperformance/'+ ListOwner.toString() + '/' + ListManager.toString() + '/' + Recency.toString()], {relativeTo: this.route});
    this._g.showlistperformance = true;
}

  GetVisibilityStyle(state: boolean): string {
    if (state)
      return 'visible';
    return 'collapse';
  }


  CollapseListBtn(Element): boolean {
    if (Element.Measure.Expanded == true) {
      return true;
    } else {
      return false;
    }
  }


  ReadyToCollapseAll(list: any[]): boolean {
    var RetValue: boolean = false;
    list.forEach(b => {
      if (b.Measure)
      if (b.Measure.Expanded == true) {
        RetValue = true;
        return RetValue;
      } else {
      }
    })
    return RetValue;
  }

  NextLevel(Parent: any, ChildList: any[]) {
    var SetToExpand = true;
    if (this.ReadyToCollapseAll(ChildList))
      SetToExpand = false;
    if (Parent.MailTypeList != null) {
      ChildList.forEach(a => {
        a.CampaignList.forEach(b => {
          b.PhaseList.forEach(c => {
            c.Measure.Expanded = SetToExpand;
          })
          b.Measure.Expanded = SetToExpand;
        })
        a.Measure.Expanded = SetToExpand;
      })
    }

    if (Parent.CampaignList != null) {
      ChildList.forEach(a => {
        a.PhaseList.forEach(c => {
          c.Measure.Expanded = SetToExpand;
        })
        a.Measure.Expanded = SetToExpand;
      })
    }

    if (Parent.PhaseList != null) {
      ChildList.forEach(a => {
        a.Measure.Expanded = SetToExpand;
      })
    }

    if (Parent.Measure.Expanded == false)
      Parent.Measure.Expanded = true;
  }
  toggleState: boolean;
  ToggleExpansion(Element: any) {
    if (Element.Measure)
      Element.Measure.Expanded = !Element.Measure.Expanded;
  }

  SetLastElements()
  {
    this._g.rootReturns[0].MailTypeList.forEach(element => {
      element.Measure.IsLast = false;
      element.CampaignList.forEach(element => {
        element.Measure.IsLast = false;
        element.PhaseList.forEach(element => {
          element.Measure.IsLast = false;
        });
        element.PhaseList[element.PhaseList.length-1].Measure.IsLast = true;  
      });
      element.CampaignList[element.CampaignList.length-1].Measure.IsLast = true;
    });
    this._g.rootReturns[0].MailTypeList[this._g.rootReturns[0].MailTypeList.length-1].Measure.IsLast = true;
  }

  SortFunction(sort: Sort, Element: any) {

    var data: any;
    var myType: string = "";

    if (Element.CampaignList != null) myType = "MailType";
    if (Element.PhaseList != null) myType = "Campaign";
    if (Element.MailList != null) myType = "Phase";
    if (myType == "") myType = "MailTypeList";

    switch (myType) {
      case "MailTypeList": {
        if (this.ReadyToCollapseAll(this._g.rootReturns[0].MailTypeList))
          this.NextLevel(this._g.rootReturns[0], this._g.rootReturns[0].MailTypeList);
        data = this._g.rootReturns[0].MailTypeList.slice();
        break;
      }
      case "MailType": {
        if (this.ReadyToCollapseAll(Element.CampaignList))
          this.NextLevel(Element, Element.CampaignList);
        data = Element.CampaignList.slice();
        break;
      }
      case "Campaign": {
        if (this.ReadyToCollapseAll(Element.PhaseList))
          this.NextLevel(Element, Element.PhaseList);
        data = Element.PhaseList.slice();
        break;
      }
      case "Phase": {
        data = Element.MailList.slice();
        break;
      }
      default: {
        break;
      }
    }

    if (!sort.active || sort.direction === '') {
      sort.direction = "asc";
      switch (myType) {
        case "MailTypeList": {
          sort.active = "MailType";
          break;
        }
        case "MailType": {
          sort.active = "CampaignName";
          break;
        }
        case "Campaign": {
          sort.active = "PhaseName";
          break;
        }
        case "Phase": {
          sort.active = "MailCode";
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    }

    var sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'MailType': return compare(a.MailType, b.MailType, isAsc);
        case 'CampaignName': return compare(a.CampaignName, b.CampaignName, isAsc);
        case 'PhaseName': return compare(a.PhaseName, b.PhaseName, isAsc);
        case 'MailCode': return compare(a.MailCode, b.MailCode, isAsc);
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

    this.SetLastElements();

    switch (myType) {
      case "MailTypeList": {
        sort.active = "MailType";
        this._g.rootReturns[0].MailTypeList = sortedData;
        break;
      }
      case "MailType": {
        Element.CampaignList = sortedData
        break;
      }
      case "Campaign": {
        Element.PhaseList = sortedData
        break;
      }
      case "Phase": {
        Element.MailList = sortedData
        break;
      }
      default: {
        //statements; 
        break;
      }
    }

  }

}


function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
