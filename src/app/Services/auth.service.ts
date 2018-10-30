import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Headers, Http, HttpModule } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { TokenParams } from '../Models/TokenParams.model';
import { ClientList } from '../Models/ClientList.model';
import { RootReturns } from '../Models/RootReturns.model';
import { ListPerformance } from '../Models/ListPerformance.model';
import { NewReturns } from '../Models/NewReturns.model';
import { Returns } from '../Models/Returns.model';
import { ListOwner } from '../Models/ListOwner.model';
import { ListManager } from '../Models/ListManager.model';
import { Segment } from '../Models/Segment.model';
import { PerformanceHierarchy } from '../Models/PerformanceHierarchy.model';
import { ListGross } from '../Models/ListGross.model';
import { PhaseGross } from '../Models/PhaseGross.model';
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

  getClientList(pYear: string):Observable<ClientList []> {
    var Token = "";
    var GetListAPI = "https://sd360.sunrisedataservices.com/api/getClientList?Year="+pYear;
    //this.getToken("nls@sunrisedataservices.com","NLSjkas!@%kd15jf%#$@")
    //.subscribe(data => {
    //  Token = data.access_token
    //});
    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetListAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getPackageReturns(packagePhase: string):Observable<any> {
    var Token = "";
    var GetReturnsAPI = "https://sd360.sunrisedataservices.com/api/PackageReturns?PackagePhase="+ packagePhase;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetReturnsAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getReturns(clients: string, startDate: Date, endDate: Date):Observable<RootReturns> {
    var Token = "";
    var GetReturnsAPI = "https://sd360.sunrisedataservices.com/api/Returns?Clients="+ clients  + "&startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&mailTypes=&campaigns=&phases=";

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetReturnsAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getClientsFilter(startDate: Date, endDate: Date):Observable<ClientList[]> { // all clients within a date range
    var Token = "";
    var GetClientFilterAPI = "https://sd360.sunrisedataservices.com/api/GetClientFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString();

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetClientFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getMailTypeFilter(clients:string, startDate: Date, endDate: Date):Observable<string[]> { // all mailtypes for the provided list of clients within date range
    var Token = "";
    var GetMailTypeFilterAPI = "https://sd360.sunrisedataservices.com/api/GetMailTypeFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&clients=" + clients;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetMailTypeFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getCampaignFilterByClients(clients:string, startDate: Date, endDate: Date):Observable<string[]> {
    var Token = "";
    var GetCampaignFilterAPI = "https://sd360.sunrisedataservices.com/api/GetCampaignFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&clients=" + clients;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetCampaignFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }  

  getCampaignFilterByMailType(client:string, mailType:string, startDate: Date, endDate: Date):Observable<string[]> {
    var Token = "";
    var GetCampaignFilterAPI = "https://sd360.sunrisedataservices.com/api/GetCampaignFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&client=" + client + "&mailtype =" + mailType;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetCampaignFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }  

  getPhaseFilterByClients(clients:string, startDate: Date, endDate: Date):Observable<string[]> {
    var Token = "";
    var GetPhaseFilterAPI = "https://sd360.sunrisedataservices.com/api/GetPhaseFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&clients=" + clients;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetPhaseFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }   

  getPhaseFilterByMailType(client:string, mailType:string, startDate: Date, endDate: Date):Observable<string[]> {
    var Token = "";
    var GetPhaseFilterAPI = "https://sd360.sunrisedataservices.com/api/GetPhaseFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&client=" + client + "&mailtype=" + mailType;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetPhaseFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }   

  getPhaseFilterByCampaign(client:string, campaign:string, startDate: Date, endDate: Date):Observable<string[]> {
    var Token = "";
    var GetPhaseFilterAPI = "https://sd360.sunrisedataservices.com/api/GetPhaseFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&client=" + client + "&mailtype=&campaign=" + campaign;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetPhaseFilterAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }   

  getPerformanceHierarchy():Observable<PerformanceHierarchy[]> {
    var Token = "";
    var GetLPAPI = "https://sd360.sunrisedataservices.com/api/GetListPerformanceHierarchy";

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetLPAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }  

  getListOwners():Observable<ListOwner[]> {
    var Token = "";
    var GetLOAPI = "https://sd360.sunrisedataservices.com/api/GetListOwners";

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetLOAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getListManagers():Observable<ListManager[]> {
    var Token = "";
    var GetLMAPI = "https://sd360.sunrisedataservices.com/api/GetListOwners";

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetLMAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getSegments():Observable<Segment[]> {
    var Token = "";
    var GetSegAPI = "https://sd360.sunrisedataservices.com/api/GetSegments";

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetSegAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getListPerformance(ListOwners: string, ListManagers: string, Segments: string, Clients:string, startDate: Date, endDate: Date):Observable<ListPerformance[]> {
    var Token = "";
    if (Clients == '_') Clients = '';
    if (ListOwners == '_') ListOwners = '';
    if (ListManagers == '_') ListManagers = '';
    if (Segments == '_') Segments = '';
    var ListPerformanceAPI = "https://sd360.sunrisedataservices.com/api/ListPerformance?ListOwners=" + ListOwners + "&ListManagers=" + ListManagers + "&Segments=" + Segments + "&Clients=" + Clients + "&startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString();

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(ListPerformanceAPI, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getListGross(PackageCode: string, PhaseNumber: string, MailCode: string):Observable<any> {
    var Token = "";
    var GetListGross = "https://sd360.sunrisedataservices.com/api/getListGross?PackageCode="+ PackageCode + "&PhaseNumber=" + PhaseNumber + "&MailCode=" + MailCode;

    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetListGross, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }

  getPhaseGross(PackageCode: string, PhaseNumber: string):Observable<any> {
    var Token = "";
    var GetPhaseGross = "https://sd360.sunrisedataservices.com/api/getpackagegross?PackageCode="+ PackageCode + "&PhaseNumber=" + PhaseNumber;
    var headersForGetListAPI = new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + Token});
    return this.http.get(GetPhaseGross, {headers: headersForGetListAPI}).pipe(map(res => res.json()));
  }
}

