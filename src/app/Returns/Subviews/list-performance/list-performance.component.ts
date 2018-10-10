import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../../Loader/loader.service';
import { ListPerformance } from '../../../Models/ListPerformance.model';
import { GlobalService } from '../../../Services/global.service';
import { Sort } from '@angular/material';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-list-performance',
  templateUrl: './list-performance.component.html',
  styleUrls: ['./list-performance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class ListPerformanceComponent implements OnInit {

  //Toolbox
  client: string;
  clientName: string;
  fromDate: Date;
  toDate: Date;
  toolsOpened: Boolean;
  demoOpened: Boolean;
  hide: Boolean = false;
  visibility: string = "hidden";


  
  toggle(tag: number) {
    if (tag === 1) {
      this.toolsOpened = !this.toolsOpened;
      this.hide = !this.hide;
      this.visibleFunction();
    } else if (tag === 2) {
      this.demoOpened = !this.demoOpened;
      this.hide = !this.hide;
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
  ////////////////////////////////////

  private route: any;
  public ListOwner: number = 0;
  public ListManager: number = 0;
  public Recency: number = 0;
  public startDate: any;
  public endDate: any;
  public pageReady: boolean = false;
  public ListPerformanceArr: ListPerformance[];
  private clientFilter: any[];
  private phaseFilter: any[];
  private mailCodeFilter: any[];
  private listFilter: any[];
  private managerFilter: any[];
  private recencyFilter: any[];
  columnsToDisplay: string[] = ['Expand', 'ListOwner', 'ListManager', 'RecencyString', 'Client', 'Phase', 'MailCode', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG',  'Cost', 'CLM',  'GPP', 'IO'];
  packageColumns: string[] = ['None','None','None','None','None', 'None' , 'None', 'None','PackageMailed', 'PackageCaged', 'PackageQuantity', 'PackageDonors', 'PackageNonDonors', 'PackageNewDonors', 'PackageRSP', 'PackageAVG', 'PackageGross', 'PackageCost', 'PackageNet', 'PackageGPP', 'PackageCLM', 'PackageNLM', 'PackageIO'];
  package2Columns: string[] = ['PackageTitle', 'PackageFormat'];

  constructor(private _authService: AuthService, route: ActivatedRoute, private _g: GlobalService) {
    this.route = route;
  }

  CollapseListBtn(Element): boolean {
    if (Element.Measure.Expanded == true) {
      return true;
    } else {
      return false;
    }
  }

  ToggleExpansion(Element: any) {
    if (Element.Measure.Expanded == false)
      if (! Element['PackageTitle'])
      {
        this._authService.getPackageReturns(Element.Phase).subscribe(p=> {
          Element['PackageName'] = p.Name;
          Element['PackageTitle'] = p.Title;
          Element['PackageFormat'] = p.Format;
          Element['PackageAVG'] = p.Measure.AVG;
          Element['PackageCaged'] = p.Measure.Caged;
          Element['PackageMailed'] = p.Measure.Mailed;
          Element['PackageIO'] = p.Measure.IO;
          Element['PackageRSP'] = p.Measure.RSP;
          Element['PackageGross'] = p.Measure.Gross;
          Element['PackageCost'] = p.Measure.Cost;
          Element['PackageNet'] = p.Measure.Net;
          Element['PackageDonors'] = p.Measure.Donors;
          Element['PackageNonDonors'] = p.Measure.NonDonors;
          Element['PackageNewDonors'] = p.Measure.NewDonors;
          Element['PackageQuantity'] = p.Measure.Quantity;
          Element['PackageCLM'] = p.Measure.CLM;
          Element['PackageNLM'] = p.Measure.NLM;
          Element['PackageGPP'] = p.Measure.GPP;
        });
      }
      if (Element.Measure)
      Element.Measure.Expanded = !Element.Measure.Expanded;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.LoadValues(params['listowner'], params['listmanager'], params['recency'], params['startdate'], params['enddate']); 
      this._authService.getListPerformance(this.ListOwner, this.ListManager, this.Recency, this.startDate, this.endDate)
      .subscribe(data => {
        this.ListPerformanceArr = data;
        this.ListPerformanceArr.forEach(p => { p.Measure.Expanded = false; });
        this.clientFilter = Array.from(new Set(this.ListPerformanceArr.map(item =>  ({ element : item.Client, checked : false}))));
        this.phaseFilter = Array.from(new Set(this.ListPerformanceArr.map(item =>  ({ element : item.Phase, checked : false}))));
        this.mailCodeFilter = Array.from(new Set(this.ListPerformanceArr.map(item =>  ({ element : item.MailCode, checked : false}))));
        this.listFilter = Array.from(new Set(this.ListPerformanceArr.map(item =>  ({ element : item.ListOwnerAbbrev, checked : false}))));
        this.managerFilter = Array.from(new Set(this.ListPerformanceArr.map(item =>  ({ element : item.ListManagerAbbrev, checked : false}))));
        this.recencyFilter = Array.from(new Set(this.ListPerformanceArr.map(item =>  ({ element : item.RecencyString, checked : false}))));
        console.log(this.clientFilter);
        this.pageReady = true;
      });    
   });
  }

  LoadValues(listowner:any, listmanager:any, recency:any, startdate:any, enddate: any)
  {
    this.ListOwner = listowner;
    this.ListManager = listmanager;
    this.Recency = recency;
    this.startDate = new Date(Date.parse(startdate.split('.')[0].toString() + '/' + startdate.split('.')[1].toString() + '/' + startdate.split('.')[2].toString())) ;
    this.endDate = new Date(Date.parse(enddate.split('.')[0].toString() + '/' + enddate.split('.')[1].toString() + '/' + enddate.split('.')[2].toString())) ;
  }

  SortFunction(sort: Sort, data: any) {

    var sortedData: any;

    data = data.slice();

    if (!sort.active || sort.direction === '') {
      sort.direction = "asc";
      sort.active = "Client";
    }

    var sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Client': return compare(a.Client, b.Client, isAsc);
        case 'Phase': return compare(a.Phase, b.Phase, isAsc);
        case 'ListOwner': return compare(a.ListOwnerAbr, b.ListOwnerAbr, isAsc);
        case 'ListManager': return compare(a.ListManagerAbr, b.ListManagerAbr, isAsc);
        case 'RecencyString': return compare(a.RecencySort, b.RecencySort, isAsc);
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
    sortedData.forEach(p => { p.Measure.Expanded = false; })
    this.ListPerformanceArr = sortedData;
  }
}

function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


