import { Component, OnInit, Testability } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';


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
  private WMMessage: string;  


  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) {

  }

  ngOnInit() {

    this.whitemailArr = [];
    this.loadDefaultValues();

    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.whitemailArr.forEach(element => {
          this.filteredClientList = element.ClientControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
          });
      });
  }

  loadDefaultValues() {
    var currentDate = new Date();

    var element: CagingDailies = {
      Agency: "HSP",
      Client: null,
      MailCodeId: null,
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
      ModifiedBy: "TempUser",
      TotalDonors: null,
      TotalGross: null,
      ClientControl: new FormControl(),
      isLast: null
    };

    this.whitemailArr.push(element);

    if (this.whitemailArr.length == 1){
      this.WMMessage = "Whitemail";
    } else {
      this.WMMessage = (this.whitemailArr.length).toString() + " Whitemail rows"; 
    }

    this.whitemailArr.forEach((element, index) => {
      if (index == (this.whitemailArr.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });

    this.whitemailArr.forEach(element => {
      this.filteredClientList = element.ClientControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
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
    if (this.validationFunction()) {
      this.showSubmittedModal = true;
      this.whitemailArr.forEach(element => {
        element.ClientControl = null;
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
      }, 2500)
    } else {
      alert('Please fill all fields');
    }
  }

  validationFunction(): boolean {
    var tempValue: boolean;
    this.whitemailArr.forEach(element => {
      if (element.NonDonors == null || (element.NonDonors).toString() == "" ||
        element.CardAmount == null || (element.CardAmount).toString() == "" ||
        element.CardDonors == null || (element.CardDonors).toString() == "" ||
        element.CheckAmount == null || (element.CheckAmount).toString() == "" ||
        element.CheckDonors == null || (element.CheckDonors).toString() == "" ||
        element.CashAmount == null || (element.CashAmount).toString() == "" ||
        element.CashDonors == null || (element.CashDonors).toString() == "" ||
        element.Client == null || element.Client == "" ||
        element.DonationDate == null || (element.DonationDate).toString() == "" ||
        element.DateCaged == null || (element.DateCaged).toString() == ""
      ) {
        tempValue = false;
      } else {
        tempValue = true;
      }
    });
    if (tempValue == false) {
      return false;
    } else {
      return true;
    }
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.whitemailArr = [];
    this.loadDefaultValues();
    this.router.navigate(['whitemail/new']);
  }

}
