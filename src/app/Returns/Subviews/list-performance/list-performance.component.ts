import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../../Loader/loader.service';
import { ListPerformance } from '../../../Models/ListPerformance.model';
import 'datatables.net';
import * as $ from 'jquery';

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
  public listDataTable: any;
  public DataReady: boolean = false;

  constructor(private _authService: AuthService, route: ActivatedRoute, private loaderService: LoaderService, private chRef: ChangeDetectorRef) {
    $('#page').toggle(false);
    route.params.subscribe(params => {
      this.ListOwner = +params["listowner"];
      if (params["listmanager"]) {
        this.ListManager = +params["listmanager"];
        if (params["recency"])
          this.Recency = +params["recency"];
      }
    });
    var endDate = new Date(); // default to last 2 years
    var startDate = new Date();
    var year = endDate.getFullYear() - 2;
    startDate.setFullYear(year);

    this._authService.getListPerformance(this.ListOwner, this.ListManager, this.Recency, startDate, endDate)
      .subscribe(data => {
        this.ListPerformanceArr = data;
        this.loaderService.display(false);
        this.chRef.detectChanges();
        this.DataReady = true;
        this.SetDataTable();
      });
    //loading panel
    this.loaderService.display(true);
  }

  ngOnInit() {
    $('#page').toggle(false);
  }

  SetDataTable(): void {

    let listperformance: any = $('#listperformance');
    if (this.DataReady) {
      listperformance.DataTable({
        "select": true,
        "autoWidth": true,
        "paging": false,
        "info": false,
        "searching": true,
        "ordering": true,
        initComplete: function () {
          $('#page').toggle(true);
        }
      });
    }
  }
}
