import { Component, OnInit } from '@angular/core';
import { CagingCalendarElement } from 'src/app/Models/CagingCalendarElement.model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

export class CagingQuarterElement {
  Donors: number;
  NonDonors: number;
  DonationAmount: number;
  PieceCount: number;
  selected: boolean;
}

export class Day {
  day: string;
  isActive: boolean;
  more: boolean;

  constructor(d: string, active: boolean = false, more: boolean = true) {
    this.day = d;
    this.isActive = active;
    this.more = more;
  }
}


@Component({
  selector: 'app-caging-calendar',
  templateUrl: './caging-calendar.component.html',
  styleUrls: ['./caging-calendar.component.scss']
})
export class CagingCalendarComponent implements OnInit {

  private timeSelection = "Year";

  private quarterDonors: number;
  private quarterNonDonors: number;
  private quarterPieceCount: number;
  private quarterGross: number;

  private totalDonors: number;
  private totalNonDonors: number;
  private totalPieceCount: number;
  private totalGross: number;

  private elementSelected = false;
  // private selectedArr: CagingCalendarElement[] = [];
  private selectedCount: number;

  private monthArr: CagingCalendarElement[];
  private monthElement: CagingCalendarElement;
  private quarterArr: CagingCalendarElement[];
  private monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  private quarters = [1, 2, 3, 4];



  daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  days: Day[] = [];
  monthId: number = 0;
  adjust: number = 0;
  currentMonth: string;
  currentYear: string;
  time: string = "currTime";
  week1: Day[] = [];
  week2: Day[] = [];
  week3: Day[] = [];
  week4: Day[] = [];
  week5: Day[] = [];
  week6: Day[] = [];

  weekList = [this.week1, this.week2, this.week3, this.week4, this.week5, this.week6];


  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.monthArr = [];
    for (let i = 0; i < this.monthStrings.length; i++) {
      var monthElem = new CagingCalendarElement;
      monthElem.Month = this.monthStrings[i];
      monthElem.Donors = this.getRandomInt(25, 100);
      monthElem.NonDonors = this.getRandomInt(25, 100);
      monthElem.DonationAmount = this.getRandomArbitrary(40, 2000);
      monthElem.PieceCount = monthElem.Donors + monthElem.NonDonors;
      monthElem.selected = false;
      monthElem.Year = 2018;
      if (i < 3) {
        monthElem.Quarter = 1;
      } else if (i < 6) {
        monthElem.Quarter = 2;
      } else if (i < 9) {
        monthElem.Quarter = 3;
      } else {
        monthElem.Quarter = 4;
      }
      this.monthArr.push(monthElem);
    }
    this.calculateAllSummary();

    this.quarterArr = [];
    this.quarters.forEach((element, index) => {
      let quarter = new CagingCalendarElement;
      quarter.Quarter = index + 1;
      quarter.Year = 2018;
      quarter.DonationAmount = 0;
      quarter.Donors = 0;
      quarter.NonDonors = 0;
      quarter.PieceCount = 0;
      quarter.selected = false;
      this.quarterArr.push(quarter);
    });

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

