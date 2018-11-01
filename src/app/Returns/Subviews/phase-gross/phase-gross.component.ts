import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { PhaseGross } from 'src/app/Models/PhaseGross.model';
import { ListGross } from 'src/app/Models/ListGross.model';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { tryParse } from 'selenium-webdriver/http';

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
        .subscribe(data => {
          data.dateGrossList = this.sortByStartDate(data.dateGrossList);
          data.mailCodeList.forEach(element => {
            element.dateGrossList = this.sortByStartDate(element.dateGrossList);
          });
          this.PhaseGross = data;
          this.pageReady = true;
        });
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

  ToggleExpansion(Element: any) {
      Element.Expanded = !Element.Expanded;
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
  
  tableVisibility(){
      this.dateTableVis = !this.dateTableVis;
      this.mailcodeTableVis = !this.mailcodeTableVis;
  }

}
