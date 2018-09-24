import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-resolve-listperformance',
  templateUrl: './resolvelistperformance.component.html',
  styleUrls: ['./resolvelistperformance.component.css']
})
export class ResolvelistperformanceComponent implements OnInit {

  constructor(private  AuthService: AuthService, private _g: GlobalService) 
  {

  }

  resolve(route:ActivatedRouteSnapshot, 
    state:RouterStateSnapshot,
   ): Observable<any> {
   return this.AuthService.getListPerformance(this._g.listowner, this._g.listmanager, this._g.recency, this._g.startDate,this._g.endDate)  
  };  

   ngOnInit() {
  }

}