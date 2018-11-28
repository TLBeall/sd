import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  private LRIElement: ListRental;
  private id: number;
  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();
  private myControl = new FormControl();
  private showSubmittedModal: boolean = false;


  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.LRIElement = this._g.LRIElement;

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

  // This sets it up so that on update the format is correct. 
  changeDate(event: any) {
    var date = event.target.value;
    this.LRIElement.LRIDate = date.toISOString();
  }

  Cancel() {
    history.back(); //a browser function that calls the back button. The navigate function will not store the scroll position. 
  }

  Update() {
    var date = new Date();
    this.LRIElement.ModifiedDate = date;
    this.LRIElement.ModifiedBy = "TempUser";
    this.showSubmittedModal = true;
    this._authService.editLRIRow(this.LRIElement, this.id).subscribe();
    setTimeout(() => {
      this.showSubmittedModal = false;
      this.router.navigate(['lri']);
    }, 1500)
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.router.navigate(['whitemail']);
  }

}
