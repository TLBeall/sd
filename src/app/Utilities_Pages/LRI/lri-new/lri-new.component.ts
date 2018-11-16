import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { ListRental } from 'src/app/Models/ListRental.model';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-lri-new',
  templateUrl: './lri-new.component.html',
  styleUrls: ['./lri-new.component.scss']
})
export class LriNewComponent implements OnInit {

  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();

  private LRIElement: ListRental;
  private LRIArray: ListRental[];
  private showSubmittedModal: boolean;
  private LRINumMessage: string;  

  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) { }

  ngOnInit() {
    this.LRIArray = [];
    this.loadDefaultValues();

    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.LRIArray.forEach(element => {
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

    var element: ListRental = {
      Amount: 0,
      Client: null,
      CreatedBy: "TempUser",
      CreatedDate: currentDate,
      Description: "",
      ID: null,
      LRIDate: currentDate,
      ListID: null,
      ModifiedBy: "TempUser",
      ModifiedDate: currentDate,
      ClientControl: new FormControl(),
      isLast: null
    };

    this.LRIArray.push(element);

    if (this.LRIArray.length == 1){
      this.LRINumMessage = "LRI";
    } else {
      this.LRINumMessage = (this.LRIArray.length).toString() + " LRI rows"; 
    }

    this.LRIArray.forEach((element, index) => {
      if (index == (this.LRIArray.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });

    this.LRIArray.forEach(element => {
      this.filteredClientList = element.ClientControl.valueChanges
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

  deleteRow(element: any) {
    const index = this.LRIArray.indexOf(element);
    if (this.LRIArray.length > 1) {
      this.LRIArray.splice(index, 1);
    }

    this.LRIArray.forEach((element, index) => {
      if (index == (this.LRIArray.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });
  }

  //adds to front end
  addLRIRow() {
    this.loadDefaultValues();
  }

//Adds to database
  addLRI() {
    if (this.validationFunction()) {
      this.showSubmittedModal = true;
      this.LRIArray.forEach(element => {
        element.ClientControl = null;
        element.isLast = null;
        var tempclient = element.Client;
        var reg = /(?<= - ).*/;
        element.Client = (tempclient.match(reg)).toString();
      });
      this._authService.createLRI(this.LRIArray).subscribe();
      setTimeout(() => {
        this.showSubmittedModal = false;
        this.LRIArray = [];
        this.loadDefaultValues();
        this.router.navigate(['lri/new']);
      }, 2500)
    } else {
      alert('Please fill all fields');
    }
  }

  validationFunction(): boolean {
    var tempValue: boolean;
    this.LRIArray.forEach(element => {
      if (element.Client == null || element.Client == "" ||
        element.Amount == null || (element.Amount).toString() == "" ||
        element.LRIDate == null || (element.LRIDate).toString() == ""
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
    this.LRIArray = [];
    this.loadDefaultValues();
    this.router.navigate(['lri/new']);
  }

}
