import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import {ActivatedRoute} from "@angular/router";
import { LoaderService } from '../../../Loader/loader.service';
import { ListPerformance } from '../../../Models/ListPerformance.model';

@Component({
  selector: 'app-list-performance',
  templateUrl: './list-performance.component.html',
  styleUrls: ['./list-performance.component.css']
})

export class ListPerformanceComponent implements OnInit {

  public ListPerformanceArr: ListPerformance[];

  constructor(private _authService: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
   }

  ngOnInit() {
    this._authService.getListPerformance(596, 573, 13, new Date("01/01/2018"), new Date("12/31/2018"))
      .subscribe(data => {
        this.ListPerformanceArr = data;
        $(".clientTable").toggle(true);
        this.loaderService.display(false);
      });
    }

}
