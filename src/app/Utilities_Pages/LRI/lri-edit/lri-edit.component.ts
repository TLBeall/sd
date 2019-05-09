import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ListRental } from 'src/app/Models/ListRental.model';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-lri-edit',
  templateUrl: './lri-edit.component.html',
  styleUrls: ['./lri-edit.component.scss']
})
export class LriEditComponent implements OnInit {

  public LRIElement: ListRental;
  public id: number;
  public clientList: ClientList[];
  public filteredClientList: Observable<string[]>;
  public ClientStrArr: string[] = new Array<string>();
  public myControl = new FormControl();
  public showSubmittedModal: boolean = false;


  constructor(public _authService: AuthService, public route: ActivatedRoute, public _g: GlobalService, public router: Router) {
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
    this.LRIElement = this._g.LRIElement;
    if (this.LRIElement.ModifiedDate == null && this.LRIElement.ModifiedBy == null) {
      this.LRIElement.beenModified = false;
    } else {
      this.LRIElement.beenModified = true;
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

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  // This sets it up so that on update the format is correct. 
  changeDate(event: any) {
    var date = event.target.value;
    this.LRIElement.LRIDate = date.toISOString();
  }

  Cancel() {
    history.back(); //a browser function that calls the back button. The navigate function will not store the scroll position. 
  }

  validationFunction(): boolean {
    var formValid: boolean;
    if (
      this.LRIElement.Client == null || this.LRIElement.Client == "" ||
      this.LRIElement.LRIDate == null || (this.LRIElement.LRIDate).toString() == "" ||
      this.LRIElement.Amount == null || (this.LRIElement.Amount).toString() == ""
    ) {
      formValid = false;
    } else {
      formValid = true;
    }
    return formValid;
  }

  Update() {
    if (this.validationFunction()) {
      var date = new Date();
      this.LRIElement.ModifiedDate = date;
      this.LRIElement.ModifiedBy = "TempUser";
      this.showSubmittedModal = true;
      this._authService.editLRIRow(this.LRIElement, this.id).subscribe();
      setTimeout(() => {
        this.showSubmittedModal = false;
        this.router.navigate(['lri']);
      }, 1500)
    } else {
      alert('Please fill all required fields');
    }
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.router.navigate(['lri']);
  }


  updateValue(e: any){
    var value = (Number(e.target.value.replace(/[^0-9.-]+/g,""))).toFixed(2);
    this.LRIElement.Amount = parseFloat(value);
  }

}
