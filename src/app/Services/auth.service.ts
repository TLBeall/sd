import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Headers, Http, HttpModule } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { TokenParams } from '../Models/TokenParams';
import { ClientList } from '../Models/ClientList';
import { RootReturns } from '../Models/RootReturns';
// import { LoaderService } from '../loader/loader.service';

@Injectable()
export class AuthService {

  AccessToken:string = "";
  constructor(
    private http: Http
    // private loaderService: LoaderService
  ) { }

  getToken(Username:string, Password:string):Observable<TokenParams> {
    var TokenAPI = "https://sd360.sunrisedataservices.com/token";
    var headersForTokenAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    var data = "grant_type=password&username="+ Username + "&password=" + Password;
    return this.http.post(TokenAPI, data, {headers: headersForTokenAPI}).pipe(map(res => res.json()));
  }  

  getClientList():Observable<ClientList []> {
    var Token = "";
    var GetListAPI = "https://sd360.sunrisedataservices.com/api/getClientList";
    //this.getToken("nls@sunrisedataservices.com","NLSjkas!@%kd15jf%#$@")
    //.subscribe(data => {
    //  Token = data.access_token
    //});
    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetListAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getReturns(client: string):Observable<RootReturns> {
    var Token = "";
    var GetReturnsAPI = "https://sd360.sunrisedataservices.com/api/MainReturns?ClientAcronym="+ client + "&startdate=1/1/2018&enddate=12/31/2018";

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetReturnsAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

}

