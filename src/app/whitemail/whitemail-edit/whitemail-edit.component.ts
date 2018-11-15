import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import { FormControl } from '@angular/forms';
import { ClientList } from 'src/app/Models/ClientList.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { totalmem } from 'os';

@Component({
  selector: 'app-whitemail-edit',
  templateUrl: './whitemail-edit.component.html',
  styleUrls: ['./whitemail-edit.component.scss']
})
export class WhitemailEditComponent implements OnInit {

  private id;
  private whitemailElement: CagingDailies;
  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();
  myControl = new FormControl();
  private Client: string;
  private testDate;
  private showSubmittedModal: boolean = false;


  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) {

  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.whitemailElement = this._g.whitemailElement;


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

  //This sets it up so that on update the format is correct. 
  changeDate(event: any) {
    var date = event.target.value;
    this.whitemailElement.DonationDate = date.toISOString();
  }

  updateTotal() {
    var DonorArray = [this.whitemailElement.CardDonors, this.whitemailElement.CashDonors, this.whitemailElement.CheckDonors]
    var GrossArray = [this.whitemailElement.CardAmount, this.whitemailElement.CashAmount, this.whitemailElement.CheckAmount]

    function Total(array) {
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

    this.whitemailElement.TotalDonors = Total(DonorArray);
    this.whitemailElement.TotalGross = Total(GrossArray);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  // validateDate(): boolean {
  //   var date = event.target.value;
  //   var reg = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/;

  //   if (date != null && date != "") {
  //     var convertedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  //     if (convertedDate.match(reg)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }


  Cancel() {
    history.back(); //a browser function that calls the back button. The navigate function will not store the scroll position. 
  }

  Update() {
    var date = new Date();
    this.whitemailElement.ModifiedDate = date;
    this.whitemailElement.ModifiedBy = "TempUser";
    this.showSubmittedModal = true;
    this._authService.editWhitemail(this.whitemailElement, this.id).subscribe();
    setTimeout(() => {
      this.showSubmittedModal = false;
      this.router.navigate(['whitemail']);
    }, 1500)
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.router.navigate(['whitemail']);
  }


}
