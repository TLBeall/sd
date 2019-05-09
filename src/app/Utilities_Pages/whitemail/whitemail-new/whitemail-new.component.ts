import { Component, OnInit, Testability } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';


@Component({
  selector: 'app-whitemail-new',
  templateUrl: './whitemail-new.component.html',
  styleUrls: ['./whitemail-new.component.scss']
})
export class WhitemailNewComponent implements OnInit {

  public clientList: ClientList[];
  public filteredClientList: Observable<string[]>;
  public ClientStrArr: string[] = new Array<string>();
  myControl = new FormControl();

  public whitemailElement: CagingDailies;
  public whitemailArr: CagingDailies[];
  public showSubmittedModal: boolean;
  public WMMessage: string;  


  constructor(public _authService: AuthService, public route: ActivatedRoute, public _g: GlobalService, public router: Router) {

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
      DateCaged: currentDate,
      EnteredDate: currentDate,
      MailCode: "WM",
      NonDonors: 0,
      CashDonors: 0,
      CardDonors: 0,
      CheckDonors: 0,
      CashAmount: 0,
      CardAmount: 0,
      CheckAmount: 0,
      EnteredBy: "TempUser",
      ModifiedBy: null,
      ModifiedDate: null,
      TotalDonors: null,
      TotalGross: null,
      ClientControl: new FormControl(),
      isLast: null,
      beenModified: null
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

  updateElement(e: any, type: string, element: CagingDailies){
    //UPDATES VALUE OF INPUT TO PIPE CURRENCY FORMAT
    var value = (Number(e.target.value.replace(/[^0-9.-]+/g,""))).toFixed(2);
    switch(type){
      case "cash":
      element.CashAmount = parseFloat(value);
      break;
      case "card":
      element.CardAmount = parseFloat(value);
      break;
      case "check":
      element.CheckAmount = parseFloat(value);
    }
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

    if (this.whitemailArr.length == 1){
      this.WMMessage = "Whitemail";
    } else {
      this.WMMessage = (this.whitemailArr.length).toString() + " Whitemail rows"; 
    }
  }

  public _filter(value: string): string[] {
    var filterValue;
    if (value != null){
    filterValue = value.toLowerCase();
  } else{
    filterValue = "";
  }
    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  changeDate(event: any) {
    // var date = event.target.value;
    // this.whitemailElement.DateCaged = date.toISOString();
  }

  addWMRow() {
    this.loadDefaultValues();
  }

  applyClientToAllRows(client: string){
    this.whitemailArr.forEach(element => {
      element.Client = client;
    });
  }


  addWhitemail() {
    if (this.validationFunction()) {
      this.showSubmittedModal = true;
      this._authService.createDailies(this.whitemailArr).subscribe();
      setTimeout(() => {
        this.showSubmittedModal = false;
        this.whitemailArr = [];
        this.loadDefaultValues();
        this.router.navigate(['whitemail/new']);
      }, 1500)
    } else {
      alert('Please fill all required fields');
    }
  }

  validationFunction(): boolean {
    var formValid: boolean;
    this.whitemailArr.forEach(element => {
      if (element.NonDonors == null || (element.NonDonors).toString() == "" ||
        element.CardAmount == null || (element.CardAmount).toString() == "" ||
        element.CardDonors == null || (element.CardDonors).toString() == "" ||
        element.CheckAmount == null || (element.CheckAmount).toString() == "" ||
        element.CheckDonors == null || (element.CheckDonors).toString() == "" ||
        element.CashAmount == null || (element.CashAmount).toString() == "" ||
        element.CashDonors == null || (element.CashDonors).toString() == "" ||
        element.Client == null || element.Client == "" ||
        element.DateCaged == null || (element.DateCaged).toString() == ""
      ) {
        formValid = false;
      } else {
        formValid = true;
      }
    });
    return formValid;
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.whitemailArr = [];
    this.loadDefaultValues();
    this.router.navigate(['whitemail/new']);
  }

}
