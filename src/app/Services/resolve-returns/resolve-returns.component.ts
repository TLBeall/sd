import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-resolve-returns',
  templateUrl: './resolve-returns.component.html',
  styleUrls: ['./resolve-returns.component.css']
})

@Injectable()
export class ResolveReturnsComponent implements OnInit {

  constructor(private  AuthService: AuthService) { }

  resolve(route:ActivatedRouteSnapshot, 
    state:RouterStateSnapshot,
   ): Observable<any> {
    return this.AuthService.getReturns(route.queryParams['Client'],route.queryParams['StartDate'],route.queryParams['EndDate']);  
}
  ngOnInit() {
  }

}
