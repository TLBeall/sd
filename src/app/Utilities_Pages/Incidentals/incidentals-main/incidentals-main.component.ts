import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { Incidental } from 'src/app/Models/Incidentals.model';
import { ClientList } from 'src/app/Models/ClientList.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-incidentals-main',
  templateUrl: './incidentals-main.component.html',
  styleUrls: ['./incidentals-main.component.scss']
})
export class IncidentalsMainComponent implements OnInit {
  public clientControl = new FormControl();
  public clientList: ClientList[];
  public rootIncidentals: Incidental[];
  public ClientStrArr: string[] = new Array<string>();
  public filteredClientList: Observable<string[]>;
  public Client: string;

  public displayTable: boolean = false;
  public selectionMode: boolean = false;
  public checkedRows: number[] = [];
  public showEditButton: boolean = false;
  public showDeleteModal: boolean = false;
  public deleteNotation: string;

  MainDisplayedColumns: string[] = ['SelectionBox', 'Date', 'Description', 'Amount', 'Audit', 'ButtonControl'];

  constructor(public _authService: AuthService, public _g: GlobalService, public router: Router) { }

  ngOnInit() {
    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.filteredClientList = this.clientControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  mainSelectClient(client) {
    this.Client = client;
    var reg = /(?<= - ).*/;
    var clientAcronym = client.match(reg);
    this._authService.getIncidentalsByClient(clientAcronym[0]).subscribe(data => {
      if (data)
      var temp = this.sortByStartDate(data)
      this.rootIncidentals = temp;
      // this.rootIncidentals.forEach(element => {
      //   element.TotalDonors = element.CardDonors + element.CheckDonors + element.CashDonors;
      //   element.TotalGross = element.CardAmount + element.CheckAmount + element.CashAmount;
      // })
      this.displayTable = true;
      if (data.length == 0){
        this.displayTable = false;
        alert('Client does not have white mail');
      }
    })
  }

  public getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(data: Incidental[]): Incidental[] {
    return data.sort((a: Incidental, b: Incidental) => {
      return this.getTime(b.IncidenceDate) - this.getTime(a.IncidenceDate);
    });
  }

  toggleSelection() {
    this.selectionMode = !this.selectionMode;
  }

  checkSelected(element: any, event: any) {
    //Setup for multiple selection
    // if (event.shiftKey){
    //   console.log(element.ID);
    // }
    //Multiple selection end

    if (this.checkedRows.includes(element.ID)) {
      const index = this.checkedRows.indexOf(element.ID);
      this.checkedRows.splice(index, 1);
    } else {
      this.checkedRows.push(element.ID);
    }
    
    if (this.checkedRows.length == 1){
      this.deleteNotation = "this record";
    } else {
      this.deleteNotation = "multiple records"
    }
  }


  preDelete(event: any) {
    if (this.checkedRows.length > 0)
    this.showDeleteModal = !this.showDeleteModal;
  }

  delete(){
    var tempStrArr = "";
    this.checkedRows.forEach((element, index) => {
      if (index == 0) {
        tempStrArr = element.toString();
      } else {
        tempStrArr = tempStrArr + "." + element;
      }
    });
    this._authService.deleteIncidentals(tempStrArr).subscribe();
    this.checkedRows = [];
    this.mainSelectClient(this.Client);
    this.showDeleteModal = false;
  }

  navigateToEdit(element: any){
    this._g.IncidentalsElement = element;
    this.router.navigate(['incidentals/edit/' + element.ID]);
    element.showEditButton = false;
  }

  navigateToNewIncidental(){
    this.router.navigate(['incidentals/new'])
  }

  hoverRow(row: any){
    row.showEditButton = true;
  }

  hoverLeave(row: any){
    row.showEditButton = false;
  }

}
