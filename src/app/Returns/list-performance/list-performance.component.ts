import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from '../../Loader/loader.service';
import { ListPerformance } from '../../Models/ListPerformance.model';
import 'datatables.net';
import * as $ from 'jquery';

@Component({
  selector: 'app-list-performance',
  templateUrl: './list-performance.component.html',
  styleUrls: ['./list-performance.component.css']
})

export class ListPerformanceComponent implements OnInit {

  public ListOwner: number = 0;
  public ListManager: number = 0;
  public Recency: number = 0;
  public DataReady: boolean = false;
  public ListPerformanceArr: ListPerformance[];

  constructor(private _authService: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
    this.DataReady = true;
    // route.params.subscribe(params => {
    //   this.ListOwner = +params["listowner"];
    //   if (params["listmanager"]) {
    //     this.ListManager = +params["listmanager"];
    //     if (params["recency"])
    //       this.Recency = +params["recency"];
    //   }
    // });
    //loading panel
    this.loaderService.display(false);
  }

  ngOnInit() {
  //  $('table.listperformance').toggle(false);
    // var endDate = new Date(); // default to last 2 years
    // var startDate = new Date();
    // var year = endDate.getFullYear() - 2;
    // startDate.setFullYear(year);

    // this._authService.getListPerformance(this.ListOwner, this.ListManager, this.Recency, startDate, endDate)
    //   .subscribe(data => {
    //     this.ListPerformanceArr = data;
    //     this.loaderService.display(false);
    //     this.DataReady = true;
         this.SetDataTable();
    //   });
  }

  SetDataTable() {
    let listperformance: any = $('table');
    var listTable = listperformance.DataTable({
      "columnDefs": [
        { targets: 0, width: 50 },
      ],
      "select": true,
      "autoWidth": false,
      "paging": false,
      "info": false,
      "searching": true,
      "ordering": true,
      initComplete: function () {
      }
    });
  }

  ngAfterViewInit() {
  }
}

