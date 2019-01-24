import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { ListRental } from 'src/app/Models/ListRental.model';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { PhaseList } from 'src/app/Models/PhaseList';

type AOA = ListRental[];

@Component({
  selector: 'app-upload-pdf',
  templateUrl: './upload-pdf.component.html',
  styleUrls: ['./upload-pdf.component.scss']
})
export class UploadPDFComponent implements OnInit {

  private clientList: ClientList[];
  private phaseList: PhaseList[];
  private filteredClientList: Observable<string[]>;
  private filteredPhaseList: Observable<string[]>;
  private PhaseStrArr: string[] = new Array<string>();
  private ClientStrArr: string[] = new Array<string>();

  private Client: string;
  private Phase: string;
  private ClientControl = new FormControl;
  private PhaseControl = new FormControl;

  private showSubmittedModal: boolean;

  private fileUrl: string = "";
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;


  constructor(
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _g: GlobalService,
    private router: Router,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
          this.filteredClientList = this.ClientControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
      });
  }


  private _filter(value: string): string[] {
    var filterValue;
    if (value != null) {
      filterValue = value.toLowerCase();
      var clientAcronym = (filterValue.match(/[A-Z]*/)).toString();
      this._authService.getPhasebyClient('ACRU')
      .subscribe(data => {
        this.phaseList = data;
        this.phaseList.forEach(p => { this.PhaseStrArr.push(p.PhaseName) });
      });
    } else {
      filterValue = "";
    }
    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }


  modalCancel() {
    this.showSubmittedModal = false;
    this.resetFile();

    this.router.navigate(['uploadpdf']);
  }


  /* File Input element for browser */
  onFileChange(evt: any) {
    this.fileUrl = evt.target.files[0].name;
    // console.log(this.fileInput);

    /* wire up file reader */
    // const target: DataTransfer = <DataTransfer>(evt.target);
    // if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    // const reader: FileReader = new FileReader();
    // reader.onload = (e: any) => {
    //   const bstr: string = e.target.result;
    //   this.read(bstr);
    // };
    // reader.readAsBinaryString(target.files[0]);
  };

  onClientChange(evt: any) {
  }

  resetFile(){
    this.fileUrl = "";
    this.fileInput.nativeElement.value = null;
  }

  determineReset(event:any){
    if (event.target.value == ""){
      this.resetFile();
    }
  }

  convertClient(client: string): string {
    let clientAcronym = (client.match(/[A-Z]*/)).toString();
    let clientString = (client.match(/(?<=--).*/)).toString();
    let updatedClient = clientString + " - " + clientAcronym;
    return updatedClient;
  }
}
