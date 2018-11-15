import { Component, OnInit, Testability } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import { strictEqual } from 'assert';


@Component({
  selector: 'app-whitemail-new',
  templateUrl: './whitemail-new.component.html',
  styleUrls: ['./whitemail-new.component.scss']
})
export class WhitemailNewComponent implements OnInit {

  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();
  myControl = new FormControl();

  private whitemailElement: CagingDailies;
  private whitemailArr: CagingDailies[];
  private showSubmittedModal: boolean;
  private showCancel: boolean;

  private date = "";

  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) {

  }

  ngOnInit() {
    if (this._g.whitemailClient != "" || this._g.whitemailClient != undefined || this._g.whitemailClient != null) {
      this.showCancel = true;
    } else {
      this.showCancel = false;
    }

    this.whitemailArr = [];
    this.loadDefaultValues();

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

  loadDefaultValues() {
    var currentDate = new Date();

    var element: CagingDailies = {
      Agency: "HSP",
      Client: "",
      MailCodeId: 0,
      DonationDate: currentDate,
      DateCaged: currentDate,
      EnteredDate: currentDate,
      ModifiedDate: currentDate,
      MailCode: "WM",
      NonDonors: 0,
      CashDonors: 0,
      CardDonors: 0,
      CheckDonors: 0,
      CashAmount: 0,
      CardAmount: 0,
      CheckAmount: 0,
      UnspecifiedAmount: 0,
      UnspecifiedDonors: 0,
      EnteredBy: "TempUser",
      ModifiedBy: "",
      TotalDonors: null,
      TotalGross: null,
      Control: new FormControl(),
      isLast: null
    };

    this.whitemailArr.push(element);

    this.whitemailArr.forEach((element, index) => {
      if (index == (this.whitemailArr.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });
  }

  deleteRow(element: any) {
    const index = this.whitemailArr.indexOf(element);
    if (this.whitemailArr.length > 1) {
      this.whitemailArr.splice(index, 1);
    }

    this.whitemailArr.forEach((element, index) => {
      if (index == (this.whitemailArr.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  changeDate(event: any) {
    // var date = event.target.value;
    // this.whitemailElement.DonationDate = date.toISOString();
  }

  addWMRow() {
    this.loadDefaultValues();
  }


  addWhitemail() {
    this.showSubmittedModal = true;
    // console.log(this.whitemailArr);
    this.whitemailArr.forEach(element => {
      element.Control = null;
      element.isLast = null;
      var tempclient = element.Client;
      var reg = /(?<= - ).*/;
      element.Client = (tempclient.match(reg)).toString();
    });
    this._authService.createDailies(this.whitemailArr).subscribe();
    setTimeout(() => {
      this.showSubmittedModal = false;
      this.whitemailArr = [];
      this.loadDefaultValues();
      this.router.navigate(['whitemail/new']);
    }, 1500)
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.whitemailArr = [];
    this.loadDefaultValues();
    this.router.navigate(['whitemail/new']);
  }

  // deleteWM(){
  //   var wmStrArr = "";
  //   this.checkedRows.forEach((element, index) => {
  //     if (index == 0) {
  //       wmStrArr = element.toString();
  //     } else {
  //       wmStrArr = wmStrArr + "." + element;
  //     }
  //   });
  //   this._authService.deleteWhitemail(wmStrArr).subscribe(); //the array should get convered to URL notation?
  //   this.checkedRows = [];
  //   this.mainSelectClient(this.Client);
  //   this.showDeleteModal = false;
  // }

  // Update() {
  //   var date = new Date();
  //   this.whitemailElement.ModifiedDate = date;
  //   this.showSubmittedModal = true;
  //   this._authService.editWhitemail(this.whitemailElement, this.id).subscribe();
  //   setTimeout(() => {
  //     this.showSubmittedModal = false;
  //     this.router.navigate(['whitemail']);
  //   }, 1500)
  // }

}
