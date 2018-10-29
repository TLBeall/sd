import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { PhaseGross } from 'src/app/Models/PhaseGross.model';

@Component({
  selector: 'app-phase-gross',
  templateUrl: './phase-gross.component.html',
  styleUrls: ['./phase-gross.component.scss']
})
export class PhaseGrossComponent implements OnInit {
  private route: any;
  private pageReady: boolean = false;
  private PackageCode: string;
  private PhaseNumber: string;
  private PhaseGrossArr: PhaseGross;

  displayedColumns: string[] = ['Date', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'TotalDonors', 'TotalGross'];


  constructor(private _authService: AuthService, route: ActivatedRoute, private _g: GlobalService) {
    this.route = route;
   }

   getTotalValue(measure: string) {
    return this.PhaseGrossArr.dateGrossList.map(t => t[measure]).reduce((acc, value) => acc + value, 0);
  }   

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LoadValues(params['packagecode'], params['phasenumber']);             

      this._authService.getPhaseGross(this.PackageCode, this.PhaseNumber)
      .subscribe(data => {
        this.PhaseGrossArr = data;
        this.pageReady = true;
      });    
   });
  }

  LoadValues(packagecode:string, phaseNumber:string)
  {
    this.PackageCode = packagecode;
    this.PhaseNumber = phaseNumber;
  }

}
