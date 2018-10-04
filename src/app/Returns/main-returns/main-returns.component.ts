import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Sort, MatTableModule, MatTable } from '@angular/material';
import { LoaderService } from '../../Loader/loader.service';
import { ActivatedRoute, Params } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RootReturns } from '../../Models/RootReturns.model';
import { GlobalService } from '../../Services/global.service';
import { Router } from '@angular/router'
import { AuthService } from '../../Services/auth.service'

@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})

export class ReturnsComponent {


  title = 'SD360-Reporting-Angular';

  private route: any;
  private startDate: any;
  private endDate:any;
  private pageReady:boolean=false;
  private client:string;
  private clientName: string;
  private rootReturns: RootReturns;
  private showFilterColumn: boolean = false;
  private TTShow = this._g.mi_tooltipShowDelay;
  private TTHide = this._g.mi_tooltipHideDelay;


  clientDisplayedColumns: string[] = ['Expand', 'selectionBox', 'Client', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  mailTypeDisplayedColumns: string[] = ['Expand', 'selectionBox', 'MailType', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  campaignDisplayedColumns: string[] = ['Expand', 'selectionBox', 'CampaignName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  phaseDisplayedColumns: string[] = ['Expand', 'selectionBox', 'PhaseName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  mailListDisplayedColumns: string[] = ['PseudoExpand', 'selectionBox', 'MailCode', 'MailDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];


  constructor(route: ActivatedRoute, private _authService:AuthService, private _g: GlobalService, private router:Router) {
    this.route = route;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LoadValues(params['client'], params['from'], params['to']); 
      this._authService.getReturns(this.client, this.startDate, this.endDate).subscribe(data => {
        this.rootReturns = data;
        this.rootReturns = this._g.SetLastElements(this.rootReturns)
        this.pageReady = true;
      });
      this.clientName = this._g.clientArr.find(p => p.gClientAcronym == this.client).gClientName;
        // In a real app: dispatch action to load the details here.
   });

  }

  LoadValues(client:any, startDate:any, endDate:any)
  {
    this.client = client;
    this.startDate = new Date(Date.parse(startDate.split('.')[0].toString() + '/' + startDate.split('.')[1].toString() + '/' + startDate.split('.')[2].toString())) ;
    this.endDate = new Date(Date.parse(endDate.split('.')[0].toString() + '/' + endDate.split('.')[1].toString() + '/' + endDate.split('.')[2].toString())) ;
  }


  NavigateToListPerformance(ListOwner:number, ListManager:number, Recency:number, startDate:Date, endDate:Date) {
    this._g.clearCurCache = true;
    this.router.navigate(['listperformance' + '/' + ListOwner + '/' + ListManager + '/' + Recency + '/' + startDate.toLocaleDateString().split('/').join('.') + '/' + endDate.toLocaleDateString().split('/').join('.')]);
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


  ToggleExpansion(Element: any) {
    if (Element.Measure)
      Element.Measure.Expanded = !Element.Measure.Expanded;
  }

  onResults(ReturnedResults:any):any
  {
    this.clientName = this._g.clientArr.find(p => p.gClientAcronym == ReturnedResults[0].Client).gClientName;
    this.rootReturns = ReturnedResults;
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
        if (this.ReadyToCollapseAll(this.rootReturns[0].MailTypeList))
          this.NextLevel(this.rootReturns[0], this.rootReturns[0].MailTypeList);
        data = this.rootReturns[0].MailTypeList.slice();
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

    
    switch (myType) {
      case "MailTypeList": {
        sort.active = "MailType";
        this.rootReturns[0].MailTypeList = sortedData;
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
    this._g.SetLastElements(this.rootReturns[0]);
  }
}

function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
