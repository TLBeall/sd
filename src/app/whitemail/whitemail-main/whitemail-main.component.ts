import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClientList } from 'src/app/Models/ClientList.model';
import { strictEqual } from 'assert';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import { MailcodeGross } from 'src/app/Models/MailcodeGross.model';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { element } from 'protractor';

const defaultDialogConfig = new MatDialogConfig();

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
  private currentYear;
  private Client: string;
  private Agency: string = "HSP";
  private TotalGross: number;
  private TotalDonor: number;
  private displayTable: boolean = false;
  private selectionMode: boolean = false;
  private checkedRows: number[] = [];
  private showEditButton: boolean = false;

  MainDisplayedColumns: string[] = ['SelectionBox', 'Date', 'Non-Donors', 'Donors', 'Gross', 'ButtonControl'];


  constructor(private _authService: AuthService, private _g: GlobalService, private router: Router) {

  }

  ngOnInit() {
    this.currentYear = (new Date()).getFullYear();
    // this._authService.getClientList(this.currentYear).subscribe(data => {
    //   this.clientList = Array.from(new Set(data.map(item => item.gClientName + ' - ' + item.gClientAcronym))).sort();
    // })
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
    var reg = /(?<= - ).*/;
    var clientAcronym = client.match(reg);
    this._authService.getWhitemailByClient(this.Agency, clientAcronym[0]).subscribe(data => {
      if (data)
      var temp = this.sortByStartDate(data)
      this.rootWhitemail = temp;
      this.rootWhitemail.forEach(element => {
        element.TotalDonors = element.CardDonors + element.CheckDonors + element.CashDonors + element.UnspecifiedDonors;
        element.TotalGross = element.CardAmount + element.CheckAmount + element.CashAmount + element.UnspecifiedAmount;
        this.displayTable = true;
      })
      if (data.length == 0){
        this.displayTable = false;
        alert('Client does not have white mail');
      }
    })

    
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(data: CagingDailies[]): CagingDailies[] {
    return data.sort((a: CagingDailies, b: CagingDailies) => {
      return this.getTime(b.DonationDate) - this.getTime(a.DonationDate);
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
  }


  deleteWM() {
    //potential URL notation
    var wmStrArr = "";
    this.checkedRows.forEach((element, index) => {
      if (index == 0) {
        wmStrArr = element.toString();
      } else {
        wmStrArr = wmStrArr + "." + element;
      }
    });
    // this._authService.deleteWhitemail(wmStrArr); //the array should get convered to URL notation?
    // this.checkedRows = [];
    //Set up reload of table
    //Set up modal popup saying are you sure?
  }

  navigateToEdit(element: any){
    this._g.whitemailElement = element;
    this.router.navigate(['whitemail/edit/' + element.ID]);

  }

  hoverRow(row: any){
    row.showEditButton = true;
  }

  hoverLeave(row: any){
    row.showEditButton = false;
  }

}
