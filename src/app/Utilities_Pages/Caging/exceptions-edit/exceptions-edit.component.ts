import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { startWith, map } from 'rxjs/operators';
import { ExceptionAggregate } from 'src/app/Models/ExceptionAggregate.model';
import { ExceptionElement } from 'src/app/Models/ExceptionElement.model';
import { GlobalService } from 'src/app/Services/global.service';
import { FormControl } from '@angular/forms';
import { ClientList } from 'src/app/Models/ClientList.model';



@Component({
  selector: 'app-exceptions-edit',
  templateUrl: './exceptions-edit.component.html',
  styleUrls: ['./exceptions-edit.component.scss']
})
export class ExceptionsEditComponent implements OnInit {

  public exceptionsAggregate: ExceptionAggregate;
  public exceptionsElement: ExceptionElement;
  public tableData: ExceptionElement[];
  public tableTotal: ExceptionElement;
  public instanceNumber: number;
  public mcIstanceMessage: string;
  public wmInstanceMessage: string;
  public deleteInstanceMessage: string;
  public headerMessage: string;
  public newMailcode: string = "";
  public dropdownSelection: number = null;
  public idString: string = "";
  public deleteNotation: string;
  public showDeleteModal: boolean = false;
  public showSubmittedModal: boolean = false;

  public InstanceColumns: string[];

  myControl = new FormControl();
  public clientList: ClientList[];
  public ClientStrArr: string[] = new Array<string>();
  public filteredClientList: Observable<string[]>;
  public Client: string;
  public clientAcronym: string = "";

  constructor(public route: ActivatedRoute, public router: Router, public _authService: AuthService, public _g: GlobalService) {
    if (_g.exceptionInstanceElem) {
      this.tableData = _g.exceptionInstanceElem.ExceptionList;
      this.instanceNumber = this.tableData.length;
    } else if (_g.exceptionElem) {
      this.tableData = [];
      this.tableData.push(_g.exceptionElem);
      this.instanceNumber = 1;
    }

    this.tableTotal = new ExceptionElement;
    this.tableTotal.CardAmount = 0;
    this.tableTotal.CardDonors = 0;
    this.tableTotal.CashAmount = 0;
    this.tableTotal.CashDonors = 0;
    this.tableTotal.CheckAmount = 0;
    this.tableTotal.CheckDonors = 0;
    this.tableTotal.NonDonors = 0;
    this.tableData.forEach(e => {
      this.tableTotal.CardAmount += e.CardAmount;
      this.tableTotal.CardDonors += e.CardDonors;
      this.tableTotal.CashAmount += e.CashAmount;
      this.tableTotal.CashDonors += e.CashDonors;
      this.tableTotal.CheckAmount += e.CheckAmount;
      this.tableTotal.CheckDonors += e.CheckDonors;
      this.tableTotal.NonDonors += e.NonDonors;
    });

  }

  ngOnInit() {
    this.dropdownSelection = 0;
    this.InstanceColumns = ['Date', 'Instance', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross'];

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

    this.determineInstanceMessage();
    this.buildIdString();

  }

  determineInstanceMessage() {
    if (this.instanceNumber == 1) {
      this.mcIstanceMessage = "this mailcode exception";
      this.wmInstanceMessage = "mailcode exception to a whitemail record";
      this.deleteInstanceMessage = "mailcode exception";
      this.headerMessage = "Exception";
      this.deleteNotation = "this mailcode exception"
    } else {
      this.mcIstanceMessage = this.instanceNumber.toString() + " mailcode exceptions";
      this.wmInstanceMessage = this.instanceNumber.toString() + " mailcode exceptions as whitemail records";
      this.deleteInstanceMessage = this.instanceNumber.toString() + " mailcode exceptions";
      this.headerMessage = "Exceptions";
      this.deleteNotation = this.instanceNumber.toString() + " mailcode exceptions";
    }
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  mainSelectClient(client) {
    this.Client = client;
    this.clientAcronym = client.split(" ").splice(-1);
  }

  assignMailcodes() {
    if (this.dropdownSelection == 1) {
      if (this.checkMailcode()) {
        this._authService.editDailiesExceptions(this.newMailcode, this.idString, null).subscribe();
        this.showSubmittedModal = true;
        setTimeout(() => {
          this.showSubmittedModal = false;
          this._g.clearCurCache = true;
          this.router.navigate(['exceptions']);
        }, 1500)
      } else {
        alert("Invalid mailcode");
      }
    }
    //Need to add client to this and as an optional parameter in the API call. 
    else if (this.dropdownSelection == 2) {
      if (this.checkClient()) {
        this._authService.editDailiesExceptions("WM", this.idString, this.clientAcronym).subscribe();
        this.showSubmittedModal = true;
        setTimeout(() => {
          this.showSubmittedModal = false;
          this._g.clearCurCache = true;
          this.router.navigate(['exceptions']);
        }, 1500)
      } else {
        alert("Invalid Client");
      }
    }

  }

  checkMailcode(): boolean {
    if (this.newMailcode != "") {
      return true;
    } else {
      return false;
    }
  }

  checkClient(): boolean {
    if (this.Client != "") {
      return true;
    } else {
      return false;
    }
  }

  preDelete(event: any) {
    this.showDeleteModal = !this.showDeleteModal;
  }

  deleteMailcodes() {
    this._authService.deleteCaging(this.idString).subscribe();
    setTimeout(() => {
      this.showDeleteModal = false;
      this._g.clearCurCache = true;
      this.router.navigate(['exceptions']);
    }, 1500)
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this._g.clearCurCache = true;
    this.router.navigate(['exceptions']);
  }

  buildIdString() {
    this.tableData.forEach((e, index) => {
      if (index == 0) {
        this.idString = e.ID.toString();
      } else {
        this.idString = this.idString + "." + e.ID.toString();
      }
    });
  }

}
