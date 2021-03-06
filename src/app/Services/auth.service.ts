import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { CagingDailies } from '../Models/CagingDailies.model';
import { ListRental } from '../Models/ListRental.model';
import { FormControl } from '@angular/forms';
import { Incidental } from '../Models/Incidentals.model';
import { ReturnsClientLRI } from '../Models/ReturnsClientLRI.model';
import { ReturnsClientWM } from '../Models/ReturnsClientWM.model';
import { ReturnsClientInc } from '../Models/ReturnsClientInc.model';
// import { LoaderService } from '../loader/loader.service';

@Injectable()
export class AuthService {

  AccessToken: string = "";
  constructor(
    public http: Http
    // public loaderService: LoaderService
  ) { }

  getToken(Username: string, Password: string): Observable<TokenParams> {
    var TokenAPI = "https://example.com/token";
    var headersForTokenAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    var data = "grant_type=password&username=" + Username + "&password=" + Password;
    return this.http.post(TokenAPI, data, { headers: headersForTokenAPI }).pipe(map(res => res.json()));
  }

  getClientList(pYear: string): Observable<ClientList[]> {
    var Token = "";
    var GetListAPI = "https://example.com/api/getClientList?Year=" + pYear;
    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetListAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getPackageReturns(packagePhase: string): Observable<any> {
    var Token = "";
    var GetReturnsAPI = "https://example.com/api/PackageReturns?PackagePhase=" + packagePhase;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetReturnsAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getReturns(clients: string, startDate: Date, endDate: Date): Observable<RootReturns[]> {
    var Token = "";
    var GetReturnsAPI = "https://example.com/api/Returns?Clients=." + clients + ".&startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString();

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetReturnsAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getLRIforReturns(client: string, startdate: Date, enddate: Date): Observable<ReturnsClientLRI[]> {
    var Token = "";
    var getURL = "https://example.com/api/GetLRI?ClientList=" + client + "&From=" + startdate.toLocaleDateString() + "&To=" + enddate.toLocaleDateString();

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  getWMforReturns(client: string, startdate: Date, enddate: Date): Observable<ReturnsClientWM[]> {
    var Token = "";
    var getURL = "https://example.com/api/GetWM?ClientList=" + client + "&From=" + startdate.toLocaleDateString() + "&To=" + enddate.toLocaleDateString();

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  getIncforReturns(client: string, startdate: Date, enddate: Date): Observable<ReturnsClientInc[]> {
    var Token = "";
    var getURL = "https://example.com/api/GetIncidentals?ClientList=" + client + "&From=" + startdate.toLocaleDateString() + "&To=" + enddate.toLocaleDateString();

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  getClientsFilter(startDate: Date, endDate: Date): Observable<ClientList[]> { // all clients within a date range
    var Token = "";
    var GetClientFilterAPI = "https://example.com/api/GetClientFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString();

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetClientFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getMailTypeFilter(clients: string, startDate: Date, endDate: Date): Observable<string[]> { // all mailtypes for the provided list of clients within date range
    var Token = "";
    var GetMailTypeFilterAPI = "https://example.com/api/GetMailTypeFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&clients=" + clients;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetMailTypeFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getCampaignFilterByClients(clients: string, startDate: Date, endDate: Date): Observable<string[]> {
    var Token = "";
    var GetCampaignFilterAPI = "https://example.com/api/GetCampaignFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&clients=" + clients;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetCampaignFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getCampaignFilterByMailType(client: string, mailType: string, startDate: Date, endDate: Date): Observable<string[]> {
    var Token = "";
    var GetCampaignFilterAPI = "https://example.com/api/GetCampaignFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&client=" + client + "&mailtype =" + mailType;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetCampaignFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getPhaseFilterByClients(clients: string, startDate: Date, endDate: Date): Observable<string[]> {
    var Token = "";
    var GetPhaseFilterAPI = "https://example.com/api/GetPhaseFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&clients=" + clients;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetPhaseFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getPhaseFilterByMailType(client: string, mailType: string, startDate: Date, endDate: Date): Observable<string[]> {
    var Token = "";
    var GetPhaseFilterAPI = "https://example.com/api/GetPhaseFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&client=" + client + "&mailtype=" + mailType;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetPhaseFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getPhaseFilterByCampaign(client: string, campaign: string, startDate: Date, endDate: Date): Observable<string[]> {
    var Token = "";
    var GetPhaseFilterAPI = "https://example.com/api/GetPhaseFilter?startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString() + "&client=" + client + "&mailtype=&campaign=" + campaign;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetPhaseFilterAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getPerformanceHierarchy(): Observable<PerformanceHierarchy[]> {
    var Token = "";
    var GetLPAPI = "https://example.com/api/GetListPerformanceHierarchy";

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetLPAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getListOwners(): Observable<ListOwner[]> {
    var Token = "";
    var GetLOAPI = "https://example.com/api/GetListOwners";

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetLOAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getListManagers(): Observable<ListManager[]> {
    var Token = "";
    var GetLMAPI = "https://example.com/api/GetListOwners";

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetLMAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getSegments(): Observable<Segment[]> {
    var Token = "";
    var GetSegAPI = "https://example.com/api/GetSegments";

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetSegAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getListPerformance(ListOwners: string, ListManagers: string, Segments: string, Clients: string, startDate: Date, endDate: Date): Observable<ListPerformance[]> {
    var Token = "";
    if (Clients == '_') Clients = '';
    if (ListOwners == '_') ListOwners = '';
    if (ListManagers == '_') ListManagers = '';
    if (Segments == '_') Segments = '';
    var ListPerformanceAPI = "https://example.com/api/ListPerformance?ListOwners=" + ListOwners + "&ListManagers=" + ListManagers + "&Segments=" + Segments + "&Clients=" + Clients + "&startdate=" + startDate.toLocaleDateString() + "&enddate=" + endDate.toLocaleDateString();

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(ListPerformanceAPI, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getListGross(PackageCode: string, PhaseNumber: string, MailCode: string): Observable<any> {
    var Token = "";
    var GetListGross = "https://example.com/api/getListGross?PackageCode=" + PackageCode + "&PhaseNumber=" + PhaseNumber + "&MailCode=" + MailCode;

    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetListGross, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  getPhaseGross(PackageCode: string, PhaseNumber: string): Observable<any> {
    var Token = "";
    var GetPhaseGross = "https://example.com/api/getpackagegross?PackageCode=" + PackageCode + "&PhaseNumber=" + PhaseNumber;
    var headersForGetListAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(GetPhaseGross, { headers: headersForGetListAPI }).pipe(map(res => res.json()));
  }

  //Used for whitemail
  createDailies(DailiesRecord: CagingDailies[]): Observable<any> {
    //Prep the array for JSON -- need to make the FormControl null to stringify
    DailiesRecord.forEach(element => {
      element.ClientControl = null;
      element.isLast = null;
      element.beenModified = null;
      var tempclient = element.Client.split(" ").splice(-1);
      element.Client = tempclient.toString(); 
    });
    var Token = "";
    var createDailiesURL = "https://example.com/api/CreateDailies";
    var body = JSON.stringify(DailiesRecord);
    //Resets the client control - the observable would otherwise throw an error back on the subscription in the parent component because a FormControl cannot be null/not have a name
    DailiesRecord.forEach(element => {
      element.ClientControl = new FormControl();
    });
    var headersForCreateDailiesAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.post(createDailiesURL, body, { headers: headersForCreateDailiesAPI });
  }

  getWhitemailByClient(Agency: string, Client: string, startdate: string, enddate: string) {
    var Token = "";
    var getURL = "https://example.com/api/GetDailies?Agency=" + Agency + "&Client=" + Client + "&MailCode=WM&From=" + startdate + "&To=" + enddate;

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  deleteCaging(idString: string) {
    var Token = "";
    var deleteURL = "https://example.com/api/DeleteDailies?ID=" + idString;
    return this.http.delete(deleteURL);
  }

  editCaging(object: any, id: number) {
    var Token = "";
    var editURL = "https://example.com/api/EditDailies?ID=" + id;
    var body = JSON.stringify(object);

    var headersForEditAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.put(editURL, body, { headers: headersForEditAPI });
  }

  getListRentalbyClient(client: string, startdate: string, enddate: string) {
    var Token = "";
    var getURL = "https://example.com/api/GetLRI?Client=" + client + "&From=" + startdate + "&To=" + enddate + "&Transaction=true";

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  createLRI(LRIArray: ListRental[]): Observable<any> {
    //Prep the array for JSON
    LRIArray.forEach(element => {
      element.ClientControl = null;
      element.isLast = null;
      element.beenModified = null;
      var tempclient = element.Client.split(" ").splice(-1);
      element.Client = tempclient.toString(); 
      var tempDate = (element.LRIDate).toDateString();
      element.LRIDate = new Date(tempDate);
    });


    var Token = "";
    var createURL = "https://example.com/api/CreateLRI";
    var body = JSON.stringify(LRIArray);
    //Resets the client control - the observable would otherwise throw an error back on the subscription in the parent component because a FormControl cannot be null/not have a name
    LRIArray.forEach(element => {
      element.ClientControl = new FormControl();
    })
    var headersForCreateAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.post(createURL, body, { headers: headersForCreateAPI });
  }

  deleteLRI(LRIStrArr: string) {
    var Token = "";
    var deleteURL = "https://example.com/api/DeleteLRI?ID=" + LRIStrArr;
    return this.http.delete(deleteURL);
  }

  editLRIRow(LRIElement: ListRental, id: number) {
    var Token = "";
    var editURL = "https://example.com/api/EditLRI?ID=" + id;
    var body = JSON.stringify(LRIElement);

    var headersForEditAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.put(editURL, body, { headers: headersForEditAPI });
  }

  getIncidentalsByClient(Client: string) {
    var Token = "";
    var getURL = "https://example.com/api/GetIncidentals?Client=" + Client + "&Skip=0&RequestedCount=100";

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  deleteIncidentals(tempStrArr: string) {
    var Token = "";
    var deleteURL = "https://example.com/api/DeleteIncidentals?ID=" + tempStrArr;
    return this.http.delete(deleteURL);
  }

  editIncidentalRow(IncidentalsElement: Incidental, id: number) {
    var Token = "";
    var editURL = "https://example.com/api/EditIncidental?ID=" + id;
    var body = JSON.stringify(IncidentalsElement);

    var headersForEditAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.put(editURL, body, { headers: headersForEditAPI });
  }

  createIncidentals(IncidentalArray: Incidental[]): Observable<any> {
    //Prep the array for JSON
    IncidentalArray.forEach(element => {
      element.ClientControl = null;
      element.isLast = null;
      element.beenModified = null;
      var tempclient = element.Client.split(" ").splice(-1);
      element.Client = tempclient.toString(); 
      var tempDate = (element.IncidenceDate).toDateString();
      element.IncidenceDate = new Date(tempDate);
    });


    var Token = "";
    var createURL = "https://example.com/api/CreateIncidentals";
    var body = JSON.stringify(IncidentalArray);
    //Resets the client control - the observable would otherwise throw an error back on the subscription in the parent component because a FormControl cannot be null/not have a name
    IncidentalArray.forEach(element => {
      element.ClientControl = new FormControl();
    })
    var headersForCreateAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.post(createURL, body, { headers: headersForCreateAPI });
  }

  getCagingCalendarData(ClientList: string, Year: number, Month: number, Day: number) {
    var Token = "";
    if (Day == null && Month == null) {
      var getURL = "https://example.com/api/CagingCalendar?ClientList=" + ClientList + "&Year=" + Year;
    } else if (Day == null) {
      var getURL = "https://example.com/api/CagingCalendar?ClientList=" + ClientList + "&Year=" + Year + "&Month=" + Month;
    } else {
      let CL;
      if (ClientList == "") {
        CL = "ALL";
      } else {
        CL = ClientList;
      }
      var getURL = "https://example.com/api/CagingCalendar?ClientList=" + CL + "&Date=" + Month + "/" + Day + "/" + Year;
    }

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }


  getPhasebyClient(client: string): Observable<any> {
    var Token = "";
    var getURL = " https://example.com/api/PhaseListByClient?Client=" + client;

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  getDailiesExceptions() {
    var Token = "";
    var getURL = "https://example.com/api/GetDailiesExceptionsX"; //The X is linked to the BB table. Remove X when migration is complete

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

  editDailiesExceptions(NewMailCode: string, idString: string, Client: string) {
    var Token = "";
    if (Client == null) {
      //Setting to a specific mailcode
      var editURL = "https://example.com/api/UpdateDailiesExceptions?NewMailCode=" + NewMailCode + "&ID=" + idString + "&UserName=SHERIF";
    } else {
      //Setting to a WM for a client
      var editURL = "https://example.com/api/UpdateDailiesExceptions?NewMailCode=" + NewMailCode + "&ID=" + idString + "&Client=" + Client + "&UserName=SHERIF";
    }
    // var body = JSON.stringify(object);

    var headersForEditAPI = new Headers({ 'Content-Type': 'Application/Json', 'Authorization': 'Bearer ' + Token });
    return this.http.put(editURL, { headers: headersForEditAPI });
  }

  getPDFList(CLList: string, startdate: string, enddate: string) {
    var Token = "";
    var getURL = "https://example.com/api/BrowsePDF?ClientList=" + CLList + "&From=" + startdate + "&To=" + enddate;

    var headersForGetAPI = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + Token });
    return this.http.get(getURL, { headers: headersForGetAPI }).pipe(map(res => res.json()));
  }

}

