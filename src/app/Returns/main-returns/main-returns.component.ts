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
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import * as moment from 'moment';
import { ReturnsClientLRI } from 'src/app/Models/ReturnsClientLRI.model';
import { ReturnsClientWM } from 'src/app/Models/ReturnsClientWM.model';
import { ReturnsClientInc } from 'src/app/Models/ReturnsClientInc.model';
import { IncidentalMonthData } from 'src/app/Models/ReturnsIncidentalMonthData.model';


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

  private loadingTime: string = "";
  private navStart: number = 0;
  private navEnd: number = 0;

  private route: any;
  private startDate: any;
  private endDate: any;
  private pageReady: boolean = false;
  private selectedClients: string[] = new Array<string>();
  private clientName: string;
  private rootReturns: RootReturns[];
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

  private LRITableData: ReturnsClientLRI[];
  private WMTableData: ReturnsClientWM[];
  private IncidentalsTableData: ReturnsClientInc[];
  private IncidentalsTableTypeData: IncidentalMonthData[];
  private psuedoTable = [0]; // Used for the parent utility tables so that they only instantiate 1 row (the summary row)

  //For chip selection settings
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //chip selection settings end

  // clientDisplayedColumns: string[] = ['Expand', 'selectionBox', 'Client', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'CPD', 'Gross', 'Net', 'Cost', 'GPP', 'NLM', 'CLM', 'IO'];
  clientDisplayedColumns: string[] = ['Expand', 'selectionBox', 'Client', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'GPP', 'Cost', 'CLM', 'Net', 'NLM', 'CPD', 'IO'];
  mailTypeDisplayedColumns: string[] = ['Expand', 'selectionBox', 'MailType', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'GPP', 'Cost', 'CLM', 'Net', 'NLM', 'CPD', 'IO'];
  campaignDisplayedColumns: string[] = ['Expand', 'selectionBox', 'CampaignName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'GPP', 'Cost', 'CLM', 'Net', 'NLM', 'CPD', 'IO'];
  phaseDisplayedColumns: string[] = ['Expand', 'selectionBox', 'PhaseName', 'PseudoDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'GPP', 'Cost', 'CLM', 'Net', 'NLM', 'CPD', 'IO'];
  mailListDisplayedColumns: string[] = ['PseudoExpand', 'selectionBox', 'MailCode', 'MailDescription', 'ExchangeFlag', 'Mailed', 'Caged', 'Quantity', 'NonDonors', 'Donors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'GPP', 'Cost', 'CLM', 'Net', 'NLM', 'CPD', 'IO'];

  LRIColumns: string[] = ['LRIDate', 'LRIAmount', 'LRICumulative'];
  WMColumns: string[] = ['WMDate', 'WMNon', 'WMDonors', 'WMGross', 'WMAvg'];
  IncByDateColumns: string[] = ['ExpandIncType', 'IncDate', 'IncMonthAmount'];
  IncTypeColumns: string[] = ['EmptyIncType', 'IncType', 'IncTypeAmount']
  IncCollapsedColumns: string[] = ['IncUtiltyType', 'IncUtilityAmount'];

  // @ViewChild('clientListInput') clientListInput: ElementRef<HTMLInputElement>;
  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('CLInput') CLInput: ElementRef<HTMLInputElement>;


  private CLStrArr: string[] = new Array<string>();
  private CLControl = new FormControl();
  private CLList: string[] = []; //clients in main returns
  private CLfilteredOptions: Observable<string[]>;

  constructor(route: ActivatedRoute, private _authService: AuthService, private _g: GlobalService, private router: Router) {
    this.route = route;
  }

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

      //GET LIST OF CLIENTS FOR DROPDOWN
      this._authService.getClientsFilter(this.startDate, this.endDate).subscribe(data => {
        this.CLStrArr = Array.from(new Set(data.map(item => item.gClientName + ' - ' + item.gClientAcronym))).sort();
        this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
          startWith(null),
          map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
        );
      });

      //GET MAIN RETURNS
      if (params['client']) {
        this._authService.getReturns(params['client'], this.startDate, this.endDate).subscribe(data => {
          if (data) {
            var count = 0;
            this.rootReturns = data;
            this.rootReturns = this._g.SetLastElements(this.rootReturns);
            this.rootReturns = this._g.ExpandAll(this.rootReturns);
            this.rootReturns.forEach(client => {
              client.Index = count;
              count++;
            });
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

          //GET LRI
          this._authService.getLRIforReturns(params['client'], this.startDate, this.endDate).subscribe(data => {
            var temp: ReturnsClientLRI[];
            temp = data;
            temp.forEach(a => {
              a.Expanded = false;
              a.LRIlist.forEach(b => {
                b.Month = moment(b.Month, 'M').format('MMMM');
              });
            });
            this.LRITableData = temp;
          });

          //GET WM
          this._authService.getWMforReturns(params['client'], this.startDate, this.endDate).subscribe(data => {
            var temp: ReturnsClientWM[];
            temp = data;
            temp.forEach(a => {
              a.Expanded = false;
              a.WMs.forEach(b => {
                b.Month = moment(b.Month, 'M').format('MMMM');
              });
            });
            this.WMTableData = temp;
          });

          //GET Incidentals
          this._authService.getIncforReturns(params['client'], this.startDate, this.endDate).subscribe(data => {
            var temp: ReturnsClientInc[];
            var tempType: IncidentalMonthData[] = [];
            temp = data;
            temp.forEach(a => {
              a.Expanded = false;
              a.Incidentals.forEach((b, index) => {
                b.Expanded = false;
                b.Index = index;
                b.Month = moment(b.Month, 'M').format('MMMM');
              });
              tempType = a.Incidentals;
            });

            this.IncidentalsTableData = temp;
            this.IncidentalsTableTypeData = tempType;
            var test = 0;
            // temp = data3;
            // temp.forEach(a => {
            //   a.WMs.forEach(b => {
            //     b.Month = moment(b.Month, 'M').format('MMMM');
            //   });
            // });
            // this.WMTableData = temp;
          });

        });
      }
    });
  }


  //CHIP FILTER START
  private CL_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.CLStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
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

  //CHIP REMOVE START
  CL_Remove(listowner: string): void {
    const index = this.CLList.indexOf(listowner);
    if (index >= 0) {
      this.CLList.splice(index, 1);
    }
  }

  //CHIP DROPDOWN SELECTED START
  CL_Selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.CLList.includes(this.getAcronym(event.option.viewValue))) {
      this.CLList.push(this.getAcronym(event.option.viewValue));

    }
    this.CLInput.nativeElement.value = '';
    this.CLControl.setValue(null);
    this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
      startWith(null),
      map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
    );
    this.CLInput.nativeElement.blur();
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
    var PhaseNumber = Phase.replace(PackageCode, '').replace('ph', '');
    this._g.clearCurCache = true;
    this.router.navigate(['listgross' + '/' + PackageCode + '/' + PhaseNumber + '/' + MailCode]);
  }

  NavigateToPhaseGross(PackageCode: string, Phase: string) {
    this._g.clearCurCache = true;
    var PhaseNumber = Phase.replace(PackageCode, '').replace('ph', '');
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

  ToggleIncExpansion(instance: IncidentalMonthData) {
    instance.Expanded = !instance.Expanded;
  }

  ToggleUtilityExpansion(table: any){
    table.Expanded = !table.Expanded;
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
        case 'PhaseName': return compare(a.Measure.Mailed, b.Measure.Mailed, isAsc);
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


