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
  weekNum: number;
  days: CagingMonthElement[];
  Donors: number;
  NonDonors: number;
  PieceCount: number;
  DonationAmount: number;

  constructor() {
    this.weekNum = null;
    this.selected = false;
    this.days = [];
    this.Donors = 0;
    this.NonDonors = 0;
    this.PieceCount = 0;
    this.DonationAmount = 0;
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

  private totalDonors: number;
  private totalNonDonors: number;
  private totalPieceCount: number;
  private totalGross: number;

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
  clientPlaceholder = "Select Client"
  //chip selection settings end


  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService) { }

  ngOnInit() {
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

    var tempYear;
    this._authService.getCagingCalendarData("ALL", this.yearId, null).subscribe(data => {
      tempYear = data;

      //YEAR VIEW - SETUP MONTHS
      this.monthArr = [];
      tempYear.forEach(e => {
        var monthElem = new CagingYearElement;
        monthElem.Month = e.Month;
        monthElem.Quarter = e.Quarter;

      });

    })

    // for (let i = 0; i < this.monthStrings.length; i++) {
    //   var monthElem = new CagingYearElement;
    //   monthElem.Month = this.monthStrings[i];
    //   monthElem.Donors = this.getRandomInt(25, 100);
    //   monthElem.NonDonors = this.getRandomInt(25, 100);
    //   monthElem.DonationAmount = this.getRandomArbitrary(40, 2000);
    //   monthElem.PieceCount = monthElem.Donors + monthElem.NonDonors;
    //   monthElem.selected = false;
    //   monthElem.Year = 2018;
    //   if (i < 3) {
    //     monthElem.Quarter = 1;
    //   } else if (i < 6) {
    //     monthElem.Quarter = 2;
    //   } else if (i < 9) {
    //     monthElem.Quarter = 3;
    //   } else {
    //     monthElem.Quarter = 4;
    //   }
    //   this.monthArr.push(monthElem);
    // }
    this.calculateTotalSummary();

    //YEAR VIEW - SETUP QUARTERS
    this.quarterArr = [];
    this.quarters.forEach((element, index) => {
      let quarter = new CagingYearElement;
      quarter.Quarter = index + 1;
      quarter.Year = 2018;
      quarter.DonationAmount = 0;
      quarter.Donors = 0;
      quarter.NonDonors = 0;
      quarter.PieceCount = 0;
      quarter.selected = false;
      this.quarterArr.push(quarter);
    });
    this.calculateQuarter();

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
    this.displayCalendar();
    let currMonthId = parseInt(moment().format('M'));
    this.monthAdjust -= 0;
    this.days = [];
    this.displayCalendar();
    this.divideIntoWeek();
    this.calculateWeek();


  }
  /////// END OF INIT //////


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  switchToMonth() {
    this.calculateTotalSummary();
  }

  switchToYear() {
    this.calculateTotalSummary();
  }



  ////////////////////////////// SELECTION FUNCTIONS ///////////////////////
  selectWeekElement(e: Week) {
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
    this.checkWeek(e);
  }

  selectDayElement(day: CagingMonthElement, week: Week) {
    day.selected = !day.selected;
    this.checkWeek(week);
  }

  selectMonthElement(e: CagingYearElement) {
    e.selected = !e.selected;
    this.checkQuarter();
    this.checkMonth();
  }

  selectQuarterElement(e: CagingYearElement) {
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



  ////////////////////// FUNCTIONS FOR CHECKING MONTHS IN QUARTERS OR DAYS IN WEEKS
  checkMonth() {
    this.selectedCount = 0;
    this.monthArr.forEach(element => {
      if (element.selected == true) {
        this.selectedCount++;
      }
    });

    if (this.selectedCount == 0) {
      this.calculateTotalSummary();
    } else {
      this.calculateSummary();
    }
  }

  checkQuarter() {
    this.quarterArr.forEach(element => {
      switch (element.Quarter) {
        case 1:
          if (this.monthArr[0].selected && this.monthArr[1].selected && this.monthArr[2].selected) {
            element.selected = true;
          } else {
            element.selected = false;
          }
          break;
        case 2:
          if (this.monthArr[3].selected && this.monthArr[4].selected && this.monthArr[5].selected) {
            element.selected = true;
          } else {
            element.selected = false;
          }
          break;
        case 3:
          if (this.monthArr[6].selected && this.monthArr[7].selected && this.monthArr[8].selected) {
            element.selected = true;
          } else {
            element.selected = false;
          }
          break;
        case 4:
          if (this.monthArr[9].selected && this.monthArr[10].selected && this.monthArr[11].selected) {
            element.selected = true;
          } else {
            element.selected = false;
          }
          break;
      }
    });
  }

  checkWeek(week: Week) {
    var selectedCount = 0;
    var activeCount = 0;
    week.days.forEach(e => {
      if (e.isActive == true && e.selected == true) {
        selectedCount++
      }
      if (e.isActive == true) {
        activeCount++;
      }
    });

    if (selectedCount == activeCount) {
      week.selected = true;
    } else {
      week.selected = false;
    }
    this.determineSummaryType();
  }

  determineSummaryType() {
    let selectedCount = 0;
    this.weekList.forEach(a => {
      a.days.forEach(b => {
        if (b.isActive == true && b.selected == true) {
          selectedCount++;
        }
      });
    });

    if (selectedCount == 0) {
      this.calculateTotalSummary();
    } else {
      this.calculateSummary();
    }
  }



  /////////////////////////// SETTING UP THE MONTH CALENDAR //////////////////////
  displayCalendar() {
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
        this.days.push(new CagingMonthElement(currObj));
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
    while (i < daysInCurrentMonth) {
      this.days.push(new CagingMonthElement(currObj, true));
      count--;
      i++;
      currObj = parseInt(moment().add(this.monthAdjust, 'month').startOf("month").add(i, 'days').format('D'));
    }

    //Creating days of next month
    i = 1;
    let endOfLastWeek = parseInt(moment().add(this.monthAdjust, 'month').endOf('month').endOf('week').format('D'));
    currObj = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    while (i <= endOfLastWeek || count > 0) {
      this.days.push(new CagingMonthElement(currObj));
      count--;
      i++;
      currObj = parseInt(moment().add(this.monthAdjust, 'month').endOf("month").add(i, 'days').format('D'));
    }
    //this.divideIntoWeek();
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

  nextMonth() {
    if (this.timeSelection == "Month") {
      this.monthAdjust += 1;
      this.emptyObjects();
      this.displayCalendar();
      this.divideIntoWeek();
      this.calculateWeek();
    } else if (this.timeSelection == "Year") {
      this.yearId += 1;
    }
  }
  previousMonth() {
    if (this.timeSelection == "Month") {
      this.monthAdjust -= 1;
      this.emptyObjects();
      this.displayCalendar();
      this.divideIntoWeek();
      this.calculateWeek();
    } else if (this.timeSelection == "Year") {
      this.yearId -= 1;
    }
  }

  emptyObjects() {
    if (this.timeSelection == "Month") {
      this.days = [];
      this.weekList.forEach(element => {
        element.days = [];
        element.selected = false;
      });
    } else if (this.timeSelection == "Year") {

    }
  }



  ///////////////////// CALCULATION FUNCTIONS ////////////////////
  calculateSummary() {
    this.totalDonors = 0;
    this.totalGross = 0;
    this.totalNonDonors = 0;
    this.totalPieceCount = 0;

    if (this.timeSelection == "Year") {
      this.monthArr.forEach(element => {
        if (element.selected == true) {
          this.totalDonors = this.totalDonors + element.Donors;
          this.totalGross = this.totalGross + element.DonationAmount;
          this.totalNonDonors = this.totalNonDonors + element.NonDonors;
          this.totalPieceCount = this.totalPieceCount + element.PieceCount;
        }
      });
    } else if (this.timeSelection == "Month") {
      this.days.forEach(element => {
        if (element.isActive == true && element.selected == true) {
          this.totalDonors = this.totalDonors + element.Donors;
          this.totalNonDonors = this.totalNonDonors + element.NonDonors;
          this.totalPieceCount = this.totalPieceCount + element.PieceCount;
          this.totalGross = this.totalGross + element.DonationAmount;
        }
      });
    }
  }

  calculateTotalSummary() {
    this.totalDonors = 0;
    this.totalGross = 0;
    this.totalNonDonors = 0;
    this.totalPieceCount = 0;

    if (this.timeSelection == "Year") {
      this.monthArr.forEach(element => {
        this.totalDonors = this.totalDonors + element.Donors;
        this.totalGross = this.totalGross + element.DonationAmount;
        this.totalNonDonors = this.totalNonDonors + element.NonDonors;
        this.totalPieceCount = this.totalPieceCount + element.PieceCount;
      });
    } else if (this.timeSelection == "Month") {
      this.days.forEach(element => {
        if (element.isActive == true) {
          this.totalDonors = this.totalDonors + element.Donors;
          this.totalNonDonors = this.totalNonDonors + element.NonDonors;
          this.totalPieceCount = this.totalPieceCount + element.PieceCount;
          this.totalGross = this.totalGross + element.DonationAmount;
        }
      });
    }
  }

  calculateWeek() {
    this.weekList.forEach(a => {
      a.Donors = 0;
      a.NonDonors = 0;
      a.PieceCount = 0;
      a.DonationAmount = 0;
      a.days.forEach(b => {
        if (b.isActive) {
          a.Donors = a.Donors + b.Donors;
          a.NonDonors = a.NonDonors + b.NonDonors;
          a.PieceCount = a.PieceCount + b.PieceCount;
          a.DonationAmount = a.DonationAmount + b.DonationAmount;
        }
      });
    });
  }

  calculateQuarter() {
    this.monthArr.forEach(element => {
      switch (element.Quarter) {
        case 1:
          this.quarterArr[0].DonationAmount = this.quarterArr[0].DonationAmount + element.DonationAmount;
          this.quarterArr[0].Donors = this.quarterArr[0].Donors + element.Donors;
          this.quarterArr[0].NonDonors = this.quarterArr[0].NonDonors + element.Donors;
          this.quarterArr[0].PieceCount = this.quarterArr[0].PieceCount + element.PieceCount;
          break;
        case 2:
          this.quarterArr[1].DonationAmount = this.quarterArr[1].DonationAmount + element.DonationAmount;
          this.quarterArr[1].Donors = this.quarterArr[1].Donors + element.Donors;
          this.quarterArr[1].NonDonors = this.quarterArr[1].NonDonors + element.Donors;
          this.quarterArr[1].PieceCount = this.quarterArr[1].PieceCount + element.PieceCount;
          break;
        case 3:
          this.quarterArr[2].DonationAmount = this.quarterArr[2].DonationAmount + element.DonationAmount;
          this.quarterArr[2].Donors = this.quarterArr[2].Donors + element.Donors;
          this.quarterArr[2].NonDonors = this.quarterArr[2].NonDonors + element.Donors;
          this.quarterArr[2].PieceCount = this.quarterArr[2].PieceCount + element.PieceCount;
          break;
        case 4:
          this.quarterArr[3].DonationAmount = this.quarterArr[3].DonationAmount + element.DonationAmount;
          this.quarterArr[3].Donors = this.quarterArr[3].Donors + element.Donors;
          this.quarterArr[3].NonDonors = this.quarterArr[3].NonDonors + element.Donors;
          this.quarterArr[3].PieceCount = this.quarterArr[3].PieceCount + element.PieceCount;
          break;
      }
    });
  }


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
    const index = this.CLList.indexOf(name);
    if (index >= 0) {
      this.CLList.splice(index, 1);
    }
    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "Select Client"
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

    this.getYearData();

    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "Select Client"
    }
  }

  getAcronym(Name: string): string {
    var retString: string;
    retString = Name.substring(Name.lastIndexOf('-') + 1, Name.length).trim();
    return retString;
  }

  getYearData() {

  }


}
