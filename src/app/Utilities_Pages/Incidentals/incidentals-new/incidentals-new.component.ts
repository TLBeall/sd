import { Component, OnInit } from '@angular/core';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Incidental } from 'src/app/Models/Incidentals.model';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-incidentals-new',
  templateUrl: './incidentals-new.component.html',
  styleUrls: ['./incidentals-new.component.scss']
})
export class IncidentalsNewComponent implements OnInit {

  public clientList: ClientList[];
  public filteredClientList: Observable<string[]>;
  public ClientStrArr: string[] = new Array<string>();

  public IncidentalElement: Incidental;
  public IncidentalArray: Incidental[];
  public showSubmittedModal: boolean;
  public IncidentalNumMessage: string;

  constructor(
    public _authService: AuthService,
    public route: ActivatedRoute,
    public _g: GlobalService,
    public router: Router) {
  }

  ngOnInit() {
    this.IncidentalArray = [];
    this.loadDefaultValues();

    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.IncidentalArray.forEach(element => {
          this.filteredClientList = element.ClientControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        });
      });
  }

  loadDefaultValues() {
    const currentDate = new Date();
    var element: Incidental = {
      Amount: 0,
      AuditDate: null,
      Audited: false,
      AuditedBy: null,
      Client: null,
      CreatedBy: "TempUser",
      CreatedDate: currentDate,
      Description: "",
      ID: 0,
      IncidenceDate: currentDate,
      ListID: 0,
      ModifiedDate: null,
      ModifiedBy: null,
      ClientControl: new FormControl(),
      isLast: null,
      beenModified: null
    };

    this.IncidentalArray.push(element);

    if (this.IncidentalArray.length == 1) {
      this.IncidentalNumMessage = "Incidental";
    } else {
      this.IncidentalNumMessage = (this.IncidentalArray.length).toString() + " Incidental rows";
    }

    this.determineLast();

    this.IncidentalArray.forEach(element => {
      this.filteredClientList = element.ClientControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });
  }

  determineLast() {
    this.IncidentalArray.forEach((element, index) => {
      if (index == (this.IncidentalArray.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });
  }

  public _filter(value: string): string[] {
    var filterValue;
    if (value != null) {
      filterValue = value.toLowerCase();
    } else {
      filterValue = "";
    }
    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  deleteRow(element: any) {
    const index = this.IncidentalArray.indexOf(element);
    if (this.IncidentalArray.length > 1) {
      this.IncidentalArray.splice(index, 1);
    }

    this.determineLast();

    if (this.IncidentalArray.length == 1) {
      this.IncidentalNumMessage = "Incidental";
    } else {
      this.IncidentalNumMessage = (this.IncidentalArray.length).toString() + " Incidental rows";
    }
  }

  //adds to front end
  addRow() {
    this.loadDefaultValues();
  }

  //Adds to database
  addIncidentals() {
    if (this.validationFunction()) {
      this.showSubmittedModal = true;
      this._authService.createIncidentals(this.IncidentalArray).subscribe();
      setTimeout(() => {
        this.router.navigate(['incidentals/new']);
        this.showSubmittedModal = false;
        // this.resetFile();
        this.IncidentalArray = [];
        this.loadDefaultValues();
      }, 1500)
    } else {
      alert('Please fill all fields');
    }
  }

  validationFunction(): boolean {
    var formValid: boolean;
    this.IncidentalArray.forEach(element => {
      if (element.Client == null || element.Client == "" ||
        element.Amount == null || (element.Amount).toString() == "" || element.Amount == 0 ||
        element.IncidenceDate == null || (element.IncidenceDate).toString() == ""
      ) {
        formValid = false;
      } else {
        formValid = true;
      }
    });
    return formValid;
  }

  // resetFile(){
  //   this.fileUrl = "";
  //   this.fileInput.nativeElement.value = null;
  // }

  modalCancel() {
    this.showSubmittedModal = false;
    this.IncidentalArray = [];
    // this.resetFile();
    this.loadDefaultValues();
    this.router.navigate(['incidentals/new']);
  }

}
