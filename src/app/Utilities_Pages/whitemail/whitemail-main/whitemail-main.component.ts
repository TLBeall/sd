import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClientList } from 'src/app/Models/ClientList.model';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import * as moment from 'moment';


@Component({
  selector: 'app-whitemail-main',
  templateUrl: './whitemail-main.component.html',
  styleUrls: ['./whitemail-main.component.scss']
})


export class WhitemailMainComponent implements OnInit {

  myControl = new FormControl();
  public clientList: ClientList[];
  public rootWhitemail: CagingDailies[];
  public ClientStrArr: string[] = new Array<string>();
  public filteredClientList: Observable<string[]>;
  public Client: string;
  public Agency: string = "HSP";
  public displayTable: boolean = false;
  public selectionMode: boolean = false;
  public checkedRows: number[] = [];
  public showEditButton: boolean = false;
  public showDeleteModal: boolean = false;
  public deleteNotation: string;
  public tableLoading: boolean = false;
  public showEmptyMessage: boolean = false;
  public startDate: any;
  public endDate: any;
  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;

  MainDisplayedColumns: string[] = ['SelectionBox', 'Date', 'Non-Donors', 'Donors', 'Gross', 'ButtonControl'];


  constructor(public _authService: AuthService, public _g: GlobalService, public router: Router) {

  }

  ngOnInit() {
    let current = new Date();
    let tempStartDate = moment(current, "MM-DD-YYYY").subtract(365, 'd').format("MM-DD-YYYY");
    this.endDate = new Date();
    this.startDate = new Date(tempStartDate);
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

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  mainSelectClient(client) {
    this.tableLoading = true;
    this.showEmptyMessage = false;
    this.Client = client;
    var clientAcronym = client.split(" ").splice(-1); 
    this._authService.getWhitemailByClient(this.Agency, clientAcronym[0], this.convertDate(this.startDate), this.convertDate(this.endDate)).subscribe(data => {
      if (data)
        var temp = this.sortByStartDate(data)
      this.rootWhitemail = temp;
      this.rootWhitemail.forEach(element => {
        element.TotalDonors = element.CardDonors + element.CheckDonors + element.CashDonors;
        element.TotalGross = element.CardAmount + element.CheckAmount + element.CashAmount;
        element.Client = client;
      })
      this.displayTable = true;
      this.tableLoading = false;
      if (data.length == 0) {
        this.displayTable = false;
        this.showEmptyMessage = true;
        // alert('Client does not have white mail');
      }
    })
  }

  changeDate() {
    this.tableLoading = true;
    var clientAcronym = this.Client.split(" ").splice(-1);
    if (this.validateDate() == true) {
      this._authService.getWhitemailByClient(this.Agency, clientAcronym[0], this.convertDate(this.startDate), this.convertDate(this.endDate)).subscribe(data =>{
        if (data)
        var temp = this.sortByStartDate(data)
      this.rootWhitemail = temp;
      this.displayTable = true;
      this.tableLoading = false;
      if (data.length == 0) {
        this.displayTable = false;
        this.showEmptyMessage = true;
      }
      });
      } else {
      alert('Invalid Date');
    }
  }

  validateDate(): boolean {
    let tempStartDate = "";
    let tempEndDate = "";
    tempStartDate = this.startDateInput.nativeElement.value;
    tempEndDate = this.endDateInput.nativeElement.value;
    var reg = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
    if (tempStartDate.match(reg) && tempEndDate.match(reg)) {
      return true;
    } else {
      return false;
    }
  }

  convertDate(date: string) {
    return moment(date).format("MM/DD/YYYY");
  }

  public getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(data: CagingDailies[]): CagingDailies[] {
    return data.sort((a: CagingDailies, b: CagingDailies) => {
      return this.getTime(b.DateCaged) - this.getTime(a.DateCaged);
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

    if (this.checkedRows.length == 1) {
      this.deleteNotation = "this record";
    } else {
      this.deleteNotation = "multiple records"
    }
  }


  preDeleteWM(event: any) {
    if (this.checkedRows.length > 0)
      this.showDeleteModal = !this.showDeleteModal;
  }

  deleteWM() {
    var wmStrArr = "";
    this.checkedRows.forEach((element, index) => {
      if (index == 0) {
        wmStrArr = element.toString();
      } else {
        wmStrArr = wmStrArr + "." + element;
      }
    });
    this._authService.deleteCaging(wmStrArr).subscribe();
    setTimeout(() => {
      this.checkedRows = [];
      this.mainSelectClient(this.Client);
      this.showDeleteModal = false;
    }, 1000)

  }

  navigateToEdit(element: any) {
    this._g.whitemailElement = element;
    this.router.navigate(['whitemail/edit/' + element.ID]);
    element.showEditButton = false;
  }

  navigateToNewWM() {
    this._g.whitemailClient = this.Client;
    this.router.navigate(['whitemail/new'])
  }

  hoverRow(row: any) {
    row.showEditButton = true;
  }

  hoverLeave(row: any) {
    row.showEditButton = false;
  }

}
