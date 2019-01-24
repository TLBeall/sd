import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import { FormControl } from '@angular/forms';
import { ClientList } from 'src/app/Models/ClientList.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-whitemail-edit',
  templateUrl: './whitemail-edit.component.html',
  styleUrls: ['./whitemail-edit.component.scss']
})
export class WhitemailEditComponent implements OnInit {

  private id: number;
  private whitemailElement: CagingDailies;
  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();
  myControl = new FormControl();
  private Client: string;
  private testDate;
  private showSubmittedModal: boolean = false;


  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) {
    //Reinitializes the edit page every time we navigate to it
    //This allows modified data to immediately show
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.whitemailElement = this._g.whitemailElement;
    if (this.whitemailElement.ModifiedDate == null && this.whitemailElement.ModifiedBy == null) {
      this.whitemailElement.beenModified = false;
    } else {
      this.whitemailElement.beenModified = true;
    }


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

  //This sets it up so that on update the format is correct. 
  changeDate(event: any) {
    var date = event.target.value;
    this.whitemailElement.DateCaged = date.toISOString();
  }

  updateTotalGross(e: any, type: string) {
    //UPDATES VALUE OF INPUT TO PIPE CURRENCY FORMAT
    var value = (Number(e.target.value.replace(/[^0-9.-]+/g,""))).toFixed(2);
    switch(type){
      case "cash":
      this.whitemailElement.CashAmount = parseFloat(value);
      break;
      case "card":
      this.whitemailElement.CardAmount = parseFloat(value);
      break;
      case "check":
      this.whitemailElement.CheckAmount = parseFloat(value);
    }

    //UPDATES TOTAL
    var GrossArray = [this.whitemailElement.CardAmount, this.whitemailElement.CashAmount, this.whitemailElement.CheckAmount]
    this.whitemailElement.TotalGross = this.totalArray(GrossArray);
  }

  updateTotalDonor(){
    var DonorArray = [this.whitemailElement.CardDonors, this.whitemailElement.CashDonors, this.whitemailElement.CheckDonors]
    this.whitemailElement.TotalDonors = this.totalArray(DonorArray);
  }

  totalArray(array){
    var total = 0;
    array.forEach(element => {
      var temp = element.toString();
      if (temp == null || temp == "") {
        element = 0;
      } else {
        element = parseFloat(element.toString());
      }
      total = total + element;
    })
    return total;
  }

  validationFunction(): boolean {
    var formValid: boolean;
    if (
      this.whitemailElement.Client == null || this.whitemailElement.Client == "" ||
      this.whitemailElement.DateCaged == null || (this.whitemailElement.DateCaged).toString() == "" ||
      this.whitemailElement.NonDonors == null || (this.whitemailElement.NonDonors).toString() == "" ||
      this.whitemailElement.CashDonors == null || (this.whitemailElement.CashDonors).toString() == "" ||
      this.whitemailElement.CashAmount == null || (this.whitemailElement.CashAmount).toString() == "" ||
      this.whitemailElement.CardDonors == null || (this.whitemailElement.CardDonors).toString() == "" ||
      this.whitemailElement.CardAmount == null || (this.whitemailElement.CardAmount).toString() == "" ||
      this.whitemailElement.CheckDonors == null || (this.whitemailElement.CheckDonors).toString() == "" ||
      this.whitemailElement.CheckAmount == null || (this.whitemailElement.CheckAmount).toString() == ""
    ) {
      formValid = false;
    } else {
      formValid = true;
    }
    return formValid;
  }


  Cancel() {
    history.back(); //a browser function that calls the back button. The navigate function will not store the scroll position. 
  }

  Update() {
    if (this.validationFunction()) {
    var date = new Date();
    this.whitemailElement.ModifiedDate = date;
    this.whitemailElement.ModifiedBy = "TempUser";
    this.showSubmittedModal = true;
    this._authService.editCaging(this.whitemailElement, this.id).subscribe();
    setTimeout(() => {
      this.showSubmittedModal = false;
      this.router.navigate(['whitemail']);
    }, 1500)
    } else {
      alert('Please fill all required fields');
    }
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.router.navigate(['whitemail']);
  }


}
