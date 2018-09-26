import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../../Loader/loader.service';
import { ListPerformance } from '../../../Models/ListPerformance.model';
import { GlobalService } from '../../../Services/global.service';

@Component({
  selector: 'app-list-performance',
  templateUrl: './list-performance.component.html',
  styleUrls: ['./list-performance.component.scss']
})
export class ListPerformanceComponent implements OnInit {

  public ListOwner: number = 0;
  public ListManager: number = 0;
  public Recency: number = 0;
  public ListPerformanceArr: ListPerformance[];
  columnsToDisplay: string[] = ['Client', 'Phase', 'MailCode', 'Description', 'ExchangeFlag', 'Recency', 'Mailed', 'Caged', 'Quantity', 'Donors', 'NonDonors', 'NewDonors', 'RSP', 'AVG', 'Gross', 'Cost', 'Net', 'GPP', 'CLM', 'NLM', 'IO'];

  constructor(private _authService: AuthService, route: ActivatedRoute, private _g: GlobalService) {
    var endDate = new Date(); // default to last 2 years
    var startDate = new Date();
    var year = endDate.getFullYear() - 2;
    startDate.setFullYear(year);
    // route.params.subscribe(params => {
    //   this.ListOwner = +params["listowner"];
    //   if (params["listmanager"]) {
    //     this.ListManager = +params["listmanager"];
    //     if (params["recency"])
    //       this.Recency = +params["recency"];
    //   }
    // });
    this._authService.getListPerformance(this._g.listowner, this._g.listmanager, this._g.recency, startDate, endDate)
      .subscribe(data => {
        this.ListPerformanceArr = data;
      });
  }

  ngOnInit() {
  }

  HideList()
  {
    this._g.showlistperformance = false;
  }
}


