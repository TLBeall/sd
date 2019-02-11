import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CagingYearElement } from 'src/app/Models/CagingYearElement.model';
import { CagingMonthElement } from 'src/app/Models/CagingMonthElement.model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatMenuTrigger, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { CagingDayElement } from 'src/app/Models/CagingDayElement.model';
import { CagingElement } from 'src/app/Models/CagingElement.model';


export class Week {
  selected: boolean;
  selectable: boolean;
  weekNum: number;
  days: CagingMonthElement[];
  TotalDonationAmount: number;
  TotalDonorCount: number;
  NonDonors: number;

  constructor() {
    this.weekNum = null;
    this.selected = false;
    this.selectable = false;
    this.days = [];
    this.TotalDonorCount = 0;
    this.NonDonors = 0;
    this.TotalDonationAmount = 0;
  }
}



@Component({
  selector: 'app-caging-calendar',
  templateUrl: './caging-calendar.component.html',
  styleUrls: ['./caging-calendar.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class CagingCalendarComponent implements OnInit {
  //PROPERTIES FOR ALL CALENDARS/ENTIRE PAGE
  private timeSelection = "Month";
  public loading: boolean = false;
  private sumTotalDonorCount: number;
  private sumtotalDonationAmount: number;
  private totalNonDonors: number;
  private totalCardAmount: number;
  private totalCashAmount: number;
  private totalCheckAmount: number;
  private totalCardCount: number;
  private totalCashCount: number;
  private totalCheckCount: number;
  private yearArr: number[];
  private monthDrill: boolean;
  private monthSelectArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private storedYear: number;
  @ViewChild('MonthMenuTrigger') MonthMenu: MatMenuTrigger;
  @ViewChild('YearMenuTrigger') YearMenu: MatMenuTrigger;

  //FOR CHIP SELECTION SETTINGS
  @ViewChild('CLInput') CLInput: ElementRef<HTMLInputElement>;
  private CLStrArr: string[] = new Array<string>();
  private CLControl = new FormControl();
  private CLList: string[] = []; //clients in main returns
  private CLfilteredOptions: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  clientPlaceholder = "All Clients -- Select Client"

  //PROPERTIES FOR YEAR VIEW
  private yvYear: number = 0;
  private yearData: any;
  private lockedYear: number;
  private monthArr: CagingYearElement[];
  private quarterArr: CagingYearElement[];
  private monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  private quarters = [1, 2, 3, 4];

  //PROPERTIES FOR MONTH VIEW
  private lockedMonth: number;
  public monthData: CagingMonthElement[];
  private daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  private days: CagingMonthElement[] = [];
  private monthAdjust: number = 0;
  private mvSetDate: any;
  private mvMonth: string;
  private mvYear: number;
  private startOfWeek: number;
  private daysInPreviousMonth: number;
  private daysInCurrentMonth: number;
  private endOfLastWeek: number;
  private week1: Week;
  private week2: Week;
  private week3: Week;
  private week4: Week;
  private week5: Week;
  private week6: Week;
  private weekList: Week[];

  //PROPERTIES FOR DAY VIEW
  private lockedDay: number;
  private dvSetDate: any;
  private dayClientArr: CagingDayElement[];
  private firstLoad: boolean = true;
  private RawCagingData: CagingElement;
  private dvDay: number;
  private dvMonth: string;
  private dvYear: number;
  private allClientsExpanded: boolean = false;
  private selectionMode: boolean = false;
  private checkedRows: number[];
  private tableLoading: boolean;
  private deleteNotation: string;
  private showDeleteModal: boolean = false;
  public ClientColumns: string[];
  public MailcodeColumns: string[];
  @ViewChild('NonDonorInput') NonDonorInput: ElementRef;
  @ViewChild('CashCountInput') CashCountInput: ElementRef;
  @ViewChild('CashAmountInput') CashAmountInput: ElementRef;
  @ViewChild('CardCountInput') CardCountInput: ElementRef;
  @ViewChild('CardAmountInput') CardAmountInput: ElementRef;
  @ViewChild('CheckCountInput') CheckCountInput: ElementRef;
  @ViewChild('CheckAmountInput') CheckAmountInput: ElementRef;


  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this.ClientColumns = ['ExpandParent', 'PsuedoSelection', 'Client', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
    this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
    this.lockedYear = new Date().getFullYear();
    this.lockedMonth = parseInt(moment().format('M'));
    this.lockedDay = parseInt(moment().format('D'))
    this.loading = true;
    this.CLList = [];
    this.dvDay = this.lockedDay;
    this.dvYear = this.lockedYear;
    this.dvMonth = this.convertMonthName(this.lockedMonth);
    this.monthAdjust = 0;
    this.mvMonth = moment().add(this.monthAdjust, 'month').format('MMMM');
    this.mvYear = parseInt(moment().add(this.monthAdjust, 'month').format('YYYY'));
    this.startOfWeek = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
    this.daysInPreviousMonth = parseInt(moment().add(this.monthAdjust, 'month').subtract(1, "month").endOf("month").format('D'));
    this.daysInCurrentMonth = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").format('D'));
    this.endOfLastWeek = parseInt(moment().add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
    this.mvSetDate = this.pad(this.getMonthInt(this.mvMonth)) + "-" + "01" + "-" + this.mvYear.toString();
    this.yvYear = new Date().getFullYear();
    let dateStart = new Date("1/1/2000");
    let dateEnd = new Date("12/31/" + (new Date()).getFullYear().toString());
    this.generateYearSelection();

    this._authService.getClientsFilter(dateStart, dateEnd).subscribe(data => {
      this.CLStrArr = Array.from(new Set(data.map(item => item.gClientName + ' - ' + item.gClientAcronym))).sort();
      this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
        startWith(null),
        map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
      );
    });
    this.getYearData(this.convertCLList(), this.yvYear);
    this.getMonthData(this.convertCLList(), this.yvYear, this.lockedMonth)
      .then(() => {
        this.getMostRecentDay();
        this.calculateDefaultAllSummary();
        this.getDayData(this.convertCLList(), this.lockedYear, this.lockedMonth, this.dvDay)
          .then(() => {
            this.loading = false;
          })
      })
  }



  /////////////////////////////////// GET DATA FOR DAY /////////////////////////////////////////
  getDayData(CL: string, year: number, month: number, day: number) {
    var promise = new Promise((resolve, reject) => {

      this.tableLoading = true;
      this.checkedRows = [];

      this._authService.getCagingCalendarData(CL, year, month, day).subscribe(data => {
        this.dayClientArr = data.ClientCalendarList;
        this.RawCagingData = data;
        this.RawCagingData.TotalDonationAmount = this.RawCagingData.CashAmount + this.RawCagingData.CardAmount + this.RawCagingData.CheckAmount;
        this.RawCagingData.TotalDonorCount = this.RawCagingData.CashCount + this.RawCagingData.CardCount + this.RawCagingData.CheckCount;
        this.dayClientArr.forEach(a => {
          a.TotalDonationAmount = a.CardAmount + a.CashAmount + a.CheckAmount;
          a.TotalDonorCount = a.CardCount + a.CashCount + a.CheckCount;
          a.MailCodeList.forEach(b => {
            b.TotalDonationAmount = b.CardAmount + b.CashAmount + b.CheckAmount;
            b.TotalDonorCount = b.CardCount + b.CashCount + b.CheckCount;
            b.selected = false;
            b.editing = false;
            b.showControl = false;
          });
        });
        this.tableLoading = false;
        resolve();
      })
    })
    return promise;
  }



  //////////////////////////////// GET DATA AND INITIATE SETUP FOR MONTH CALENDAR ///////////////////////////////
  getMonthData(CL: string, year: number, month: number) {
    var promise = new Promise((resolve, reject) => {
      this._authService.getCagingCalendarData(CL, year, month, null).subscribe(data => {
        this.monthData = data;

        //MONTH VIEW - SETUP WEEKS
        this.week1 = new Week;
        this.week2 = new Week;
        this.week3 = new Week;
        this.week4 = new Week;
        this.week5 = new Week;
        this.week6 = new Week;
        this.weekList = [this.week1, this.week2, this.week3, this.week4, this.week5, this.week6];
        this.weekList.forEach((element, index) => {
          element.weekNum = index + 1;
        });

        //MONTH VIEW - SETUP CALENDAR
        this.days = [];
        this.generateMonthCalendar();
        this.divideIntoWeek();
        this.calculateWeek();
        // this.loading = false;
        resolve();
      })
    })
    return promise;
  }

  /////////////////////////// SETTING UP THE MONTH CALENDAR //////////////////////
  generateMonthCalendar() {
    let data = this.monthData;
    let count = 42;
    let i = 0;
    let currObj: number;

    //Creating days of previous month
    if (this.startOfWeek != 1) {
      let curr = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      currObj = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      while (curr <= this.daysInPreviousMonth) {
        this.days.push(new CagingMonthElement(currObj, false, false, null, null, null, null, null, null, null, null, null));
        count--;
        i++;
        curr++;
        currObj = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').add(i, 'days').format('D'));
      }
    }

    //Creating days of current month
    i = 0;
    currObj = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
    let currObjIndex;
    while (i < this.daysInCurrentMonth) {
      currObjIndex = currObj - 1;
      let nondonors = data[currObjIndex].NonDonors;
      let cardamount = data[currObjIndex].CardAmount;
      let cardcount = data[currObjIndex].CardCount;
      let cashamount = data[currObjIndex].CashAmount;
      let cashcount = data[currObjIndex].CashCount;
      let checkamount = data[currObjIndex].CheckAmount;
      let checkcount = data[currObjIndex].CheckCount;
      let totaldonationamount = cardamount + cashamount + checkamount;
      let totaldonorcount = cardcount + cashcount + checkcount;
      let selectable: boolean;
      if (totaldonorcount == 0 && nondonors == 0) {
        selectable = false;
      } else {
        selectable = true;
      }
      this.days.push(new CagingMonthElement(currObj, true, selectable, nondonors, cardamount, cashamount, cardcount, cashcount, checkamount, checkcount, totaldonationamount, totaldonorcount));
      count--;
      i++;
      currObj = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
    }

    //Creating days of next month
    i = 1;
    currObj = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    while (i <= this.endOfLastWeek || count > 0) {
      this.days.push(new CagingMonthElement(currObj, false, false, null, null, null, null, null, null, null, null, null));
      count--;
      i++;
      currObj = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    }
  }

  divideIntoWeek() {
    for (let i = 0; i < 42; i++) {
      let week = Math.floor(i / 7);
      switch (week) {
        case 0:
          this.week1.days.push(this.days[i]);
          break;
        case 1:
          this.week2.days.push(this.days[i]);
          break;
        case 2:
          this.week3.days.push(this.days[i]);
          break;
        case 3:
          this.week4.days.push(this.days[i]);
          break;
        case 4:
          this.week5.days.push(this.days[i]);
          break;
        case 5:
          this.week6.days.push(this.days[i]);
          break;
      }
    }
  }



  ///////////////////////////// GETTING AND SETTING UP DATA FOR YEAR CALENDAR //////////////////
  getYearData(CL: string, year: number) {
    var promise = new Promise((resolve, reject) => {
      this._authService.getCagingCalendarData(CL, year, null, null).subscribe(data => {
        this.yearData = data;

        //YEAR VIEW - CREATE QUARTERS
        this.quarterArr = [];
        this.quarters.forEach((element, index) => {
          let quarter = new CagingYearElement;
          quarter.Quarter = index + 1;
          quarter.selected = false;
          quarter.TotalDonationAmount = 0;
          quarter.TotalDonorCount = 0;
          quarter.NonDonors = 0;
          this.quarterArr.push(quarter);
        });

        //YEAR VIEW - CREATE MONTHS AND ASSOCIATE VALUES WITH QUARTERS
        this.monthArr = [];
        this.yearData.forEach((e, index) => {
          let monthElem = new CagingYearElement;
          monthElem = e;
          let i = monthElem.Quarter - 1;
          monthElem.selected = false;
          monthElem.TotalDonationAmount = monthElem.CashAmount + monthElem.CardAmount + monthElem.CheckAmount;
          monthElem.TotalDonorCount = monthElem.CashCount + monthElem.CardCount + monthElem.CheckCount;
          if (monthElem.TotalDonorCount == 0 && monthElem.NonDonors == 0) {
            monthElem.selectable = false;
          } else {
            monthElem.selectable = true;
          }
          //Setup quarters
          this.quarterArr[i].TotalDonationAmount = this.quarterArr[i].TotalDonationAmount + monthElem.TotalDonationAmount;
          this.quarterArr[i].TotalDonorCount = this.quarterArr[i].TotalDonorCount + monthElem.TotalDonorCount;
          this.quarterArr[i].NonDonors = this.quarterArr[i].NonDonors + monthElem.NonDonors;
          if (this.quarterArr[i].TotalDonorCount == 0 && this.quarterArr[i].NonDonors == 0) {
            this.quarterArr[i].selectable = false;
          } else {
            this.quarterArr[i].selectable = true;
          }
          this.monthArr.push(monthElem);
        });
        // this.determineCalculationType();
        // this.loading = false;
        resolve();
      })
    })
    return promise;
  }



  ////////////////////////////// CALENDAR ELEMENT SELECTION FUNCTIONS ///////////////////////
  selectDayElement(day: CagingMonthElement, week: Week) {
    if (day.selectable == true) {
      day.selected = !day.selected;
      this.checkWeek(week);
      this.determineCalculationType();
    }
  }

  selectWeekElement(e: Week) {
    if (e.selectable == true) {
      if (e.selected == true) {
        e.days.forEach(element => {
          if (element.selectable) {
            element.selected = false;
          }
        });
        e.selected = false;
      } else {
        e.days.forEach(element => {
          if (element.selectable) {
            element.selected = true;
          }
        });
        e.selected = true;
      }
      this.determineCalculationType();
    }
  }

  selectMonthElement(e: CagingYearElement) {
    if (e.selectable == true) {
      e.selected = !e.selected;
      this.checkQuarter();
      this.determineCalculationType();
    }
  }

  selectQuarterElement(e: CagingYearElement) {
    if (e.selectable == true) {
      if (e.selected == false) {
        switch (e.Quarter) {
          case 1:
            this.monthArr[0].selected = true;
            this.monthArr[1].selected = true;
            this.monthArr[2].selected = true;
            break;
          case 2:
            this.monthArr[3].selected = true;
            this.monthArr[4].selected = true;
            this.monthArr[5].selected = true;
            break;
          case 3:
            this.monthArr[6].selected = true;
            this.monthArr[7].selected = true;
            this.monthArr[8].selected = true;
            break;
          case 4:
            this.monthArr[9].selected = true;
            this.monthArr[10].selected = true;
            this.monthArr[11].selected = true;
            break;
        }
        e.selected = true;
      } else {
        switch (e.Quarter) {
          case 1:
            this.monthArr[0].selected = false;
            this.monthArr[1].selected = false;
            this.monthArr[2].selected = false;
            break;
          case 2:
            this.monthArr[3].selected = false;
            this.monthArr[4].selected = false;
            this.monthArr[5].selected = false;
            break;
          case 3:
            this.monthArr[6].selected = false;
            this.monthArr[7].selected = false;
            this.monthArr[8].selected = false;
            break;
          case 4:
            this.monthArr[9].selected = false;
            this.monthArr[10].selected = false;
            this.monthArr[11].selected = false;
            break;
        }
        e.selected = false;
      }
      this.determineCalculationType();
    }
  }



  ////////////////////// FUNCTIONS FOR CHECKING MONTHS IN QUARTERS OR DAYS IN WEEKS -- TO DETERMINE CALCULATION TYPE ///////
  checkQuarter() {
    var q1Arr = [this.monthArr[0], this.monthArr[1], this.monthArr[2]];
    var q2Arr = [this.monthArr[3], this.monthArr[4], this.monthArr[5]];
    var q3Arr = [this.monthArr[6], this.monthArr[7], this.monthArr[8]];
    var q4Arr = [this.monthArr[9], this.monthArr[10], this.monthArr[11]];
    this.quarterArr.forEach(element => {
      switch (element.Quarter) {
        case 1:
          this.QuarterSelectedCheck(q1Arr, element);
          break;
        case 2:
          this.QuarterSelectedCheck(q2Arr, element);
          break;
        case 3:
          this.QuarterSelectedCheck(q3Arr, element);
          break;
        case 4:
          this.QuarterSelectedCheck(q4Arr, element);
          break;
      }
    });
  }

  QuarterSelectedCheck(q: CagingYearElement[], quarterElem) {
    var selectableCount = 0;
    var selected = 0;
    q.forEach(e => {
      if (e.selectable) {
        selectableCount++;
      }
      if (e.selected) {
        selected++
      }
    });

    if (selectableCount > 0) {
      if (selectableCount == selected) {
        quarterElem.selected = true;
      } else {
        quarterElem.selected = false;
      }
    } else {
      quarterElem.selected = false;
    }
  }

  checkWeek(week: Week) {
    var selected = 0;
    var selectable = 0;
    week.days.forEach(element => {
      if (element.selectable) {
        selectable++;
      }
      if (element.selected) {
        selected++;
      }
    });

    if (selectable > 0) {
      if (selectable == selected) {
        week.selected = true;
      } else {
        week.selected = false;
      }
    } else {
      week.selected = false;
    }
  }

  determineCalculationType() {
    var selected = 0
    if (this.timeSelection == "Month") {
      this.weekList.forEach(a => {
        a.days.forEach(b => {
          if (b.selectable) {
            if (b.selected) {
              selected++
            }
          }
        });
      });
      if (selected == 0) {
        this.calculateDefaultAllSummary();
      } else {
        this.calculateSummary();
      }
    } else if (this.timeSelection == "Year") {
      this.monthArr.forEach(element => {
        if (element.selected == true) {
          selected++;
        }
      });
      if (selected == 0) {
        this.calculateDefaultAllSummary();
      } else {
        this.calculateSummary();
      }
    }
  }



  ///////////////// CONTROLS ON CALENDAR -- NEXT BUTTONS, DEFAULT DATES, 
  nextBtn() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.monthAdjust = 1;
      this.emptyObjects();
      this.mvSetDate = this.pad(this.getMonthInt(this.mvMonth)) + "-" + "01" + "-" + this.mvYear.toString();
      this.mvMonth = moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('MMMM');
      this.mvYear = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('YYYY'));
      this.startOfWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
        .then(() => {
          this.calculateDefaultAllSummary();
          this.loading = false;
        });
    } else if (this.timeSelection == "Year") {
      this.loading = true;
      this.yvYear += 1;
      this.getYearData(this.convertCLList(), this.yvYear)
        .then(() => {
          this.calculateDefaultAllSummary();
          this.loading = false;
        });
    } else if (this.timeSelection == "Day") {
      this.loading = true;
      this.dvSetDate = this.pad(this.getMonthInt(this.dvMonth)) + "-" + this.pad(this.dvDay) + "-" + this.dvYear.toString();
      this.dvDay = parseInt(moment(this.dvSetDate, "MM-DD-YYYY").add(1, 'day').format('D'));
      this.dvMonth = moment(this.dvSetDate, "MM-DD-YYYY").add(1, 'day').format('MMMM');
      this.dvYear = parseInt(moment(this.dvSetDate, "MM-DD-YYYY").add(1, 'day').format('YYYY'));
      this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
        .then(() => {
          this.loading = false;
        })
    }
  }
  previousBtn() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.monthAdjust = -1;
      this.emptyObjects();
      this.mvSetDate = this.pad(this.getMonthInt(this.mvMonth)) + "-" + "01" + "-" + this.mvYear.toString();
      this.mvMonth = moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('MMMM');
      this.mvYear = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('YYYY'));
      this.startOfWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").subtract(2, "month").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
        .then(() => {
          this.calculateDefaultAllSummary();
          this.loading = false;
        });
    } else if (this.timeSelection == "Year") {
      this.loading = true;
      this.yvYear -= 1;
      this.getYearData(this.convertCLList(), this.yvYear)
        .then(() => {
          this.calculateDefaultAllSummary();
          this.loading = false
        });
    } else if (this.timeSelection == "Day") {
      this.loading = true;
      this.dvSetDate = this.pad(this.getMonthInt(this.dvMonth)) + "-" + this.pad(this.dvDay) + "-" + this.dvYear.toString();
      this.dvDay = parseInt(moment(this.dvSetDate, "MM-DD-YYYY").add(-1, 'day').format('D'));
      this.dvMonth = moment(this.dvSetDate, "MM-DD-YYYY").add(-1, 'day').format('MMMM');
      this.dvYear = parseInt(moment(this.dvSetDate, "MM-DD-YYYY").add(-1, 'day').format('YYYY'));
      this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
        .then(() => {
          this.loading = false;
        })
    }
  }

  selectAnyDate(elem) {
    this.loading = true;
    var rawDate = elem.value;
    rawDate.replace("/", "-");
    this.dvDay = parseInt(moment(rawDate, "MM-DD-YYYY").format('D'));
    this.dvMonth = moment(rawDate, "MM-DD-YYYY").format('MMMM');
    this.dvYear = parseInt(moment(rawDate, "MM-DD-YYYY").format('YYYY'));
    this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
      .then(() => {
        this.loading = false;
      })
  }

  switchToMonth() {
    this.calculateWeek();
    this.determineCalculationType();
  }

  switchToYear() {
    this.determineCalculationType();
  }

  switchToDay() {
    // if (this.firstLoad == true) {
    //   this.loading = true;
    //   // this.getMostRecentDay();
    //   this.getDayData(this.convertCLList(), this.lockedYear, this.lockedMonth, this.dvDay);
    //   this.firstLoad = false;
    // }
  }

  travelToMonth(m: CagingYearElement) {
    if (m.selectable == true) {
      this.loading = true;
      m.selected = false;
      this.timeSelection = "Month";
      this.monthAdjust = 0;
      this.mvMonth = this.convertMonthName(m.Month);
      this.mvYear = this.yvYear;
      this.mvSetDate = this.pad(m.Month) + "-" + "01" + "-" + this.mvYear.toString();
      this.startOfWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").subtract(1, "month").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.emptyObjects();
      this.getMonthData(this.convertCLList(), this.yvYear, m.Month)
        .then(() => {
          this.calculateDefaultAllSummary();
          this.loading = false;
        });
    }
  }

  travelToDay(element: any) {
    this.loading = true;
    element.selected = false;
    this.dvDay = element.Day;
    this.dvMonth = this.mvMonth;
    this.dvYear = this.mvYear;
    this.timeSelection = "Day";
    this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
      .then(() => {
        this.loading = false;
      })
  }

  selectYearDrop(year: number) {
    if (this.timeSelection == "Year") {
      this.loading = true;
      this.yvYear = year;
      this.getYearData(this.convertCLList(), this.yvYear)
        .then(() => {
          this.calculateDefaultAllSummary();
          this.loading = false;
        });
    } else if (this.timeSelection == "Month") {
      this.monthDrill = true;
      this.storedYear = year;
      this.MonthMenu.openMenu();
    }
  }

  selectMonthDrop(month: number) {
    this.loading = true;
    this.monthAdjust = 0;
    this.emptyObjects();
    this.mvSetDate = this.pad(month) + "-" + "01" + "-" + this.storedYear.toString();
    this.mvMonth = moment(this.mvSetDate, "MM-DD-YYYY").format('MMMM');
    this.mvYear = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").format('YYYY'));
    this.startOfWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").startOf("month").startOf('week').format('D'));
    this.daysInPreviousMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").subtract(1, "month").endOf("month").format('D'));
    this.daysInCurrentMonth = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").endOf("month").format('D'));
    this.endOfLastWeek = parseInt(moment(this.mvSetDate, "MM-DD-YYYY").endOf('month').endOf('week').format('D'));
    this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
      .then(() => {
        this.calculateDefaultAllSummary();
        this.loading = false;
      });
  }

  monthMenuClosed() {
    this.monthDrill = false;
  }

  generatePastYears() {
    var year = this.yearArr[0] - 21;
    var firstYear = this.yearArr[0];
    var tempYearArr = []
    for (year; year < firstYear; year++) {
      tempYearArr.push(year);
    }
    tempYearArr.sort();
    this.yearArr = tempYearArr;
  }

  generateFutureYears() {
    var year = this.yearArr[20] + 21;
    var firstYear = this.yearArr[20];
    var tempYearArr = []
    for (year; year > firstYear; year--) {
      tempYearArr.push(year);
    }
    tempYearArr.sort();
    this.yearArr = tempYearArr;
  }


  ///////////////////// CLIENT SELECTION / CHIP SETTINGS ///////////////////////////
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
  CL_Remove(name: string): void {
    this.loading = true;
    const index = this.CLList.indexOf(name);
    if (index >= 0) {
      this.CLList.splice(index, 1);
    }

    if (this.timeSelection == "Year") {
      this.getYearData(this.convertCLList(), this.yvYear)
        .then(() => {
          this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
            .then(() => {
              this.calculateDefaultAllSummary()
              this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay);
              this.loading = false;
            })
        })
    } else if (this.timeSelection == "Month") {
      this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
        .then(() => {
          this.getYearData(this.convertCLList(), this.yvYear)
            .then(() => {
              this.calculateDefaultAllSummary();
              this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
              this.loading = false;
            })
        })
    } else if (this.timeSelection == "Day") {
      this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
        .then(() => {
          this.getYearData(this.convertCLList(), this.yvYear);
          this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth));
          this.loading = false;
        })
    }

    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "All Clients -- Select Client"
    }
  }

  //CHIP DROPDOWN SELECTED START
  CL_Selected(event: MatAutocompleteSelectedEvent): void {
    this.loading = true;
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

    if (this.timeSelection == "Year") {
      this.getYearData(this.convertCLList(), this.yvYear)
        .then(() => {
          this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
            .then(() => {
              this.calculateDefaultAllSummary()
              this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay);
              this.loading = false;
            })
        })
    } else if (this.timeSelection == "Month") {
      this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth))
        .then(() => {
          this.getYearData(this.convertCLList(), this.yvYear)
            .then(() => {
              this.calculateDefaultAllSummary();
              this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
              this.loading = false;
            })
        })
    } else if (this.timeSelection == "Day") {
      this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
        .then(() => {
          this.getYearData(this.convertCLList(), this.yvYear);
          this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth));
          this.loading = false;
        })
    }

    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "All Clients -- Select Client"
    }
  }



  //////////////////// DAY VIEW FUNCTIONS //////////////////////////
  ToggleEdit(e: CagingElement) {
    e.editing = !e.editing;
  }

  editCaging(e: CagingElement) {
    e.NonDonors = parseFloat(this.NonDonorInput.nativeElement.value);
    e.CashCount = parseFloat(this.CashCountInput.nativeElement.value);
    e.CashAmount = parseFloat(this.CashAmountInput.nativeElement.value);
    e.CardCount = parseFloat(this.CardCountInput.nativeElement.value);
    e.CardAmount = parseFloat(this.CardAmountInput.nativeElement.value);
    e.CheckCount = parseFloat(this.CheckCountInput.nativeElement.value);
    e.CheckAmount = parseFloat(this.CheckAmountInput.nativeElement.value);
    e.ModifiedDate = new Date;
    e.ModifiedBy = "TempUser";
    var validity = this.checkEditValidity(e)[0];
    var message = this.checkEditValidity(e)[1];
    if (validity == true) {
      this.loading = true;
      this._authService.editCaging(e, e.CagingID).subscribe(response => {
        e.editing = false;
        //Need to add function to update all of the ngModels and totals in the table?
        this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay)
          .then(() => {
            this.getYearData(this.convertCLList(), this.yvYear);
            this.getMonthData(this.convertCLList(), this.mvYear, this.getMonthInt(this.mvMonth));
            this.loading = false;
          })
      })
    } else {
      let errorMessage = message + "On " + e.MailCode;
      alert(errorMessage);
    }
  }

  checkEditValidity(e: CagingElement): [boolean, string] {
    var message = ""
    var errors = 0;
    if (Number.isNaN(e.NonDonors)) {
      errors++;
      message += " Enter NonDonors; "
    }
    if (Number.isNaN(e.CashCount)) {
      errors++;
      message += " Enter CashCount; "
    }
    if (Number.isNaN(e.CashAmount)) {
      errors++;
      message += " Enter CashAmount; "
    }
    if (Number.isNaN(e.CardCount)) {
      errors++;
      message += " Enter CardCount; "
    }
    if (Number.isNaN(e.CardAmount)) {
      errors++;
      message += " Enter CardAmount; "
    }
    if (Number.isNaN(e.CheckCount)) {
      errors++;
      message += " Enter CheckCount; "
    }
    if (Number.isNaN(e.CheckAmount)) {
      errors++;
      message += " Enter CheckAmount; "
    }
    if (errors > 0) {
      return [false, message];
    } else {
      return [true, "Input Valid"];
    }
  }

  cancelEdit(e: CagingElement) {
    e.editing = false;
  }

  hoverRow(row: CagingElement) {
    row.showControl = !row.showControl;
  }

  ToggleExpansion(element) {
    if (element.Expanded == true) {
      element.Expanded = false;
      this.ClientColumns = ['ExpandParent', 'PsuedoSelection', 'Client', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
      this.checkClientExpansion();
    } else {
      element.Expanded = true;
      this.ClientColumns = ['ExpandParent', 'PsuedoSelection', 'Client', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross', 'ControlParent'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross', 'ControlChild'];
      this.checkClientExpansion();
    }
  }

  checkClientExpansion() {
    var numberExpanded = 0;
    this.dayClientArr.forEach(element => {
      if (element.Expanded) {
        numberExpanded++;
      }
    });
    if (numberExpanded > 0) {
      this.allClientsExpanded = true;
    } else {
      this.allClientsExpanded = false;
    }
  }

  expandAllClients() {
    if (this.allClientsExpanded == false) {
      this.allClientsExpanded = true;
      this.ClientColumns = ['ExpandParent', 'PsuedoSelection', 'Client', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross', 'ControlParent'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross', 'ControlChild'];
      this.dayClientArr.forEach(element => {
        element.Expanded = true;
      });
    } else {
      this.allClientsExpanded = false;
      this.ClientColumns = ['ExpandParent', 'PsuedoSelection', 'Client', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
      this.dayClientArr.forEach(element => {
        element.Expanded = false;
      });
    }
  }

  toggleSelection() {
    if (this.selectionMode == true) {
      this.selectionMode = false;
      this.dayClientArr.forEach(a => {
        a.MailCodeList.forEach(b => {
          b.selected = false;
        });
      });
      this.checkedRows = null;
    } else {
      this.selectionMode = true;
    }
  }

  updateValue(elem: CagingElement, e: any, type: string) {
    var value = (Number(e.target.value.replace(/[^0-9.-]+/g, ""))).toFixed(2);
    if (type == "Cash") {
      elem.CashAmount = Number(value);
    } else if (type == "Card") {
      elem.CardAmount = Number(value);
    } else if (type == "Check") {
      elem.CheckAmount = Number(value);
    }
  }

  checkSelected(element: CagingElement, event: any) {
    //Setup for multiple selection
    // if (event.shiftKey){
    //   console.log(element.ID);
    // }
    //Multiple selection end

    if (this.checkedRows.includes(element.CagingID)) {
      const index = this.checkedRows.indexOf(element.CagingID);
      this.checkedRows.splice(index, 1);
    } else {
      this.checkedRows.push(element.CagingID);
    }

    if (this.checkedRows.length == 1) {
      this.deleteNotation = "this record";
    } else {
      this.deleteNotation = "multiple records"
    }
  }

  preDelete(event: any) {
    if (this.checkedRows.length > 0)
      this.showDeleteModal = !this.showDeleteModal;
  }

  delete() {
    var checkedArr = "";
    this.checkedRows.forEach((element, index) => {
      if (index == 0) {
        checkedArr = element.toString();
      } else {
        checkedArr = checkedArr + "." + element;
      }
    });
    this._authService.deleteCaging(checkedArr).subscribe();
    setTimeout(() => {
      this.checkedRows = [];
      this.getDayData(this.convertCLList(), this.dvYear, this.getMonthInt(this.dvMonth), this.dvDay);
      this.showDeleteModal = false;
    }, 1000)
  }

  navigateToNew() {
    this.router.navigate(['caging/new'])
  }



  ///////////////////// MISCELANEOUS HELPER/SUPPORT FUNCTIONS /////////////
  getAcronym(Name: string): string {
    var retString: string;
    retString = Name.substring(Name.lastIndexOf('-') + 1, Name.length).trim();
    return retString;
  }

  generateYearSelection() {
    this.yearArr = [];
    this.monthDrill = false;
    this.yearArr.push(this.lockedYear);
    var i;
    var aboveDate = this.lockedYear;
    for (i = 0; i < 10; i++) {
      aboveDate++;
      this.yearArr.push(aboveDate);
    }
    var belowDate = this.lockedYear
    for (i = 0; i < 10; i++) {
      belowDate--;
      this.yearArr.push(belowDate);
    }
    this.yearArr.sort();
  }

  // Used in HTML to set whether a week row has no active days (i.e. it should not render)
  checkActiveWeeks(e: any): boolean {
    let activeDays = 0;
    e.days.forEach(element => {
      if (element.isActive == true) {
        activeDays++
      }
    });
    if (activeDays > 0) {
      return true;
    } else {
      return false;
    }
  }

  convertCLList() {
    let str = "";
    if (this.CLList.length == 0) {
      str = "ALL";
    } else {
      this.CLList.forEach((element, index) => {
        if (index == 0) {
          str = element;
        } else {
          str = str + "." + element;
        }
      });
    }
    return str;
  }

  convertMonthName(m: number) {
    return moment(m, 'MM').format('MMMM');
  }

  getMonthInt(m: any) {
    var test = parseInt(moment().month(m).format("M"));
    return parseInt(moment().month(m).format("M"));
  }

  emptyObjects() {
    if (this.timeSelection == "Month") {
      this.days = [];
      this.weekList = [];
    }
  }

  pad(n: number) {
    if (n.toString().length == 1) {
      return (0 + n.toString()).toString();
    } else {
      return n.toString();
    }
  }

  getMostRecentDay() {
    this.dvDay = 0;
    this.weekList.forEach(a => {
      a.days.forEach(b => {
        if (b.selectable == true) {
          this.dvDay = b.Day;
        }
      });
    });
    if (this.dvDay == 0)
      this.dvDay = this.lockedDay;
  }

  public onTabChange(val: string) {
    this.timeSelection = val;
  }



  ///////////////////// CALCULATION FUNCTIONS ////////////////////
  calculateSummary() {
    this.sumtotalDonationAmount = 0;
    this.sumTotalDonorCount = 0;
    this.totalNonDonors = 0;
    this.totalCardAmount = 0;
    this.totalCardCount = 0;
    this.totalCashAmount = 0;
    this.totalCashCount = 0;
    this.totalCheckAmount = 0;
    this.totalCheckCount = 0;

    if (this.timeSelection == "Year") {
      this.monthArr.forEach(element => {
        if (element.selected == true) {
          this.sumtotalDonationAmount = this.sumtotalDonationAmount + element.TotalDonationAmount;
          this.sumTotalDonorCount = this.sumTotalDonorCount + element.TotalDonorCount;
          this.totalNonDonors = this.totalNonDonors + element.NonDonors;
          this.totalCardAmount = this.totalCardAmount + element.CardAmount;
          this.totalCardCount = this.totalCardCount + element.CardCount;
          this.totalCashAmount = this.totalCashAmount + element.CashAmount;
          this.totalCashCount = this.totalCashCount + element.CashCount;
          this.totalCheckAmount = this.totalCheckAmount + element.CheckAmount;
          this.totalCheckCount = this.totalCheckCount + element.CheckCount;
        }
      });
    } else if (this.timeSelection == "Month") {
      this.days.forEach(element => {
        if (element.isActive == true && element.selected == true) {
          this.sumtotalDonationAmount = this.sumtotalDonationAmount + element.TotalDonationAmount;
          this.sumTotalDonorCount = this.sumTotalDonorCount + element.TotalDonorCount;
          this.totalNonDonors = this.totalNonDonors + element.NonDonors;
          this.totalCardAmount = this.totalCardAmount + element.CardAmount;
          this.totalCardCount = this.totalCardCount + element.CardCount;
          this.totalCashAmount = this.totalCashAmount + element.CashAmount;
          this.totalCashCount = this.totalCashCount + element.CashCount;
          this.totalCheckAmount = this.totalCheckAmount + element.CheckAmount;
          this.totalCheckCount = this.totalCheckCount + element.CheckCount;
        }
      });
    }
  }

  calculateDefaultAllSummary() {
    this.sumtotalDonationAmount = 0;
    this.sumTotalDonorCount = 0;
    this.totalNonDonors = 0;
    this.totalCardAmount = 0;
    this.totalCardCount = 0;
    this.totalCashAmount = 0;
    this.totalCashCount = 0;
    this.totalCheckAmount = 0;
    this.totalCheckCount = 0;

    if (this.timeSelection == "Year") {
      this.monthArr.forEach(element => {
        this.sumtotalDonationAmount = this.sumtotalDonationAmount + element.TotalDonationAmount;
        this.sumTotalDonorCount = this.sumTotalDonorCount + element.TotalDonorCount;
        this.totalNonDonors = this.totalNonDonors + element.NonDonors;
        this.totalCardAmount = this.totalCardAmount + element.CardAmount;
        this.totalCardCount = this.totalCardCount + element.CardCount;
        this.totalCashAmount = this.totalCashAmount + element.CashAmount;
        this.totalCashCount = this.totalCashCount + element.CashCount;
        this.totalCheckAmount = this.totalCheckAmount + element.CheckAmount;
        this.totalCheckCount = this.totalCheckCount + element.CheckCount;
      });
    } else if (this.timeSelection == "Month") {
      this.days.forEach(element => {
        if (element.isActive == true) {
          this.sumtotalDonationAmount = this.sumtotalDonationAmount + element.TotalDonationAmount;
          this.sumTotalDonorCount = this.sumTotalDonorCount + element.TotalDonorCount;
          this.totalNonDonors = this.totalNonDonors + element.NonDonors;
          this.totalCardAmount = this.totalCardAmount + element.CardAmount;
          this.totalCardCount = this.totalCardCount + element.CardCount;
          this.totalCashAmount = this.totalCashAmount + element.CashAmount;
          this.totalCashCount = this.totalCashCount + element.CashCount;
          this.totalCheckAmount = this.totalCheckAmount + element.CheckAmount;
          this.totalCheckCount = this.totalCheckCount + element.CheckCount;
        }
      });
    }
  }

  calculateWeek() {
    this.weekList.forEach(a => {
      a.TotalDonorCount = 0;
      a.NonDonors = 0;
      a.TotalDonationAmount = 0;
      a.days.forEach(b => {
        if (b.isActive) {
          a.TotalDonorCount = a.TotalDonorCount + b.TotalDonorCount;
          a.NonDonors = a.NonDonors + b.NonDonors;
          a.TotalDonationAmount = a.TotalDonationAmount + b.TotalDonationAmount;
        }
        if (a.TotalDonorCount == 0 && a.NonDonors == 0) {
          a.selectable = false;
        } else {
          a.selectable = true;
        }
      });
    });
  }


}
