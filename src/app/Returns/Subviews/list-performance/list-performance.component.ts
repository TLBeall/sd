import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Sort, MatTableModule, MatTable, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../../Loader/loader.service';
import { ListPerformance } from '../../../Models/ListPerformance.model';
import { GlobalService } from '../../../Services/global.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { ListOwner } from '../../../Models/ListOwner.model';
import { ListManager } from '../../../Models/ListManager.model';
import { Segment } from '../../../Models/Segment.model';
import { ClientList } from '../../../Models/ClientList.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
//toolbox end

  //For chip selection settings
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //chip selection settings end


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
  private listOwners:ListOwner[];
  private listManagers:ListManager[];
  private segments: Segment[];
  private clientArr: ClientList[];
  private selectedClients: string[];
  private selectedOwners: string[];
  private selectedManagers: string[];
  private selectedSegments: string[];

  columnsToDisplay: string[] = ['Expand', 'ListOwner', 'ListManager', 'RecencyString', 'Client', 'Phase', 'MailCode', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP',  'AVG', 'CPD', 'Gross', 'Net', 'Cost',  'GPP', 'NLM', 'CLM', 'IO'];
  packageColumns: string[] = ['None','None','None','None','None', 'None' , 'None', 'None','PackageMailed', 'PackageCaged', 'PackageQuantity', 'PackageDonors', 'PackageNonDonors', 'PackageNewDonors', 'PackageRSP', 'PackageAVG', 'PackageCPD', 'PackageGross', 'PackageNet', 'PackageCost', 'PackageGPP', 'PackageNLM', 'PackageCLM', 'PackageIO'];
  detailsColumns: string[] = ['None','detailsColumn'];

  @ViewChild('LOInput') LOInput: ElementRef<HTMLInputElement>; //LO = List Owner
  @ViewChild('LMInput') LMInput: ElementRef<HTMLInputElement>; //LM = List Manager
  @ViewChild('RecInput') SegInput: ElementRef<HTMLInputElement>; //Rec = List Recency
  @ViewChild('ClInput') ClInput: ElementRef<HTMLInputElement>; //Cl = Client

  // private clientFilter: string[];
  // private listFilter: string[];
  // private managerFilter: string[];
  // private recencyFilter: string[];

  private LOStrArr: string[] = new Array<string>();
  private LOControl = new FormControl();
  private LOList: string[] = []; //clients in main returns
  private LOfilteredOptions: Observable<string[]>;

  private LMStrArr: string[] = new Array<string>();
  private LMControl = new FormControl();
  private LMList: string[] = [];
  private LMfilteredOptions: Observable<string[]>;

  private RecStrArr: string[] = new Array<string>();
  private RecControl = new FormControl();
  private RecList: string[] = [];
  private RecfilteredOptions: Observable<string[]>;

  private ClStrArr: string[] = new Array<string>();
  private ClControl = new FormControl();
  private ClList: string[] = [];
  private ClfilteredOptions: Observable<string[]>;


  constructor(private _authService: AuthService, route: ActivatedRoute, private _g: GlobalService) {
    this.route = route;
    this.LOfilteredOptions = this.LOControl.valueChanges.pipe(
      startWith(null),
      map((listowner: string | null) => listowner ? this.LO_filter(listowner) : this.LOStrArr.slice())
    );
    // this.LMfilteredOptions = this.LMControl.valueChanges.pipe(
    //   startWith(null),
    //   map((listmanager: string | null) => listmanager ? this._filter(listmanager) : this.LMStrArr.slice())
    // );
    // this.RecfilteredOptions = this.RecControl.valueChanges.pipe(
    //   startWith(null),
    //   map((recency: string | null) => recency ? this._filter(recency) : this.RecStrArr.slice())
    // );
    // this.ClfilteredOptions = this.ClControl.valueChanges.pipe(
    //   startWith(null),
    //   map((client: string | null) => client ? this._filter(client) : this.ClStrArr.slice())
    // );
  }

  private LO_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.LOStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }

  LOadd(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our list owner
    if ((value || '').trim()) {
      this.LOList.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.LOControl.setValue(null);
  }

  LOremove(listowner: string): void {
    const index = this.LOList.indexOf(listowner);

    if (index >= 0) {
      this.LOList.splice(index, 1);
    }
  }

  LOselected(event: MatAutocompleteSelectedEvent): void {
    if (!this.LOList.includes(event.option.viewValue))
      this.LOList.push(event.option.viewValue);
    this.LOInput.nativeElement.value = '';
    this.LOControl.setValue(null);
    this.LOfilteredOptions = this.LOControl.valueChanges.pipe(
      startWith(null),
      map((listowner: string | null) => listowner ? this.LO_filter(listowner) : this.LOStrArr.slice())
    );
    this.LOInput.nativeElement.blur();
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
          Element['PackageCPD'] = p.Measure.CPD;
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

    this.clientArr = this._g.clientArr;
    this._authService.getListOwners().subscribe(data => { 
      this.listOwners = data;
    });
    this._authService.getListManagers().subscribe(data => { 
      this.listManagers = data;
    });
    this._authService.getSegments().subscribe(data => { 
      this.segments = data;
    });    
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
        case 'CPD': return compare(a.Measure.CPD, b.Measure.CPD, isAsc);
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

  applyChanges(){
    this.closeToolbox();
  }

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
    this.toolsOpened = !this.toolsOpened;
    this.demoOpened = false;
    //not sure if these should close on click outside?
  }

  ////////////////////////////////////
}


function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


