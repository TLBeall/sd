import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../../Loader/loader.service';
import { ListPerformance } from '../../../Models/ListPerformance.model';
import { GlobalService } from '../../../Services/global.service';
import { Sort } from '@angular/material';

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

  SortFunction(sort: Sort, data: any) {

    var sortedData: any;

    data = data.slice();

    if (!sort.active || sort.direction === '') {
      sort.direction = "asc";
      sort.active = "Client";
    }

    var sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Client': return compare(a.Client, b.Client, isAsc);
        case 'Phase': return compare(a.Phase, b.Phase, isAsc);
        case 'MailCode': return compare(a.MailCode, b.MailCode, isAsc);
        case 'Mailed': return compare(a.Measure.Mailed, b.Measure.Mailed, isAsc);
        case 'Caged': return compare(a.Measure.Caged, b.Measure.Caged, isAsc);
        case 'Quantity': return compare(a.Measure.Quantity, b.Measure.Quantity, isAsc);
        case 'Donors': return compare(a.Measure.Donors, b.Measure.Donors, isAsc);
        case 'NonDonors': return compare(a.Measure.NonDonors, b.Measure.NonDonors, isAsc);
        case 'NewDonors': return compare(a.Measure.NewDonors, b.Measure.NewDonors, isAsc);
        case 'RSP': return compare(a.Measure.RSP, b.Measure.RSP, isAsc);
        case 'AVG': return compare(a.Measure.AVG, b.Measure.AVG, isAsc);
        case 'Gross': return compare(a.Measure.Gross, b.Measure.Gross, isAsc);
        case 'Cost': return compare(a.Measure.Cost, b.Measure.Cost, isAsc);
        case 'Net': return compare(a.Measure.Net, b.Measure.Net, isAsc);
        case 'GPP': return compare(a.Measure.GPP, b.Measure.GPP, isAsc);
        case 'CLM': return compare(a.Measure.CLM, b.Measure.CLM, isAsc);
        case 'NLM': return compare(a.Measure.NLM, b.Measure.NLM, isAsc);
        case 'IO': return compare(a.Measure.IO, b.Measure.IO, isAsc);
        default: return 0;
      }
    });
    this.ListPerformanceArr = sortedData;
  }
}

function compare(a: string, b: string, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


