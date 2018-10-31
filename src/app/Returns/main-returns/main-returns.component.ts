import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Sort, MatTableModule, MatTable, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { LoaderService } from '../../Loader/loader.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RootReturns } from '../../Models/RootReturns.model';
import { GlobalService } from '../../Services/global.service';
import { AuthService } from '../../Services/auth.service';
import { ClientList } from '../../Models/ClientList.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
  private endDate: any;
  private pageReady: boolean = false;
  private selectedClients: string[] = new Array<string>();
  private clientName: string;
  private rootReturns: RootReturns;
  private toolsOpened: Boolean;
  private demoOpened: Boolean;
  private starttimer: number = 0;
  private endtimer: number = 0;
  private hide: Boolean = false;
  private visibility: string = "hidden";
  private ClientArr: ClientList[];
  // private ClientStrArr: string[] = new Array<string>();
  private grandTotal: any;
  // private clientControl = new FormControl();
  // private clients: string[] = [];
  // private filteredOptions: Observable<string[]>;
  private tempStartDate;
  private tempEndDate;
  // private customPage: bool = true;

  //For chip selection settings
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //chip selection settings end

  clientDisplayedColumns: string[] = ['Expand', 'selectionBox', 'Client', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'CPD', 'Gross', 'Net', 'Cost', 'GPP', 'NLM', 'CLM', 'IO'];//, 'PseudoDescription', 'ExchangeFlag', 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  mailTypeDisplayedColumns: string[] = ['Expand', 'selectionBox', 'MailType', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'CPD', 'Gross', 'Net', 'Cost', 'GPP', 'NLM', 'CLM', 'IO'];//, 'PseudoDescription', 'ExchangeFlag',  'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  campaignDisplayedColumns: string[] = ['Expand', 'selectionBox', 'CampaignName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'CPD', 'Gross', 'Net', 'Cost', 'GPP', 'NLM', 'CLM', 'IO'];//, 'PseudoDescription', 'ExchangeFlag',  'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  phaseDisplayedColumns: string[] = ['Expand', 'selectionBox', 'PhaseName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'CPD', 'Gross', 'Net', 'Cost', 'GPP', 'NLM', 'CLM', 'IO'];//, 'PseudoDescription', 'ExchangeFlag',  'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];
  mailListDisplayedColumns: string[] = ['PseudoExpand', 'selectionBox', 'MailCode', 'MailDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'CPD', 'Gross', 'Net', 'Cost', 'GPP', 'NLM', 'CLM', 'IO'];//, 'MailDescription', 'ExchangeFlag' 'NewDonors', 'RSP', 'Gross', 'Net', 'NLM', 'AVG', 'Cost', 'CLM', 'GPP', 'IO'];

  // @ViewChild('clientListInput') clientListInput: ElementRef<HTMLInputElement>;
  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('CLInput') CLInput: ElementRef<HTMLInputElement>;
  @ViewChild('MTInput') MTInput: ElementRef<HTMLInputElement>;
  @ViewChild('CAInput') CAInput: ElementRef<HTMLInputElement>;
  @ViewChild('PHInput') PHInput: ElementRef<HTMLInputElement>;

  private CLStrArr: string[] = new Array<string>();
  private CLControl = new FormControl();
  private CLList: string[] = []; //clients in main returns
  private CLfilteredOptions: Observable<string[]>;

  private MTStrArr: string[] = new Array<string>();
  private MTControl = new FormControl();
  private MTList: string[] = [];
  private MTfilteredOptions: Observable<string[]>;

  private CAStrArr: string[] = new Array<string>();
  private CAControl = new FormControl();
  private CAList: string[] = [];
  private CAfilteredOptions: Observable<string[]>;

  private PHStrArr: string[] = new Array<string>();
  private PHControl = new FormControl();
  private PHList: string[] = [];
  private PHfilteredOptions: Observable<string[]>;



  constructor(route: ActivatedRoute, private _authService: AuthService, private _g: GlobalService, private router: Router) {
    this.route = route;
    // this.filteredOptions = this.clientControl.valueChanges.pipe(
    //   startWith(null),
    //   map((client: string | null) => client ? this._filter(client) : this.ClientStrArr.slice())
    // );
  }


  //CHIP FILTER START
  private CL_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.CLStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  private MT_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.MTStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  private CA_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.CAStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  private PH_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.PHStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }

  //CHIP ADD START
  CL_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.CLList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.CLControl.setValue(null);
  }
  MT_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.MTList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.MTControl.setValue(null);
  }
  CA_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.CAList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.CAControl.setValue(null);
  }
  PH_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.PHList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.PHControl.setValue(null);
  }

  //CHIP REMOVE START
  CL_Remove(listowner: string): void {
    const index = this.CLList.indexOf(listowner);
    if (index >= 0) {
      this.CLList.splice(index, 1);
    }
  }
  MT_Remove(listmanager: string): void {
    const index = this.MTList.indexOf(listmanager);
    if (index >= 0) {
      this.MTList.splice(index, 1);
    }
  }
  CA_Remove(recency: string): void {
    const index = this.CAList.indexOf(recency);
    if (index >= 0) {
      this.CAList.splice(index, 1);
    }
  }
  PH_Remove(client: string): void {
    const index = this.PHList.indexOf(client);
    if (index >= 0) {
      this.PHList.splice(index, 1);
    }
  }

  //CHIP DROPDOWN SELECTED START
  CL_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.CLList.includes(this.getAcronym(event.option.viewValue)))
    {
      this.CLList.push(this.getAcronym(event.option.viewValue));
      this._authService.getMailTypeFilter(this.getAcronym(event.option.viewValue), this.startDate, this.endDate).subscribe(data => {
        this.MTStrArr = Array.from(new Set(data.map(item => item))).sort();
        this.MTStrArr.forEach(p => this.MTList.push(p));          
        this.MTfilteredOptions =  this.MTControl.valueChanges.pipe(
          startWith(null),
          map((mailType: string | null) => mailType ? this.MT_filter(mailType) : this.MTStrArr.slice())
        );
      });

      this._authService.getCampaignFilterByClients(this.getAcronym(event.option.viewValue), this.startDate, this.endDate).subscribe(data => {
        this.CAStrArr = Array.from(new Set(data.map(item => item))).sort();
        this.CAStrArr.forEach(p => this.CAList.push(p));          
        this.CAfilteredOptions =  this.CAControl.valueChanges.pipe(
          startWith(null),
          map((campaign: string | null) => campaign ? this.MT_filter(campaign) : this.CAStrArr.slice())
        );
      });     
      
      this._authService.getPhaseFilterByClients(this.getAcronym(event.option.viewValue), this.startDate, this.endDate).subscribe(data => {
        this.PHStrArr = Array.from(new Set(data.map(item => item))).sort();
        this.PHStrArr.forEach(p => this.PHList.push(p));            
        this.PHfilteredOptions =  this.PHControl.valueChanges.pipe(
          startWith(null),
          map((phase: string | null) => phase ? this.MT_filter(phase) : this.PHStrArr.slice())
        );
      });         

    }
    this.CLInput.nativeElement.value = '';
    this.CLControl.setValue(null);
    this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
      startWith(null),
      map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
    );
    this.CLInput.nativeElement.blur();
  }
  MT_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.MTList.includes(this.getAcronym(event.option.viewValue)))
      this.MTList.push(this.getAcronym(event.option.viewValue));
    this.MTInput.nativeElement.value = '';
    this.MTControl.setValue(null);
    this.MTfilteredOptions = this.MTControl.valueChanges.pipe(
      startWith(null),
      map((mailtype: string | null) => mailtype ? this.MT_filter(mailtype) : this.MTStrArr.slice())
    );
    this.MTInput.nativeElement.blur();
  }
  CA_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.CAList.includes(this.getAcronym(event.option.viewValue)))
      this.CAList.push(this.getAcronym(event.option.viewValue));
    this.CAInput.nativeElement.value = '';
    this.CAControl.setValue(null);
    this.CAfilteredOptions = this.CAControl.valueChanges.pipe(
      startWith(null),
      map((campaign: string | null) => campaign ? this.CA_filter(campaign) : this.CAStrArr.slice())
    );
    this.CAInput.nativeElement.blur();
  }
  PH_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.PHList.includes(this.getAcronym(event.option.viewValue)))
      this.PHList.push(this.getAcronym(event.option.viewValue));
    this.PHInput.nativeElement.value = '';
    this.PHControl.setValue(null);
    this.PHfilteredOptions = this.PHControl.valueChanges.pipe(
      startWith(null),
      map((phase: string | null) => phase ? this.PH_filter(phase) : this.PHStrArr.slice())
    );
    this.PHInput.nativeElement.blur();
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our client
  //   if ((value || '').trim()) {
  //     this.clients.push(value.trim().toUpperCase());
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }

  //   this.clientControl.setValue(null);
  // }

  // remove(client: string): void {
  //   const index = this.clients.indexOf(client);

  //   if (index >= 0) {
  //     this.clients.splice(index, 1);
  //   }
  // }


  // selected(event: MatAutocompleteSelectedEvent): void {
  //   if (!this.clients.includes(this.getAcronym(event.option.viewValue)))
  //     this.clients.push(this.getAcronym(event.option.viewValue));
  //   this.clientListInput.nativeElement.value = '';
  //   this.clientControl.setValue(null);
  //   this.filteredOptions = this.clientControl.valueChanges.pipe(
  //     startWith(null),
  //     map((client: string | null) => client ? this._filter(client) : this.ClientStrArr.slice())
  //   );
  //   this.clientListInput.nativeElement.blur();
  // }



  // private _filter(name: string): string[] {
  //   if (name == null)
  //     return null;
  //   const filterValue = name.toLowerCase();
  //   return this.ClientStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  // }

  // ngOnInit() {

  //   this.pageReady = false;
  //   this.clients = [];
  //   this.route.params.subscribe(params => {
  //     if (!params['client'])
  //     {
  //       this.rootReturns = null;
  //       this.pageReady = true;
  //       this.startDate = new Date("1/1/" + (new Date()).getFullYear().toString());
  //       this.endDate = new Date("12/31/" + (new Date()).getFullYear().toString());
  //     }
  //     else
  //       this.LoadValues(params['client'], params['from'], params['to']);
  //     if (params['client'])
  //       this._authService.getReturns(params['client'], this.startDate, this.endDate).subscribe(data => {
  //         if (data) {
  //           this.rootReturns = data;
  //           this.rootReturns = this._g.SetLastElements(this.rootReturns);
  //           this.rootReturns = this._g.ExpandAll(this.rootReturns);
  //           this.pageReady = true;
  //           var i = 0;
  //           while (this.rootReturns[i]) {
  //             this.CheckLevel(this.rootReturns[i], true);
  //             i = i + 1;
  //           }
  //           var calculations = this._g.CalculateSummaries(this.rootReturns);
  //           this.rootReturns = calculations.rootReturns;
  //           this.grandTotal = calculations.grandTotal;
  //         }
  //       });

  //     this._authService.getClientList("All")
  //       .subscribe(data => {
  //         this.ClientArr = data;
  //         this.ClientStrArr = [];
  //         this.ClientArr.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
  //         this.filteredOptions = this.clientControl.valueChanges
  //           .pipe(
  //             startWith(''),
  //             map(value => this._filter(value))
  //           );
  //         if (params['client'] && (this.clients.length != this.selectedClients.length)) {
  //           this.clients = [];
  //           this.selectedClients.forEach(p => this.clients.push(p));
  //         }
  //       });
  //   });
  // }

  ngOnInit() {

    this.pageReady = false;
    this.CLList = [];

    this.route.params.subscribe(params => {
      if (!params['client']) {
        this.rootReturns = null;
        this.pageReady = true;
        this.startDate = new Date("1/1/" + (new Date()).getFullYear().toString());
        this.endDate = new Date("12/31/" + (new Date()).getFullYear().toString());
      }
      else
        this.LoadValues(params['client'], params['mailtype'], params['campaign'], params['phase'], params['startdate'], params['enddate']);

        this._authService.getClientsFilter(this.startDate, this.endDate).subscribe(data => {
          this.CLStrArr = Array.from(new Set(data.map(item => item.gClientName + ' - ' + item.gClientAcronym))).sort();
          this.CLfilteredOptions =  this.CLControl.valueChanges.pipe(
            startWith(null),
            map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
          );
        });
                
      if (params['client']) {
        this._authService.getMailTypeFilter(params['client'], this.startDate, this.endDate).subscribe(data => {
          this.MTStrArr = Array.from(new Set(data.map(item => item))).sort();
          this.MTStrArr.forEach(p => this.MTList.push(p));          
          this.MTfilteredOptions =  this.MTControl.valueChanges.pipe(
            startWith(null),
            map((mailType: string | null) => mailType ? this.MT_filter(mailType) : this.MTStrArr.slice())
          );
        });

        this._authService.getCampaignFilterByClients(params['client'], this.startDate, this.endDate).subscribe(data => {
          this.CAStrArr = Array.from(new Set(data.map(item => item))).sort();
          this.CAStrArr.forEach(p => this.CAList.push(p));          
          this.CAfilteredOptions =  this.CAControl.valueChanges.pipe(
            startWith(null),
            map((campaign: string | null) => campaign ? this.MT_filter(campaign) : this.CAStrArr.slice())
          );
        });     
        
        this._authService.getPhaseFilterByClients(params['client'], this.startDate, this.endDate).subscribe(data => {
          this.PHStrArr = Array.from(new Set(data.map(item => item))).sort();
          this.PHStrArr.forEach(p => this.PHList.push(p));            
          this.PHfilteredOptions =  this.PHControl.valueChanges.pipe(
            startWith(null),
            map((phase: string | null) => phase ? this.MT_filter(phase) : this.PHStrArr.slice())
          );
        });         
        
        this._authService.getReturns(params['client'], this.startDate, this.endDate).subscribe(data => {
          if (data) {
            this.rootReturns = data;
            this.rootReturns = this._g.SetLastElements(this.rootReturns);
            this.rootReturns = this._g.ExpandAll(this.rootReturns);
            this.pageReady = true;
            var i = 0;
            while (this.rootReturns[i]) {
              this.CheckLevel(this.rootReturns[i], true);
              i = i + 1;
            }
            var calculations = this._g.CalculateSummaries(this.rootReturns);
            this.rootReturns = calculations.rootReturns;
            this.grandTotal = calculations.grandTotal;    
          }
        });
      }

      // this._authService.getClientList("All")
      //   .subscribe(data => {
      //     this.ClientArr = data;
      //     this.CLStrArr = [];
      //     this.ClientArr.forEach(p => { this.CLStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
      //     this.CLfilteredOptions = this.CLControl.valueChanges
      //       .pipe(
      //         startWith(''),
      //         map(value => this.CL_filter(value))
      //       );
      //     if (params['client'] && (this.CLList.length != this.selectedClients.length)) {
      //       this.CLList = [];
      //       this.selectedClients.forEach(p => this.CLList.push(p));
      //     }
      //   });
    });
  }

  getAcronym(Name: string): string {
    var retString: string;
    retString = Name.substring(Name.lastIndexOf('-') + 1, Name.length).trim();
    return retString;
  }

  LoadValues(client: string, mailtype: string, campaign: string, phase: string, startDate: any, endDate: any) {
    // this.selectedClients = [];
    client.split('.').forEach(p => this.CLList.push(p));
    this.startDate = new Date(Date.parse(startDate.split('.')[0].toString() + '/' + startDate.split('.')[1].toString() + '/' + startDate.split('.')[2].toString()));
    this.endDate = new Date(Date.parse(endDate.split('.')[0].toString() + '/' + endDate.split('.')[1].toString() + '/' + endDate.split('.')[2].toString()));
  }


  NavigateToListPerformance(ListOwner: string, ListManager: string, Recency: string, startDate: Date, endDate: Date) {
    this._g.clearCurCache = true;
    if (!ListOwner) ListOwner = '_';
    if (!ListManager) ListManager = '_';
    if (!Recency) {
      Recency = '_';
      if ((ListManager != 'NOVA') && (ListManager != '_'))
        ListOwner = '_';
    }
    this.router.navigate(['listperformance' + '/' + ListOwner + '/' + ListManager + '/' + Recency + '/' + startDate.toLocaleDateString().split('/').join('.') + '/' + endDate.toLocaleDateString().split('/').join('.')]);
  }

  NavigateToListGross(PackageCode: string, Phase: string, MailCode: string) {
    this._g.clearCurCache = true;
    var phaseInput = Phase.match(/\d/g);
    var PhaseNumber = phaseInput.join("");
    this._g.clearCurCache = true;
    this.router.navigate(['listgross' + '/' + PackageCode + '/' + PhaseNumber + '/' + MailCode]);
  }

  NavigateToPhaseGross(PackageCode: string, Phase: string){
    this._g.clearCurCache = true;
    var phaseInput = Phase.match(/\d/g);
    var PhaseNumber = phaseInput.join("");
    this._g.clearCurCache = true;
    this.router.navigate(['phasegross' + '/' + PackageCode + '/' + PhaseNumber]);
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
    var flag: boolean = false;
    if (this.ReadyToCollapseAll(ChildList))
      SetToExpand = false;
    if (Parent.MailTypeList != null) {
      flag = true;
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
      flag = true;
      ChildList.forEach(a => {
        a.PhaseList.forEach(c => {
          c.Measure.Expanded = SetToExpand;
        })
        a.Measure.Expanded = SetToExpand;
      })
    }

    if (Parent.PhaseList != null) {
      flag = true;
      ChildList.forEach(a => {
        a.Measure.Expanded = SetToExpand;
      })
    }

    if (Parent.Measure) {
      flag = true;
      if (Parent.Measure.Expanded == false)
        Parent.Measure.Expanded = true;
    }

    if (flag == false) {
      ChildList.forEach(x => {
        x.MailTypeList.forEach(a => {
          a.CampaignList.forEach(b => {
            b.PhaseList.forEach(c => {
              c.Measure.Expanded = SetToExpand;
            })
            b.Measure.Expanded = SetToExpand;
          })
          a.Measure.Expanded = SetToExpand;
        })
        x.Measure.Expanded = SetToExpand;
      })
    }
  }


  ToogleChecks(element: any) {
    if (element.Measure.Indeterminate)
      element.Measure.Indeterminate = false;

    var newState = element.Measure.Selected;

    if (element.Client) {
      element.MailTypeList.forEach(a => {
        a.Measure.Selected = newState;
        a.CampaignList.forEach(b => {
          b.Measure.Selected = newState;
          b.PhaseList.forEach(c => {
            c.Measure.Selected = newState;
            c.MailList.forEach(d => {
              d.Measure.Selected = newState;
            });
          });
        });
      });
    }
    if (element.MailType) {
      element.CampaignList.forEach(b => {
        b.Measure.Selected = newState;
        b.PhaseList.forEach(c => {
          c.Measure.Selected = newState;
          c.MailList.forEach(d => {
            d.Measure.Selected = newState;
          });
        });
      });
    }
    if (element.CampaignName) {
      element.PhaseList.forEach(c => {
        c.Measure.Selected = newState;
        c.MailList.forEach(d => {
          d.Measure.Selected = newState;
        });
      });
    }
    if (element.PhaseName) {
      element.MailList.forEach(d => {
        d.Measure.Selected = newState;
      });
    }
    this.RefreshChecks();
    var calculations = this._g.CalculateSummaries(this.rootReturns);
    this.rootReturns = calculations.rootReturns;
    this.grandTotal = calculations.grandTotal;
  }

  RefreshChecks() {
    var i = 0;
    while (this.rootReturns[i]) {
      this.rootReturns[i].Measure["Indeterminate"] = false;
      var alltypeSelected = true;
      var alltypeUnselected = true;
      this.rootReturns[i].MailTypeList.forEach(a => {
        a.Measure["Indeterminate"] = false;
        var allcampSelected = true;
        var allcampUnselected = true;
        a.CampaignList.forEach(b => {
          b.Measure["Indeterminate"] = false;
          var allphasesSelected = true;
          var allphasesUnselected = true;
          b.PhaseList.forEach(c => {
            c.Measure["Indeterminate"] = false;
            var alllistsSelected = true;
            var alllistsUnselected = true;
            c.MailList.forEach(d => {
              if (d.Measure["Selected"] == false)
                alllistsSelected = false;
              if (d.Measure["Selected"] == true)
                alllistsUnselected = false;
            })
            if ((!alllistsSelected) && (!alllistsUnselected))
              c.Measure["Indeterminate"] = true;
            if (alllistsSelected) {
              c.Measure["Selected"] = true;
              c.Measure["Indeterminate"] = false;
            }
            if (alllistsUnselected) {
              c.Measure["Selected"] = false;
              c.Measure["Indeterminate"] = false;
            }
            if (c.Measure["Selected"] == false || c.Measure["Indeterminate"])
              allphasesSelected = false;
            if (c.Measure["Selected"] == true || c.Measure["Indeterminate"])
              allphasesUnselected = false;
          })
          if ((!allphasesSelected) && (!allphasesUnselected))
            b.Measure["Indeterminate"] = true;
          if (allphasesSelected) {
            b.Measure["Selected"] = true;
            b.Measure["Indeterminate"] = false;
          }
          if (allphasesUnselected) {
            b.Measure["Selected"] = false;
            b.Measure["Indeterminate"] = false;
          }
          if (b.Measure["Selected"] == false || b.Measure["Indeterminate"])
            allcampSelected = false;
          if (b.Measure["Selected"] == true || b.Measure["Indeterminate"])
            allcampUnselected = false;
        })
        if ((!allcampSelected) && (!allcampUnselected))
          a.Measure["Indeterminate"] = true;
        if (allcampSelected) {
          a.Measure["Selected"] = true;
          a.Measure["Indeterminate"] = false;
        }
        if (allcampUnselected) {
          a.Measure["Selected"] = false;
          a.Measure["Indeterminate"] = false;
        }
        if (a.Measure["Selected"] == false || a.Measure["Indeterminate"])
          alltypeSelected = false;
        if (a.Measure["Selected"] == true || a.Measure["Indeterminate"])
          alltypeUnselected = false;
      });
      if ((!alltypeSelected) && (!alltypeUnselected))
        this.rootReturns[i].Measure["Indeterminate"] = true;
      if (alltypeSelected) {
        this.rootReturns[i].Measure["Selected"] = true;
        this.rootReturns[i].Measure["Indeterminate"] = false;
      }
      if (alltypeUnselected) {
        this.rootReturns[i].Measure["Selected"] = false;
        this.rootReturns[i].Measure["Indeterminate"] = false;
      }
      i = i + 1;
    }
  }

  //Indeterminate
  CheckLevel(Node: any, State: boolean): RootReturns {
    if (Node.MailTypeList != null) {
      Node.MailTypeList.forEach(a => {
        a.CampaignList.forEach(b => {
          b.PhaseList.forEach(c => {
            c.MailList.forEach(d => { d.Measure["Selected"] = State; d.Measure["Indeterminate"] = false; });
            c.Measure["Selected"] = State;
            c.Measure["Indeterminate"] = false;

          });
          b.Measure["Selected"] = State;
          b.Measure["Indeterminate"] = false;
        });
        a.Measure["Selected"] = State;
        a.Measure["Indeterminate"] = false;
      });
      Node.Measure["Selected"] = State;
      Node.Measure["Indeterminate"] = false;
      return Node;
    }
    else {

      if (Node.CampaignList != null) {
        Node.CampaignList.forEach(a => {
          a.PhaseList.forEach(c => {
            c.MailList.forEach(d => { d.Measure["Selected"] = State; d.Measure["Indeterminate"] = false; })
            c.Measure["Selected"] = State;
            c.Measure["Indeterminate"] = false;
          })
          a.Measure["Selected"] = State;
          a.Measure["Indeterminate"] = false;
        });
        Node.Measure["Selected"] = State;
        Node.Measure["Indeterminate"] = false;
        return Node;
      }
      else {

        if (Node.PhaseList != null) {
          Node.PhaseList.forEach(a => {
            a.MailList.forEach(d => { d.Measure["Selected"] = State; d.Measure["Indeterminate"] = false; })
            a.Measure["Selected"] = State;
            a.Measure["Indeterminate"] = false;
          });
          Node.Measure["Selected"] = State;
          Node.Measure["Indeterminate"] = false;
          return Node;
        }
      }
    }
    Node.Measure["Selected"] = State;
    Node.Measure["Indeterminate"] = false;
    return Node;
  }

  ToggleExpansion(Element: any) {
    if (Element.Measure)
      Element.Measure.Expanded = !Element.Measure.Expanded;
  }

  onResults(ReturnedResults: any): any {
    this.clientName = this._g.clientArr.find(p => p.gClientAcronym == ReturnedResults[0].Client).gClientName;
    this.rootReturns = ReturnedResults;
  }

  SortFunction(sort: Sort, Element: any) {
    var data: any;
    var myType: string = "";

    if (Element.MailTypeList) myType = "MailTypeList";
    if (Element.CampaignList) myType = "MailType";
    if (Element.PhaseList) myType = "Campaign";
    if (Element.MailList) myType = "Phase";
    if (myType == "") myType = "Client";

    switch (myType) {
      case "Client": {
        if (this.ReadyToCollapseAll(Element))
          this.NextLevel(Element, Element);
        data = Element.slice();
        break;
      }
      case "MailTypeList": {
        if (this.ReadyToCollapseAll(Element.MailTypeList))
          this.NextLevel(Element, Element.MailTypeList);
        data = Element.MailTypeList.slice();
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
        case "Client": {
          sort.active = "Client";
          break;
        }
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
          break;
        }
      }
    }


    var sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Client': return compare(a.Client, b.Client, isAsc);
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
        case 'CPD': return compare(a.Measure.CPD, b.Measure.CPD, isAsc);
        case 'IO': return compare(a.Measure.IO, b.Measure.IO, isAsc);
        default: return 0;
      }
    });


    switch (myType) {
      case "Client": {
        sort.active = "Client";
        this.rootReturns = sortedData;
        break;
      }
      case "MailTypeList": {
        sort.active = "MailType";
        Element.MailTypeList = sortedData;
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
        break;
      }
    }
    this._g.SetLastElements(this.rootReturns);
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
    this.hide = !this.hide;
    this.visibleFunction();
  }

  applyChanges() {
    var clientsStr = "";
    if (this.CLList.length > 1) {
      this.CLList.forEach(element => { clientsStr = element + "." + clientsStr; });
      clientsStr = clientsStr.substring(0, clientsStr.length - 1);
    }
    else clientsStr = this.CLList[0];
    this.closeToolbox();
    this._g.clearCurCache = true;
    this.router.navigate(['/returns/' + clientsStr + '/' + this.startDate.toLocaleDateString().split('/').join('.') + '/' + this.endDate.toLocaleDateString().split('/').join('.')]);
  }

  validateDate(): boolean {
    this.tempStartDate = this.startDateInput.nativeElement.value;
    this.tempEndDate = this.endDateInput.nativeElement.value;
    var reg = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
    if (this.tempStartDate.match(reg) && this.tempEndDate.match(reg)) {
      return true;
    } else {
      return false;
    }
  }
}

function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
