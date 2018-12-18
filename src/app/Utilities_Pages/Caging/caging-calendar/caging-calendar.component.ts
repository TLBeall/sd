import { Component, OnInit } from '@angular/core';
import { CagingCalendarElement } from 'src/app/Models/CagingCalendarElement.model';
import { P } from '@angular/cdk/keycodes';

export class CagingQuarterElement {
  Quarter: string;
  Donors: number;
  NonDonors: number;
  DonationAmount: number;
  PieceCount: number;
  selected: boolean;
}

@Component({
  selector: 'app-caging-calendar',
  templateUrl: './caging-calendar.component.html',
  styleUrls: ['./caging-calendar.component.scss']
})
export class CagingCalendarComponent implements OnInit {

  private totalDonors: number;
  private totalNonDonors: number;
  private totalPieceCount: number;
  private totalGross: number;

  private elementSelected = false;
  private selectedArr: CagingCalendarElement[] = [];

  private monthArr: CagingCalendarElement[];
  private monthElement: CagingCalendarElement;
  private quarterArr: CagingQuarterElement[];
  private monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  constructor() { }

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
      this.monthArr.push(monthElem);
    }
    this.calculateSummary(this.monthArr);

    let Q1 = new CagingQuarterElement;
    Q1.Quarter = "Q1";
    Q1.selected = false;
    let Q2 = new CagingQuarterElement;
    Q2.Quarter = "Q2";
    Q2.selected = false;
    let Q3 = new CagingQuarterElement;
    Q3.Quarter = "Q3";
    Q3.selected = false;
    let Q4 = new CagingQuarterElement;
    Q4.Quarter = "Q4";
    Q4.selected = false;
    this.quarterArr = [Q1, Q2, Q3, Q4];
    this.quarterArr.forEach(element => {
      switch (element.Quarter) {
        case "Q1":
          element.Donors = this.monthArr[0].Donors + this.monthArr[1].Donors + this.monthArr[2].Donors;
          element.DonationAmount = this.monthArr[0].DonationAmount + this.monthArr[1].DonationAmount + this.monthArr[2].DonationAmount;
          element.NonDonors = this.monthArr[0].NonDonors + this.monthArr[1].NonDonors + this.monthArr[2].NonDonors;
          element.PieceCount = this.monthArr[0].PieceCount + this.monthArr[1].PieceCount + this.monthArr[2].PieceCount;

          break;
        case "Q2":
          element.Donors = this.monthArr[3].Donors + this.monthArr[4].Donors + this.monthArr[5].Donors;
          element.DonationAmount = this.monthArr[3].DonationAmount + this.monthArr[4].DonationAmount + this.monthArr[5].DonationAmount;
          element.NonDonors = this.monthArr[3].NonDonors + this.monthArr[4].NonDonors + this.monthArr[5].NonDonors;
          element.PieceCount = this.monthArr[3].PieceCount + this.monthArr[4].PieceCount + this.monthArr[5].PieceCount;
          element.selected = false;
          break;
        case "Q3":
          element.Donors = this.monthArr[6].Donors + this.monthArr[7].Donors + this.monthArr[8].Donors;
          element.DonationAmount = this.monthArr[6].DonationAmount + this.monthArr[7].DonationAmount + this.monthArr[8].DonationAmount;
          element.NonDonors = this.monthArr[6].NonDonors + this.monthArr[7].NonDonors + this.monthArr[8].NonDonors;
          element.PieceCount = this.monthArr[6].PieceCount + this.monthArr[7].PieceCount + this.monthArr[8].PieceCount;
          element.selected = false;
          break;
        case "Q4":
          element.Donors = this.monthArr[9].Donors + this.monthArr[10].Donors + this.monthArr[11].Donors;
          element.DonationAmount = this.monthArr[9].DonationAmount + this.monthArr[10].DonationAmount + this.monthArr[11].DonationAmount;
          element.NonDonors = this.monthArr[9].NonDonors + this.monthArr[10].NonDonors + this.monthArr[11].NonDonors;
          element.PieceCount = this.monthArr[9].PieceCount + this.monthArr[10].PieceCount + this.monthArr[11].PieceCount;
          element.selected = false;
          break;
      }
    });


  }

  selectMonthElement(e: CagingCalendarElement) {
    if (this.selectedArr.length == 1) {
      if (e.selected == true) {
        e.selected = false;
        this.selectedArr = this.selectedArr.filter(e => e.selected == true);
        this.calculateSummary(this.monthArr);
      } else {
        e.selected = true;
        this.selectedArr.push(e);
        this.calculateSummary(this.selectedArr);
      }
    } else {
      if (e.selected == true) {
        e.selected = false;
        this.selectedArr = this.selectedArr.filter(e => e.selected == true);
        this.calculateSummary(this.selectedArr);
      } else {
        e.selected = true;
        this.selectedArr.push(e);
        this.calculateSummary(this.selectedArr);
      }
    }
  }

  selectQuarterElement(e: CagingQuarterElement){
    e.selected != e.selected;
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

  calculateSummary(array: CagingCalendarElement[]) {
    this.totalDonors = 0;
    this.totalGross = 0;
    this.totalNonDonors = 0;
    this.totalPieceCount = 0;

    array.forEach(element => {
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

}