    this.displayCalender();
    let id = 0;
    let currMonthId = parseInt(moment().format('M'));
    this.adjust -= id;
    this.days = [];
    this.displayCalender();
    this.divideIntoWeek();
  }


  selectMonthElement(e: CagingCalendarElement) {
    e.selected = !e.selected;
    this.checkQuarter();
    this.checkMonth();
  }


  selectQuarterElement(e: CagingCalendarElement) {
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

  checkMonth(){
    this.selectedCount = 0;
    this.monthArr.forEach(element => {
      if (element.selected == true) {
        this.selectedCount++;
      }
    });

    if (this.selectedCount == 0) {
      this.calculateAllSummary();
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

  // selectQuarterElement(e: CagingQuarterElement) {
  //   var stringedMonth: string[] = [];
  //   this.selectedArr.forEach(element => {
  //     stringedMonth.push(element.Month);
  //   });

  //   let month1 = this.monthArr[0];
  //   let month2 = this.monthArr[1];
  //   let month3 = this.monthArr[2];
  //   let month4 = this.monthArr[3];
  //   let month5 = this.monthArr[4];
  //   let month6 = this.monthArr[5];
  //   let month7 = this.monthArr[6];
  //   let month8 = this.monthArr[7];
  //   let month9 = this.monthArr[8];
  //   let month10 = this.monthArr[9];
  //   let month11 = this.monthArr[10];
  //   let month12 = this.monthArr[11];
  //   let q1Arr = [month1, month2, month3];
  //   let q2Arr = [month4, month5, month6];
  //   let q3Arr = [month7, month8, month9];
  //   let q4Arr = [month10, month11, month12];

  //   if (e.selected == false) {
  //     switch (e.Quarter) {
  //       case "Q1":
  //         q1Arr.forEach(element => {
  //           if (!(Object.values(stringedMonth).includes(element.Month)))
  //             element.selected = true;
  //           this.selectedArr.push(element);
  //         });
  //         break;
  //       case "Q2":

  //         break;
  //       case "Q3":
  //         break;
  //       case "Q4":
  //         break;
  //     }
  //     e.selected = true;
  //   } else {
  //     switch (e.Quarter) {
  //       case "Q1":
  //       q1Arr.forEach(element => {
  //         if ((Object.values(stringedMonth).includes(element.Month)))
  //           element.selected = false;
  //           this.selectedArr = this.selectedArr.filter(elem => elem.selected == true);
  //       });
  //     }
  //     e.selected = false;
  //   }
  // }

  // checkQuarterElement(){
  //   array.forEach(element => {

  //   });
  // }

  calculateSummary() {
    this.totalDonors = 0;
    this.totalGross = 0;
    this.totalNonDonors = 0;
    this.totalPieceCount = 0;

    this.monthArr.forEach(element => {
      if (element.selected == true) {
        this.totalDonors = this.totalDonors + element.Donors;
        this.totalGross = this.totalGross + element.DonationAmount;
        this.totalNonDonors = this.totalNonDonors + element.NonDonors;
        this.totalPieceCount = this.totalPieceCount + element.PieceCount;
      }
    });
  }

  calculateAllSummary() {
    this.totalDonors = 0;
    this.totalGross = 0;
    this.totalNonDonors = 0;
    this.totalPieceCount = 0;

    this.monthArr.forEach(element => {
      this.totalDonors = this.totalDonors + element.Donors;
      this.totalGross = this.totalGross + element.DonationAmount;
      this.totalNonDonors = this.totalNonDonors + element.NonDonors;
      this.totalPieceCount = this.totalPieceCount + element.PieceCount;
    });
  }


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }








  displayCalender() {

    this.currentMonth = moment().add(this.adjust, 'month').format('MMMM');
    this.currentYear = moment().add(this.adjust, 'month').format('YYYY');
    let count = 42;
    let i = 0;
    let startOfWeek = parseInt(moment().add(this.adjust, 'month').startOf("month").startOf('week').format('D'));
    let currObj: string;
    //days of previous month
    if (startOfWeek != 1) {
      let daysInPreviousMonth = parseInt(moment().add(this.adjust, 'month').subtract(1, "month").endOf("month").format('D'));

      let curr = parseInt(moment().add(this.adjust, 'month').startOf("month").startOf('week').format('D'));
      currObj = moment().add(this.adjust, 'month').startOf("month").startOf('week').format('D');

      while (curr <= daysInPreviousMonth) {
        this.days.push(new Day(currObj));
        count--;
        i++;
        curr++;

        currObj = moment().add(this.adjust, 'month').startOf("month").startOf('week').add(i, 'days').format('D');

      }
    }

    //days of current month
    let daysInCurrentMonth = parseInt(moment().add(this.adjust, 'month').endOf("month").format('D'));
    i = 0;

    currObj = moment().add(this.adjust, 'month').startOf("month").add(i, 'days').format('D');

    while (i < daysInCurrentMonth) {
      this.days.push(new Day(currObj, true));
      count--;
      i++;
      currObj = moment().add(this.adjust, 'month').startOf("month").add(i, 'days').format('D');

    }

    //days of next month
    i = 1;
    let endOfLastWeek = parseInt(moment().add(this.adjust, 'month').endOf('month').endOf('week').format('D'));
    currObj = moment().add(this.adjust, 'month').endOf("month").add(i, 'days').format('D');
    while (i <= endOfLastWeek || count > 0) {
      this.days.push(new Day(currObj));
      count--;
      i++;
      currObj = moment().add(this.adjust, 'month').endOf("month").add(i, 'days').format('D');
    }

    //this.divideIntoWeek();
  }

  divideIntoWeek() {

    for (let i = 0; i < 42; i++) {

      let week = Math.floor(i / 7);

      switch (week) {
        case 0:
          this.week1.push(this.days[i]);
          break;
        case 1:
          this.week2.push(this.days[i]);
          break;
        case 2:
          this.week3.push(this.days[i]);
          break;
        case 3:
          this.week4.push(this.days[i]);
          break;
        case 4:
          this.week5.push(this.days[i]);
          break;
        case 5:
          this.week6.push(this.days[i]);
          break;
      }
    }


  }
  nextMonth() {
    if (this.timeSelection == "Month") {
      this.adjust += 1;
      this.emptyObjects();
      this.displayCalender();
      this.divideIntoWeek();
    } else if (this.timeSelection == "Year") { }
  }
  previousMonth() {
    if (this.timeSelection == "Month") {
      this.adjust -= 1;
      this.emptyObjects();
      this.displayCalender();
      this.divideIntoWeek();
    } else if (this.timeSelection == "Year") { }
  }

  emptyObjects() {
    if (this.timeSelection == "Month") {
      this.days = [];
      this.week1 = [];
      this.week2 = [];
      this.week3 = [];
      this.week4 = [];
      this.week5 = [];
      this.week6 = [];
    } else if (this.timeSelection == "Year") {

    }
  }


}
