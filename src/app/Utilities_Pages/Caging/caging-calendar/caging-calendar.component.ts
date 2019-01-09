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
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/typings/scroll/scroll-strategy';


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
  styleUrls: ['./caging-calendar.component.scss']
})
export class CagingCalendarComponent implements OnInit {

  private timeSelection = "Year";
  private selectedCount: number;
  public loading: boolean = false;
  private lockedYear: number;
  private lockedMonth: number;

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
  private yearId: number = 0;
  // private monthId: number;
  private currentMonth: string;
  private currentYear: number;
  private time: string = "currTime";
  private week1: Week;
  private week2: Week;
  private week3: Week;
  private week4: Week;
  private week5: Week;
  private week6: Week;
  private weekList: Week[];

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


  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this.lockedYear = new Date().getFullYear();
    this.lockedMonth = parseInt(moment().format('M'));
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
    this.getYearData("", this.yearId, null);
    this.getMonthData("", this.yearId, this.lockedMonth)
  }



  //////////////////////////////// GET DATA AND INITIATE SETUP FOR MONTH CALENDAR ///////////////////////////////
  getMonthData(CL: string, year: number, month: number) {
    this._authService.getCagingCalendarData(CL, year, month).subscribe(data => {
      this.monthData = data;
      this.loading = false;

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
      this.monthAdjust -= 0;
      this.days = [];
      this.generateMonthCalendar();
      this.divideIntoWeek();
      this.calculateWeek();
      this.calculateDefaultAllSummary();
    })
  }

  /////////////////////////// SETTING UP THE MONTH CALENDAR //////////////////////
  generateMonthCalendar() {
    let data = this.monthData;
    this.currentMonth = moment().add(this.monthAdjust, 'month').format('MMMM');
    this.currentYear = parseInt(moment().add(this.monthAdjust, 'month').format('YYYY'));
    let count = 42;
    let i = 0;
    let startOfWeek = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
    let currObj: number;

    //Creating days of previous month
    if (startOfWeek != 1) {
      let daysInPreviousMonth = parseInt(moment().add(this.monthAdjust, 'month').subtract(1, "month").endOf("month").format('D'));
      let curr = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      currObj = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").startOf('week').format('D'));
      while (curr <= daysInPreviousMonth) {
        this.days.push(new CagingMonthElement(currObj, false, false, null, null, null, null, null, null, null, null, null));
        count--;
        i++;
        curr++;
        currObj = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").startOf('week').add(i, 'days').format('D'));
      }
    }

    //Creating days of current month
    let daysInCurrentMonth = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").format('D'));
    i = 0;
    currObj = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
    let currObjIndex;
    while (i < daysInCurrentMonth) {
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
      currObj = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
    }

    //Creating days of next month
    i = 1;
    let endOfLastWeek = parseInt(moment().add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
    currObj = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    while (i <= endOfLastWeek || count > 0) {
      this.days.push(new CagingMonthElement(currObj, false, false, null, null, null, null, null, null, null, null, null));
      count--;
      i++;
      currObj = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
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
  getYearData(CL: string, year: number, month: number) {
    var yearData;
    this._authService.getCagingCalendarData(CL, year, month).subscribe(data => {
      yearData = data;
      this.loading = false;

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
      this.monthAdjust += 1;
      this.emptyObjects();
      let currMonth = moment().add(this.monthAdjust, 'month').format('MMMM');
      let currYear = parseInt(moment().add(this.monthAdjust, 'month').format('YYYY'));
      this.getMonthData(this.convertCLList(), currYear, this.getMonthInt(currMonth))
    } else if (this.timeSelection == "Year") {
      this.yearId += 1;
      this.getYearData(this.convertCLList(), this.yearId, null);
    }
  }
  previousBtn() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.monthAdjust -= 1;
      this.emptyObjects();
      let currMonth = moment().add(this.monthAdjust, 'month').format('MMMM');
      let currYear = parseInt(moment().add(this.monthAdjust, 'month').format('YYYY'));
      this.getMonthData(this.convertCLList(), currYear, this.getMonthInt(currMonth));
    } else if (this.timeSelection == "Year") {
      this.yearId -= 1;
      this.getYearData(this.convertCLList(), this.yearId, null);
    }
  }

  returnDefault() {
    this.loading = true;
    if (this.timeSelection == "Month") {
      this.monthAdjust = 0;
      this.currentMonth = this.convertMonthName(this.lockedMonth);
      this.currentYear = this.lockedYear;
      this.emptyObjects();
      this.getMonthData(this.convertCLList(), this.yearId, this.lockedMonth)
    } else if (this.timeSelection == "Year") {
      this.yearId = this.lockedYear;
      this.getYearData(this.convertCLList(), this.lockedYear, null);
    }
  }

  switchToMonth() {
    this.calculateDefaultAllSummary();
  }

  switchToYear() {
    this.calculateDefaultAllSummary();
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

    this.getYearData(this.convertCLList(), this.yearId, null);
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

    this.getYearData(this.convertCLList(), this.yearId, null);
    this.getMonthData(this.convertCLList(), this.currentYear, this.getMonthInt(this.currentMonth));

    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "All Clients -- Select Client"
    }
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
    let str = ""
    this.CLList.forEach((element, index) => {
      if (index == 0) {
        str = element;
      } else {
        str = str + "." + element;
      }
    });
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
