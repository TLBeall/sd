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
import { MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
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
  // PieceCount: number;
  // DonationAmount: number;

  constructor() {
    this.weekNum = null;
    this.selected = false;
    this.selectable = false;
    this.days = [];
    this.TotalDonorCount = 0;
    this.NonDonors = 0;
    // this.PieceCount = 0;
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

  private timeSelection = "Year";
  private selectedCount: number;
  public loading: boolean = false;
  private lockedYear: number;
  private lockedMonth: number;
  private lockedDay: number;
  private travelingInCalendar: boolean = false;

  public monthData: CagingMonthElement[];

  private sumTotalDonorCount: number;
  private sumtotalDonationAmount: number;
  private totalNonDonors: number;
  private totalPieceCount: number;
  private totalCardAmount: number;
  private totalCashAmount: number;
  private totalCheckAmount: number;
  private totalCardCount: number;
  private totalCashCount: number;
  private totalCheckCount: number;

  private yearData: any;
  private monthArr: CagingYearElement[];
  private monthElement: CagingYearElement;
  private quarterArr: CagingYearElement[];
  private monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  private quarters = [1, 2, 3, 4];

  private daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  private days: CagingMonthElement[] = [];
  private monthAdjust: number = 0;
  // private dayAdjust: number = 0;
  private yearId: number = 0;
  private setDate: any;
  private currentMonth: string;
  private currentYear: number;
  private startOfWeek: number;
  private daysInPreviousMonth: number;
  private daysInCurrentMonth: number;
  private endOfLastWeek: number;
  private time: string = "currTime";
  private week1: Week;
  private week2: Week;
  private week3: Week;
  private week4: Week;
  private week5: Week;
  private week6: Week;
  private weekList: Week[];

  private dayClientArr: CagingDayElement[];
  private dayMailcodeArr;

  @ViewChild('CLInput') CLInput: ElementRef<HTMLInputElement>;
  private CLStrArr: string[] = new Array<string>();
  private CLControl = new FormControl();
  private CLList: string[] = []; //clients in main returns
  private CLfilteredOptions: Observable<string[]>;
  //For chip selection settings
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  clientPlaceholder = "All Clients -- Select Client"
  //chip selection settings end
  // 

  private firstLoad: boolean = true;
  private RawCagingData: CagingElement;
  private GrandTotal: CagingElement;
  private currentDayD: number;
  private currentMonthD: string;
  private currentYearD: number;
  // ClientColumns: string[] = ['Expand', 'Client', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'];
  ClientColumns: string[] = ['ExpandParent', 'Client', 'Empty', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];

  MailcodeColumns: string[] = ['ExpandChild', 'Mailcode', 'Source', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];


  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this.lockedYear = new Date().getFullYear();
    this.lockedMonth = parseInt(moment().format('M'));
    this.lockedDay = parseInt(moment().format('D'))
    this.loading = true;
    this.CLList = [];
    let dateStart = new Date("1/1/2000");
    let dateEnd = new Date("12/31/" + (new Date()).getFullYear().toString());
    this.yearId = new Date().getFullYear();


    this._authService.getClientsFilter(dateStart, dateEnd).subscribe(data => {
      this.CLStrArr = Array.from(new Set(data.map(item => item.gClientName + ' - ' + item.gClientAcronym))).sort();
      this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
        startWith(null),
        map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
      );
    });
    this.getYearData(this.convertCLList(), this.yearId);
    this.getMonthData(this.convertCLList(), this.yearId, this.lockedMonth);
    // this.getDayData(this.convertCLList(), this.yearId, this.lockedMonth, this.lockedDay);



    // async function dayInit() {
    //   await this.fireYear();
    //   await this.fireMonth();
    //   await this.fireDay();
    // }

    // dayInit();

    // (async () => {
    //   const promise = new Promise(resolve => {
    //     this.getMonthData("", this.yearId, this.lockedMonth);
    //     resolve();
    //   });
    //   await promise;
    //   this.getDayData("", this.yearId, this.lockedMonth, null);

    // })

    // (async () => {
    //   const promise = this.getMonthData("", this.yearId, this.lockedMonth)
    //   await promise;
    //   this.getDayData("", this.yearId, this.lockedMonth, null);

    // })

    // var promise1 = new Promise()

  }

  // fireYear(){
  //   return new Promise(resolve => {
  //     this.getYearData("", this.yearId);
  //     resolve();
  //   })
  // }

  // fireMonth(){
  //   return new Promise(resolve => {
  //     this.getMonthData("", this.yearId, this.lockedMonth);
  //     resolve();
  //   })
  // }

  // fireDay(){
  //   return new Promise(resolve => {
  //     this.getDayData("", this.yearId, this.lockedMonth, null);
  //     resolve();
  //   })
  // }



  /////////////////////////////////// GET DATA FOR DAY /////////////////////////////////////////
  getDayData(CL: string, year: number, month: number, day: number) {
    // this.GrandTotal.CardAmount = 0;
    // this.GrandTotal.CardCount = 0;
    // this.GrandTotal.CashAmount = 0;
    // this.GrandTotal.CashCount = 0;
    // this.GrandTotal.CheckAmount = 0;
    // this.GrandTotal.CheckCount = 0;
    // this.GrandTotal.NonDonors = 0;
    // this.GrandTotal.TotalDonationAmount = 0;
    // this.GrandTotal.TotalDonorCount = 0;

    this._authService.getCagingCalendarData(CL, year, month, day).subscribe(data => {
      this.dayClientArr = data.ClientCalendarList;
      this.RawCagingData = data;
      this.RawCagingData.TotalDonationAmount = this.RawCagingData.CashAmount + this.RawCagingData.CardAmount + this.RawCagingData.CheckAmount;
      this.RawCagingData.TotalDonorCount = this.RawCagingData.CashCount + this.RawCagingData.CardCount + this.RawCagingData.CheckCount;
      this.dayClientArr.forEach(e => {
        e.TotalDonationAmount = e.CardAmount + e.CashAmount + e.CheckAmount;
        e.TotalDonorCount = e.CardCount + e.CashCount + e.CheckCount;
        // this.GrandTotal.CardAmount += e.CardAmount;
        // this.GrandTotal.CardCount += e.CardCount;
        // this.GrandTotal.CashAmount += e.CashAmount;
        // this.GrandTotal.CashCount += e.CashCount;
        // this.GrandTotal.CheckAmount += e.CheckAmount;
        // this.GrandTotal.CheckCount += e.CheckCount;
        // this.GrandTotal.NonDonors += e.NonDonors;
        // this.GrandTotal.TotalDonationAmount += e.TotalDonationAmount;
        // this.GrandTotal.TotalDonorCount += e.TotalDonorCount;
      });
      this.loading = false;
    })
  }



  //////////////////////////////// GET DATA AND INITIATE SETUP FOR MONTH CALENDAR ///////////////////////////////
  getMonthData(CL: string, year: number, month: number) {
    // return new Promise(resolve => {
    // resolve(
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
      // this.monthAdjust -= 0;
      this.days = [];
      this.generateMonthCalendar();
      this.divideIntoWeek();
      this.calculateWeek();
      this.calculateDefaultAllSummary();
      this.loading = false;
    })
    // )
    // })

  }

  /////////////////////////// SETTING UP THE MONTH CALENDAR //////////////////////
  generateMonthCalendar() {
    let data = this.monthData;

    if (this.travelingInCalendar == false) {
      this.currentMonth = moment().add(this.monthAdjust, 'month').format('MMMM');
      this.currentYear = parseInt(moment().add(this.monthAdjust, 'month').format('YYYY'));
      this.startOfWeek = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment().add(this.monthAdjust, 'month').subtract(1, "month").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment().add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.setDate = this.pad(this.getMonthInt(this.currentMonth)) + "-" + "01" + "-" + this.currentYear.toString();
    }

    let count = 42;
    let i = 0;
    let currObj: number;

    //Creating days of previous month
    if (this.startOfWeek != 1) {
      let curr = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      currObj = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      while (curr <= this.daysInPreviousMonth) {
        this.days.push(new CagingMonthElement(currObj, false, false, null, null, null, null, null, null, null, null, null));
        count--;
        i++;
        curr++;
        currObj = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').add(i, 'days').format('D'));
      }
    }

    //Creating days of current month
    i = 0;
    currObj = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
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
      currObj = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
    }

    //Creating days of next month
    i = 1;
    currObj = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    while (i <= this.endOfLastWeek || count > 0) {
      this.days.push(new CagingMonthElement(currObj, false, false, null, null, null, null, null, null, null, null, null));
      count--;
      i++;
      currObj = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    }
    this.travelingInCalendar = false;
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

    // This sets up the day view but only on the first load
    // if (this.firstLoad == true) {
    //   this.getMostRecentDay();
    //   this.getDayData(this.convertCLList(), this.yearId, this.lockedMonth, this.currentDay);
    //   this.firstLoad = false;
    // }
  }



  ///////////////////////////// GETTING AND SETTING UP DATA FOR YEAR CALENDAR //////////////////
  getYearData(CL: string, year: number) {
    var yearData;
    this._authService.getCagingCalendarData(CL, year, null, null).subscribe(data => {
      yearData = data;

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
      yearData.forEach((e, index) => {
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
      this.calculateDefaultAllSummary();
      this.loading = false;
    })
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
          if (element.isActive) {
            element.selected = false;
          }
        });
        e.selected = false;
      } else {
        e.days.forEach(element => {
          if (element.isActive) {
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
      this.checkMonth();
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
      this.checkMonth();
    }
  }



  ////////////////////// FUNCTIONS FOR CHECKING MONTHS IN QUARTERS OR DAYS IN WEEKS -- TO DETERMINE CALCULATION TYPE ///////
  checkMonth() {
    this.selectedCount = 0;
    this.monthArr.forEach(element => {
      if (element.selected == true) {
        this.selectedCount++;
      }
    });

    if (this.selectedCount == 0) {
      this.calculateDefaultAllSummary();
    } else {
      this.calculateSummary();
    }
  }

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
  }



  ///////////////// CONTROLS ON CALENDAR -- NEXT BUTTONS, DEFAULT DATES, 
  nextBtn() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.travelingInCalendar = true;
      this.monthAdjust = 1;
      this.emptyObjects();
      this.setDate = this.pad(this.getMonthInt(this.currentMonth)) + "-" + "01" + "-" + this.currentYear.toString();
      this.currentMonth = moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('MMMM');
      this.currentYear = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('YYYY'));
      this.startOfWeek = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment(this.setDate, "MM-DD-YYYY").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.getMonthData(this.convertCLList(), this.currentYear, this.getMonthInt(this.currentMonth));
    } else if (this.timeSelection == "Year") {
      this.yearId += 1;
      this.getYearData(this.convertCLList(), this.yearId);
    } else if (this.timeSelection == "Day") {
      this.setDate = this.pad(this.getMonthInt(this.currentMonthD)) + "-" + this.currentDayD + "-" + this.currentYearD.toString();
      this.currentDayD = parseInt(moment(this.setDate, "MM-DD-YYYY").add(1, 'day').format('D'));
      this.currentMonthD = moment(this.setDate, "MM-DD-YYYY").add(1, 'day').format('MMMM');
      this.currentYearD = parseInt(moment(this.setDate, "MM-DD-YYYY").add(1, 'day').format('YYYY'));
      this.loading = true;
      this.getDayData(this.convertCLList(), this.currentYearD, this.getMonthInt(this.currentMonthD), this.currentDayD);
    }
  }
  previousBtn() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.travelingInCalendar = true;
      this.monthAdjust = -1;
      this.emptyObjects();
      this.setDate = this.pad(this.getMonthInt(this.currentMonth)) + "-" + "01" + "-" + this.currentYear.toString();
      this.currentMonth = moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('MMMM');
      this.currentYear = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').format('YYYY'));
      this.startOfWeek = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment(this.setDate, "MM-DD-YYYY").subtract(2, "month").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.getMonthData(this.convertCLList(), this.currentYear, this.getMonthInt(this.currentMonth));
    } else if (this.timeSelection == "Year") {
      this.yearId -= 1;
      this.getYearData(this.convertCLList(), this.yearId);
    } else if (this.timeSelection == "Day") {
      this.setDate = this.pad(this.getMonthInt(this.currentMonthD)) + "-" + this.currentDayD + "-" + this.currentYearD.toString();
      this.currentDayD = parseInt(moment(this.setDate, "MM-DD-YYYY").add(-1, 'day').format('D'));
      this.currentMonthD = moment(this.setDate, "MM-DD-YYYY").add(-1, 'day').format('MMMM');
      this.currentYearD = parseInt(moment(this.setDate, "MM-DD-YYYY").add(-1, 'day').format('YYYY'));
      this.loading = true;
      this.getDayData(this.convertCLList(), this.currentYearD, this.getMonthInt(this.currentMonthD), this.currentDayD);
    }
  }

  returnDefault() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.monthAdjust = 0;
      this.emptyObjects();
      this.getMonthData(this.convertCLList(), this.lockedYear, this.lockedMonth)
    } else if (this.timeSelection == "Year") {
      this.yearId = this.lockedYear;
      this.getYearData(this.convertCLList(), this.lockedYear);
    }
  }

  switchToMonth() {
    this.determineCalculationType();
  }

  switchToYear() {
    this.checkMonth();
  }

  switchToDay() {
    if (this.firstLoad == true){
    this.loading = true;
    this.getMostRecentDay();
    this.currentYearD = this.lockedYear;
    this.currentMonthD = this.convertMonthName(this.lockedMonth);
    this.getDayData(this.convertCLList(), this.lockedYear, this.lockedMonth, this.currentDayD);
    this.firstLoad = false;
    }
  }

  travelToMonth(m: CagingYearElement) {
    if (m.selectable == true) {
      m.selected = false;
      this.timeSelection = "Month";
      this.travelingInCalendar = true;
      this.monthAdjust = 0;
      this.currentMonth = this.convertMonthName(m.Month);
      this.currentYear = this.yearId;
      this.setDate = this.pad(m.Month) + "-" + "01" + "-" + this.currentYear.toString();
      this.startOfWeek = parseInt(moment(this.setDate, "MM-DD-YYYY").startOf("month").startOf('week').format('D'));
      this.daysInPreviousMonth = parseInt(moment(this.setDate, "MM-DD-YYYY").subtract(1, "month").endOf("month").format('D'));
      this.daysInCurrentMonth = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf("month").format('D'));
      this.endOfLastWeek = parseInt(moment(this.setDate, "MM-DD-YYYY").add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
      this.loading = true;
      this.emptyObjects();
      this.getMonthData(this.convertCLList(), this.yearId, m.Month)
    }
  }

  travelToDay(element: any) {
    this.loading = true;
    element.selected = false;
    this.currentDayD = element.Day;
    this.currentMonthD = this.currentMonth;
    this.currentYearD = this.currentYear;
    this.timeSelection = "Day";
    this.getDayData(this.convertCLList(), this.currentYearD, this.getMonthInt(this.currentMonthD), this.currentDayD);
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

    this.getYearData(this.convertCLList(), this.yearId);
    this.getMonthData(this.convertCLList(), this.currentYear, this.getMonthInt(this.currentMonth));

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

    this.getYearData(this.convertCLList(), this.yearId);
    this.getMonthData(this.convertCLList(), this.currentYear, this.getMonthInt(this.currentMonth));

    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "All Clients -- Select Client"
    }
  }



  //////////////////// DAY VIEW FUNCTIONS //////////////////////////
  ToggleExpansion(element) {
    element.Expanded = !element.Expanded;
  }



  ///////////////////// MISCELANEOUS HELPER/SUPPORT FUNCTIONS /////////////
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

  getAcronym(Name: string): string {
    var retString: string;
    retString = Name.substring(Name.lastIndexOf('-') + 1, Name.length).trim();
    return retString;
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
    this.currentDayD = 0;
    this.weekList.forEach(a => {
      a.days.forEach(b => {
        if (b.selectable == true) {
          this.currentDayD = b.Day;
        }
      });
    });
    if (this.currentDayD == 0)
      this.currentDayD = this.lockedDay;
  }



  ///////////////////// CALCULATION FUNCTIONS ////////////////////
  calculateSummary() {
    this.sumtotalDonationAmount = 0;
    this.sumTotalDonorCount = 0;
    this.totalNonDonors = 0;
    this.totalPieceCount = 0;
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
    this.totalPieceCount = 0;
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
