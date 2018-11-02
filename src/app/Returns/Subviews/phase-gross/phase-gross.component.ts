import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { PhaseGross } from 'src/app/Models/PhaseGross.model';
import { ListGross } from 'src/app/Models/ListGross.model';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { tryParse } from 'selenium-webdriver/http';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-phase-gross',
  templateUrl: './phase-gross.component.html',
  styleUrls: ['./phase-gross.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]

})
export class PhaseGrossComponent implements OnInit {
  private route: any;
  private pageReady: boolean = false;
  private PackageCode: string;
  private PhaseNumber: string;
  private PhaseGross: PhaseGross;
  private dateTableVis: boolean = true;
  private mailcodeTableVis: boolean = false;
  private rowExpanded: boolean = false;
  private CurrentTab: string = "date";
  private allExpanded: boolean = false;


  dateColumns: string[] = ['Date', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];
  mailCodeColumns: string[] = ['Expand', 'MailCode', 'Description', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];

  

  constructor(private _authService: AuthService, route: ActivatedRoute, private _g: GlobalService) {
    this.route = route;
  }

 

  getTotalValue(measure: string) {
    return this.PhaseGross.dateGrossList.map(t => t[measure]).reduce((acc, value) => acc + value, 0);
  }

  getTotalValueByMailCode(element:ListGross[], measure: string)
  {
    return element.map(t => t[measure]).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LoadValues(params['packagecode'], params['phasenumber']);

      this._authService.getPhaseGross(this.PackageCode, this.PhaseNumber)
        .subscribe(PhaseList => {
          PhaseList.dateGrossList = this.sortByStartDate(PhaseList.dateGrossList);
          PhaseList.mailCodeList.forEach(element => {
            element.dateGrossList = this.sortByStartDate(element.dateGrossList);
          });
          this.PhaseGross = PhaseList;
          this.pageReady = true;
        });
    });
  }

  LoadValues(packagecode: string, phaseNumber: string) {
    this.PackageCode = packagecode;
    this.PhaseNumber = phaseNumber;
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(data: ListGross[]): ListGross[] {
    return data.sort((a: ListGross, b: ListGross) => {
      return this.getTime(b.Date) - this.getTime(a.Date);
    });
  } 
  
  CollapseListBtn(Element): boolean {
    if (Element["Expanded"])
    {
      if (Element.Expanded == true) {
        return true;
      } else {
        return false;
      }
    }
    else
      Element["Expanded"] = false;
      return false;
  }

  ToggleExpansion(Element: any, ParentList: any[]) {
      Element.Expanded = !Element.Expanded;
      this.RunCheck(ParentList);
  }

  ExpandAllMC(Parent: any, ChildList: any[]){
    if (Parent.mailCodeList != null){
    if (this.allExpanded == false){
      ChildList.forEach(a => {
        a.Expanded = true;
      })
      this.allExpanded = true;
    } else {
      ChildList.forEach(a => {
        a.Expanded = false;
      })
      this.allExpanded = false;
    }
    }
  }

  RunCheck(ParentList: any){
    var i = 0;
    var parentCount = ParentList.length;
    ParentList.forEach(a =>{
      if (a.Expanded == true){
        i++;
      } 
    })
    if (parentCount == i){
      this.allExpanded = true;
    } else {
      this.allExpanded = false;
    }
  }

  tableVisibility(value: any){
    if (value == "mailcode" && this.CurrentTab =="date"){
          this.dateTableVis = !this.dateTableVis;
          this.mailcodeTableVis = !this.mailcodeTableVis;
          this.CurrentTab = "mailcode";
    } else if (value == "date" && this.CurrentTab == "mailcode"){
          this.dateTableVis = !this.dateTableVis;
          this.mailcodeTableVis = !this.mailcodeTableVis;
          this.CurrentTab = "date";
    }
  }

  
}
