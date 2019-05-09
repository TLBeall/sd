import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ListGross } from 'src/app/Models/ListGross.model';
import { summaryFileName } from '@angular/compiler/src/aot/util';


@Component({
  selector: 'app-list-gross',
  templateUrl: './list-gross.component.html',
  styleUrls: ['./list-gross.component.scss']
})
export class ListGrossComponent implements OnInit {
  public route: any;
  public pageReady: boolean = false;
  public PackageCode: string;
  public PhaseNumber: string;
  public MailCode: string;
  public Client:string;
  public ClientName:string;
  public PackageName:string;
  public PhaseTitle:string;
  public Description:string;
  public ListGrossArr: ListGross[];

  displayedColumns: string[] = ['Date', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];

  constructor(public _authService: AuthService, route: ActivatedRoute, public _g: GlobalService) {
    this.route = route;
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LoadValues(params['packagecode'], params['phasenumber'], params['mailcode']);             

      this._authService.getListGross(this.PackageCode, this.PhaseNumber, this.MailCode)
      .subscribe(data => {
        var temp = this.sortByStartDate(data.dateGrossList);
        this.ListGrossArr = temp;
        this.Client = data.ClientAcronym;
        this.ClientName = data.ClientName;  
        this.MailCode = data.MailCode;
        this.PackageName = data.PackageName;
        this.PhaseTitle = data.PackageTitle;
        this.Description = data.Description;
        this.pageReady = true;
      });    
   });

   
  }


  LoadValues(packagecode:string, phaseNumber:string, mailcode:string)
  {
    this.PackageCode = packagecode;
    this.PhaseNumber = phaseNumber;
    this.MailCode = mailcode;
  }

  getTotalValue(measure: string) {
    return this.ListGrossArr.map(t => t[measure]).reduce((acc, value) => acc + value, 0);
  }

  public getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(data: ListGross[]): ListGross[] {
    return data.sort((a: ListGross, b: ListGross) => {
      return this.getTime(b.Date) - this.getTime(a.Date);
    });
  }

}
