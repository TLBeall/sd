import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClientList } from 'src/app/Models/ClientList.model';
import { FormControl } from '@angular/forms';
import { ListRental } from 'src/app/Models/ListRental.model';

@Component({
  selector: 'app-lri-main',
  templateUrl: './lri-main.component.html',
  styleUrls: ['./lri-main.component.scss']
})
export class LriMainComponent implements OnInit {

  myControl = new FormControl();
  private clientList: ClientList[];
  private ClientStrArr: string[] = new Array<string>();
  private filteredClientList: Observable<string[]>;
  private Client: string;
  private rootLRI: ListRental[];
  private displayTable: boolean = false;
  private selectionMode: boolean = false;


  MainDisplayedColumns: string[] = ['SelectionBox', 'Date', 'Description', 'Amount', 'ButtonControl'];

  constructor(private _authService: AuthService, private _g: GlobalService, private router: Router) { }

  ngOnInit() {
    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.filteredClientList = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  mainSelectClient(client) {
    this.Client = client;
    var reg = /(?<= - ).*/;
    var clientAcronym = client.match(reg);
    this._authService.getListRentalbyClient(clientAcronym[0]).subscribe(data => {
      if (data)
      var temp = this.sortByStartDate(data)
      this.rootLRI = temp;
      // this.rootLRI.forEach(element => {
      //   element.TotalDonors = element.CardDonors + element.CheckDonors + element.CashDonors + element.UnspecifiedDonors;
      //   element.TotalGross = element.CardAmount + element.CheckAmount + element.CashAmount + element.UnspecifiedAmount;
      //   this.displayTable = true;
      // })
      this.displayTable = true;
      if (data.length == 0){
        this.displayTable = false;
        alert('Client does not have LRI');
      }
    })
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(data: ListRental[]): ListRental[] {
    return data.sort((a: ListRental, b: ListRental) => {
      return this.getTime(b.LRIDate) - this.getTime(a.LRIDate);
    });
  }

  toggleSelection() {
    this.selectionMode = !this.selectionMode;
  }

  navigateToEdit(element: any){
    this._g.LRIElement = element;
    this.router.navigate(['lri/edit/' + element.ID]);
    element.showEditButton = false;
  }

  navigateToNew(){
    this.router.navigate(['lri/new'])
  }

  hoverRow(row: any){
    row.showEditButton = true;
  }

  hoverLeave(row: any){
    row.showEditButton = false;
  }

}
