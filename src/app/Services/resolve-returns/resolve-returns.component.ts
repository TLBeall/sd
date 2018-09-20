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
    return this.AuthService.getReturns(route.params['client'],
    new Date(route.params['from'].substring(0,2) + "/" + route.params['from'].substring(2,4) + "/" + route.params['from'].substring(4,8)),
    new Date(route.params['to'].substring(0,2) + "/" + route.params['to'].substring(2,4) + "/" + route.params['to'].substring(4,8)));  
}
  ngOnInit() {
  }

}
