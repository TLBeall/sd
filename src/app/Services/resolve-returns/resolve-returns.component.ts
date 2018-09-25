import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth.service';
import { GlobalService } from '../global.service';
import { RootReturns } from '../../Models/RootReturns.model';

@Component({
  selector: 'app-resolve-returns',
  templateUrl: './resolve-returns.component.html',
  styleUrls: ['./resolve-returns.component.css']
})

@Injectable()
export class ResolveReturnsComponent implements OnInit {

  constructor(private  AuthService: AuthService, private _g: GlobalService) 
  {

  }

  resolve(route:ActivatedRouteSnapshot, 
    state:RouterStateSnapshot,
   ): Observable<RootReturns> {
   return  this.AuthService.getReturns(this._g.client,this._g.startDate,this._g.endDate)
  };  

   ngOnInit() {
  }

}
