import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClientList } from 'src/app/Models/ClientList.model';
import { FormControl } from '@angular/forms';
import { ListRental } from 'src/app/Models/ListRental.model';
import * as moment from 'moment';


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
  private checkedRows: number[] = [];
  private deleteNotation: string;
  private showDeleteModal: boolean = false;
  private showEmptyMessage: boolean = false;
  private tableLoading: boolean = false;
  private startDate: any;
  private endDate: any;
  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;

  MainDisplayedColumns: string[] = ['SelectionBox', 'Date', 'Description', 'Amount', 'ButtonControl'];

  constructor(private _authService: AuthService, private _g: GlobalService, private router: Router) { }

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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  mainSelectClient(client) {
    this.tableLoading = true;
    this.showEmptyMessage = false;
    this.Client = client;
    var clientAcronym = client.split(" ").splice(-1); 
    this._authService.getListRentalbyClient(clientAcronym[0], this.convertDate(this.startDate), this.convertDate(this.endDate)).subscribe(data => {
      if (data)
        var temp = this.sortByStartDate(data)
      this.rootLRI = temp;
      this.rootLRI.forEach(element => {
        element.Client = client;
      })
      this.displayTable = true;
      this.tableLoading = false;
      if (data.length == 0) {
        this.displayTable = false;
        this.showEmptyMessage = true;
      }
    })
  }

  changeDate() {
    this.tableLoading = true;
    var clientAcronym = this.Client.split(" ").splice(-1);
    if (this.validateDate() == true) {
      this._authService.getListRentalbyClient(clientAcronym[0], this.convertDate(this.startDate), this.convertDate(this.endDate)).subscribe(data =>{
        if (data)
        var temp = this.sortByStartDate(data)
      this.rootLRI = temp;
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

  preDelete(event: any) {
    if (this.checkedRows.length > 0)
      this.showDeleteModal = !this.showDeleteModal;
  }

  delete() {
    var LRIStrArr = "";
    this.checkedRows.forEach((element, index) => {
      if (index == 0) {
        LRIStrArr = element.toString();
      } else {
        LRIStrArr = LRIStrArr + "." + element;
      }
    });
    this._authService.deleteLRI(LRIStrArr).subscribe(); //the array should get convered to URL notation?
    setTimeout(() => {
      this.checkedRows = [];
      this.mainSelectClient(this.Client);
      this.showDeleteModal = false;
    }, 1000)
  }

  navigateToEdit(element: any) {
    this._g.LRIElement = element;
    this.router.navigate(['lri/edit/' + element.ID]);
    element.showEditButton = false;
  }

  navigateToNew() {
    this.router.navigate(['lri/new'])
  }

  hoverRow(row: any) {
    row.showEditButton = true;
  }

  hoverLeave(row: any) {
    row.showEditButton = false;
  }

}
