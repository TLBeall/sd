import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { startWith, map } from 'rxjs/operators';
import { Incidental } from 'src/app/Models/Incidentals.model';
import { FormControl } from '@angular/forms';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-incidentals-edit',
  templateUrl: './incidentals-edit.component.html',
  styleUrls: ['./incidentals-edit.component.scss']
})
export class IncidentalsEditComponent implements OnInit {
  private id: number;
  private IncidentalsElement: Incidental;
  private auditStatus: string;
  private showAuditUndoModal: boolean = false;

  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();
  private clientControl = new FormControl();

  private showSubmittedModal: boolean;


  @ViewChild('trueRadio') trueRadio: any;
  @ViewChild('falseRadio') falseRadio: any;

  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) {
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
    this.IncidentalsElement = this._g.IncidentalsElement;
    if (this.IncidentalsElement.ModifiedDate == null && this.IncidentalsElement.ModifiedBy == null) {
      this.IncidentalsElement.beenModified = false;
    } else {
      this.IncidentalsElement.beenModified = true;
    }

    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.filteredClientList = this.clientControl.valueChanges
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

  changeDate(event: any) {
    var date = event.target.value;
    this.IncidentalsElement.IncidenceDate = date.toISOString();
  }

  radioChange(event: any) {
    if (event.value == true) {
      var date = new Date();
      this.IncidentalsElement.AuditDate = date;
      this.IncidentalsElement.AuditedBy = "TempUser";
      this.IncidentalsElement.Audited = true;
      this.trueRadio.checked = true;
      this.falseRadio.checked = false;
    } else {
      this.showAuditUndoModal = true;
    }
  }

  confirmUndoAudit() {
    this.IncidentalsElement.Audited = false;
    this.trueRadio.checked = false;
    this.falseRadio.checked = true;
    this.showAuditUndoModal = false;
  }

  cancelModal() {
    this.trueRadio.checked = true;
    this.falseRadio.checked = false;
    this.showAuditUndoModal = false;
  }

  Cancel() {
    history.back(); //a browser function that calls the back button. The navigate function will not store the scroll position. 
  }

  Update() {
    var date = new Date();
    this.IncidentalsElement.ModifiedDate = date;
    this.IncidentalsElement.ModifiedBy = "TempUser";
    this.showSubmittedModal = true;
    this._authService.editIncidentalRow(this.IncidentalsElement, this.id).subscribe();
    setTimeout(() => {
      this.showSubmittedModal = false;
      this.router.navigate(['incidentals']);
    }, 1500)
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.router.navigate(['incidentals']);
  }

}
