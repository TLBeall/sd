import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClientList } from 'src/app/Models/ClientList.model';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';

@Component({
  selector: 'app-whitemail-main',
  templateUrl: './whitemail-main.component.html',
  styleUrls: ['./whitemail-main.component.scss']
})


export class WhitemailMainComponent implements OnInit {

  myControl = new FormControl();
  private clientList: ClientList[];
  private rootWhitemail: CagingDailies[];
  private ClientStrArr: string[] = new Array<string>();
  private filteredClientList: Observable<string[]>;
  private Client: string;
  private Agency: string = "HSP";
  private displayTable: boolean = false;
  private selectionMode: boolean = false;
  private checkedRows: number[] = [];
  private showEditButton: boolean = false;
  private showDeleteModal: boolean = false;
  private deleteNotation: string;
  private tableLoading: boolean = false;
  private showEmptyMessage: boolean = false;

  MainDisplayedColumns: string[] = ['SelectionBox', 'Date', 'Non-Donors', 'Donors', 'Gross', 'ButtonControl'];


  constructor(private _authService: AuthService, private _g: GlobalService, private router: Router) {

  }

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
    this.tableLoading = true;
    this.showEmptyMessage = false;
    this.Client = client;
    var clientAcronym = client.split(" ").splice(-1); 
    this._authService.getWhitemailByClient(this.Agency, clientAcronym[0]).subscribe(data => {
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

  private getTime(date?: Date) {
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
