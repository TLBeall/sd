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
import { Returns } from '../../../Models/Returns.model';

@Component({
  selector: 'app-list-performance',
  templateUrl: './list-performance.component.html',
  styleUrls: ['./list-performance.component.scss'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
  //     state('expanded', style({ height: '*' })),
  //     transition('expanded <=> collapsed', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
  //   ]),
  // ],
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


  public route: any;
  public ListOwner: string = '';
  public ListManager: string = '';
  public Recency: string = '';
  public startDate: any;
  public endDate: any;
  public pageReady: boolean = false;
  public ListPerformanceArr: ListPerformance[];
  public Summary: Returns;

  columnsToDisplay: string[] = ['Expand', 'selectionBox', 'ListOwner', 'ListManager', 'RecencyString', 'Client', 'Phase', 'MailCode', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'GPP', 'Cost', 'CLM', 'Net', 'NLM', 'CPD', 'IO'];
  packageColumns: string[] = ['None','PackageHeader','PackageMailed', 'PackageCaged', 'PackageQuantity', 'PackageDonors', 'PackageNonDonors', 'PackageNewDonors', 'PackageRSP', 'PackageAVG', 'PackageCPD', 'PackageGross', 'PackageNet', 'PackageCost', 'PackageGPP', 'PackageNLM', 'PackageCLM', 'PackageIO'];
  detailsColumns: string[] = ['None', 'detailsColumn', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', ];
  detailsColumns2: string[] = ['None', 'detailsColumn2', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None',];

  @ViewChild('LOInput') LOInput: ElementRef<HTMLInputElement>; //LO = List Owner
  @ViewChild('LMInput') LMInput: ElementRef<HTMLInputElement>; //LM = List Manager
  @ViewChild('RecInput') RecInput: ElementRef<HTMLInputElement>; //Rec = List Recency
  @ViewChild('ClInput') ClInput: ElementRef<HTMLInputElement>; //Cl = Client

  public LOStrArr: string[] = new Array<string>();
  public LOControl = new FormControl();
  public LOList: string[] = []; //clients in main returns
  public LOfilteredOptions: Observable<string[]>;

  public LMStrArr: string[] = new Array<string>();
  public LMControl = new FormControl();
  public LMList: string[] = [];
  public LMfilteredOptions: Observable<string[]>;

  public RecStrArr: string[] = new Array<string>();
  public RecControl = new FormControl();
  public RecList: string[] = [];
  public RecfilteredOptions: Observable<string[]>;

  public ClStrArr: string[] = new Array<string>();
  public ClControl = new FormControl();
  public ClList: string[] = [];
  public ClfilteredOptions: Observable<string[]>;


  constructor(public _authService: AuthService, route: ActivatedRoute, public _g: GlobalService) {
    this.route = route;
  }

  getAcronym(Name: string): string {
    var retString: string;
    retString = Name.substring(Name.lastIndexOf('-') + 1, Name.length).trim();
    return retString;
  }

  public LO_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.LOStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  public LM_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.LMStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  public Rec_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.RecStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  public Cl_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.ClStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }

  LO_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.LOList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.LOControl.setValue(null);
  }
  LM_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.LMList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.LMControl.setValue(null);
  }
  Rec_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.RecList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.RecControl.setValue(null);
  }
  Cl_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.ClList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.ClControl.setValue(null);
  }
  
  LO_Remove(listowner: string): void {
    const index = this.LOList.indexOf(listowner);
    if (index >= 0) {
      this.LOList.splice(index, 1);
    }
  }
  LM_Remove(listmanager: string): void {
    const index = this.LMList.indexOf(listmanager);
    if (index >= 0) {
      this.LMList.splice(index, 1);
    }
  }
  Rec_Remove(recency: string): void {
    const index = this.RecList.indexOf(recency);
    if (index >= 0) {
      this.RecList.splice(index, 1);
    }
  }
  Cl_Remove(client: string): void {
    const index = this.ClList.indexOf(client);
    if (index >= 0) {
      this.ClList.splice(index, 1);
    }
  }

  LO_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.LOList.includes(this.getAcronym(event.option.viewValue)))
      this.LOList.push(this.getAcronym(event.option.viewValue));
    this.LOInput.nativeElement.value = '';
    this.LOControl.setValue(null);
    this.LOfilteredOptions = this.LOControl.valueChanges.pipe(
      startWith(null),
      map((listowner: string | null) => listowner ? this.LO_filter(listowner) : this.LOStrArr.slice())
    );
    this.LOInput.nativeElement.blur();
  }
  LM_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.LMList.includes(this.getAcronym(event.option.viewValue)))
      this.LMList.push(this.getAcronym(event.option.viewValue));
    this.LMInput.nativeElement.value = '';
    this.LMControl.setValue(null);
    this.LMfilteredOptions = this.LMControl.valueChanges.pipe(
      startWith(null),
      map((listmanager: string | null) => listmanager ? this.LM_filter(listmanager) : this.LMStrArr.slice())
    );
    this.LMInput.nativeElement.blur();
  }
  Rec_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.RecList.includes(this.getAcronym(event.option.viewValue)))
      this.RecList.push(this.getAcronym(event.option.viewValue));
    this.RecInput.nativeElement.value = '';
    this.RecControl.setValue(null);
    this.RecfilteredOptions = this.RecControl.valueChanges.pipe(
      startWith(null),
      map((recency: string | null) => recency ? this.Rec_filter(recency) : this.RecStrArr.slice())
    );
    this.RecInput.nativeElement.blur();
  }
  Cl_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.ClList.includes(this.getAcronym(event.option.viewValue)))
      this.ClList.push(this.getAcronym(event.option.viewValue));
    this.ClInput.nativeElement.value = '';
    this.ClControl.setValue(null);
    this.ClfilteredOptions = this.ClControl.valueChanges.pipe(
      startWith(null),
      map((client: string | null) => client ? this.Cl_filter(client) : this.ClStrArr.slice())
    );
    this.ClInput.nativeElement.blur();
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
          if (p.Measure.Donors > 0)
            Element['PackageCPD'] = p.Measure.Cost / p.Measure.Donors;
          else
            Element['PackageCPD'] = 0;
        });
      }
      if (Element.Measure) {
      Element.Measure.Expanded = !Element.Measure.Expanded;
    }
  }
  

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LoadValues(params['listowner'], params['listmanager'], params['recency'], params['startdate'], params['enddate']);             

      this._authService.getPerformanceHierarchy().subscribe(data => {
        data = data.sort((n1,n2) => n1.SegmentSort > n2.SegmentSort ? 1:n2.SegmentSort > n1.SegmentSort ? -1:0);
        this.LMStrArr = Array.from(new Set(data.map(item =>  item.ListManagerName + ' - '+ item.ListManagerAbbrev))).sort();
        this.LOStrArr = Array.from(new Set(data.map(item =>  item.ListName + ' - '+ item.ListAbbrev))).sort();
        // this.LOInput.nativeElement.blur();
        this.RecStrArr = Array.from(new Set(data.map(item =>  item.SegmentName )));
        this.ClStrArr = Array.from(new Set(data.map(item =>  item.ClientName + ' - '+ item.ClientAbbrev))).sort();
        this.LOfilteredOptions = this.LOControl.valueChanges.pipe(
          startWith(null),
          map((listowner: string | null) => listowner ? this.LO_filter(listowner) : this.LOStrArr.slice())
        ); 
        this.LMfilteredOptions = this.LMControl.valueChanges.pipe(
          startWith(null),
          map((listmanager: string | null) => listmanager ? this.LM_filter(listmanager) : this.LMStrArr.slice())
        ); 
        this.RecfilteredOptions = this.RecControl.valueChanges.pipe(
          startWith(null),
          map((recency: string | null) => recency ? this.Rec_filter(recency) : this.RecStrArr.slice())
        ); 
        this.ClfilteredOptions = this.ClControl.valueChanges.pipe(
          startWith(null),
          map((client: string | null) => client ? this.Cl_filter(client) : this.ClStrArr.slice())
        );                                
      });
      this._authService.getListPerformance(this.ListOwner, this.ListManager, this.Recency, '', this.startDate, this.endDate)
      .subscribe(data => {
        this.ListPerformanceArr = data;
        this.ListPerformanceArr.forEach(p => { p.Measure.Expanded = false; p.Measure["Selected"] = true; });
        this.Summary = this._g.ListPerformanceSummary(this.ListPerformanceArr);
        this.pageReady = true;
      });    
   });
  }

  ToogleChecks(element: any) {
    element.Measure["Checked"] = !element.Measure["Checked"];
    this.Summary = this._g.ListPerformanceSummary(this.ListPerformanceArr);
  }

  LoadValues(listowner:string, listmanager:string, recency:string, startdate:any, enddate: any)
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


