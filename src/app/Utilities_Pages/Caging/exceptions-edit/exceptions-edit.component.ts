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

  private exceptionsAggregate: ExceptionAggregate;
  private exceptionsElement: ExceptionElement;
  private tableData: ExceptionElement[];
  private tableTotal: ExceptionElement;
  private instanceNumber: number;
  private mcIstanceMessage: string;
  private wmInstanceMessage: string;
  private deleteInstanceMessage: string;
  private headerMessage: string;
  private newMailcode: string = "";
  private dropdownSelection: number = null;
  private idString: string = "";
  private deleteNotation: string;
  private showDeleteModal: boolean = false;
  private showSubmittedModal: boolean = false;

  public InstanceColumns: string[];

  myControl = new FormControl();
  private clientList: ClientList[];
  private ClientStrArr: string[] = new Array<string>();
  private filteredClientList: Observable<string[]>;
  private Client: string;
  private clientAcronym: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService, private _g: GlobalService) {
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  mainSelectClient(client) {
    this.Client = client;
    var reg = /(?<= - ).*/;
    this.clientAcronym = client.match(reg);
  }

  assignMailcodes() {
    if (this.dropdownSelection == 1) {
      if (this.checkMailcode()) {
        // this._authService.editDailiesExceptions(this.newMailcode, this.idString).subscribe();
        this.showSubmittedModal = true;
        setTimeout(() => {
          this.showSubmittedModal = false;
          this.router.navigate(['exceptions']);
        }, 1500)
      } else {
        alert("Invalid mailcode");
      }
    }
    //Need to add client to this and as an optional parameter in the API call. 
    // else if (this.dropdownSelection == 2) {
    //   if (this.checkClient()) {
    //     this._authService.editDailiesExceptions("WM", this.idString).subscribe();
    // this.showSubmittedModal = true;
    // setTimeout(() => {
      //       this.showSubmittedModal = false;
      //       this.router.navigate(['exceptions']);
      //     }, 1500)
      //   } else {
      //     alert("Invalid Client");
      //   }
      // }

    }

  checkMailcode(): boolean {
        if(this.newMailcode != "") {
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
    // this._authService.deleteCaging(this.idString).subscribe();
    setTimeout(() => {
      this.showDeleteModal = false;
      this.router.navigate(['exceptions']);
    }, 1500)
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.router.navigate(['exceptions']);
  }

  buildIdString() {
    this.tableData.forEach((e, index) => {
      if (index == 1) {
        this.idString = e.ID.toString();
      } else {
        this.idString = this.idString + "." + e.ID.toString();
      }
    });
  }

}
