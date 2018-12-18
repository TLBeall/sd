import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ClientList } from 'src/app/Models/ClientList.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CagingDailies } from 'src/app/Models/CagingDailies.model';
import { startWith, map } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-caging-new',
  templateUrl: './caging-new.component.html',
  styleUrls: ['./caging-new.component.scss']
})
export class CagingNewComponent implements OnInit {

  private clientList: ClientList[];
  private filteredClientList: Observable<string[]>;
  private ClientStrArr: string[] = new Array<string>();
  myControl = new FormControl();

  private cagingElement: CagingDailies;
  private cagingArr: CagingDailies[];
  private showSubmittedModal: boolean;
  private cagingMessage: string; 

  public ExcelData: any[];
  private fileUrl: string = "";
  private showEx = false;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(private _authService: AuthService, private route: ActivatedRoute, private _g: GlobalService, private router: Router) { }

  ngOnInit() {
    this.cagingArr = [];
    this.loadDefaultValues();

    this._authService.getClientList("All")
      .subscribe(data => {
        this.clientList = data;
        this.clientList.forEach(p => { this.ClientStrArr.push(p.gClientName + ' - ' + p.gClientAcronym) });
        this.cagingArr.forEach(element => {
          this.filteredClientList = element.ClientControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
          });
      });
  }

  private _filter(value: string): string[] {
    var filterValue;
    if (value != null){
    filterValue = value.toLowerCase();
  } else{
    filterValue = "";
  }
    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  loadDefaultValues() {
    var currentDate = new Date();

    var element: CagingDailies = {
      Agency: "HSP",
      Client: null,
      MailCodeId: null,
      DateCaged: currentDate,
      EnteredDate: currentDate,
      MailCode: null,
      NonDonors: 0,
      CashDonors: 0,
      CardDonors: 0,
      CheckDonors: 0,
      CashAmount: 0,
      CardAmount: 0,
      CheckAmount: 0,
      EnteredBy: "TempUser",
      ModifiedBy: null,
      ModifiedDate: null,
      TotalDonors: null,
      TotalGross: null,
      ClientControl: new FormControl(),
      isLast: null,
      beenModified: null
    };

    this.cagingArr.push(element);

    if (this.cagingArr.length == 1){
      this.cagingMessage = "Caging Entry";
    } else {
      this.cagingMessage = (this.cagingArr.length).toString() + " Caging Entries"; 
    }

    this.determineLast();

    this.cagingArr.forEach((element, index) => {
      if (index == (this.cagingArr.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });

    this.cagingArr.forEach(element => {
      this.filteredClientList = element.ClientControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      });
  }

  updateElement(e: any, type: string, element: CagingDailies){
    //UPDATES VALUE OF INPUT TO PIPE CURRENCY FORMAT
    var value = (Number(e.target.value.replace(/[^0-9.-]+/g,""))).toFixed(2);
    switch(type){
      case "cash":
      element.CashAmount = parseFloat(value);
      break;
      case "card":
      element.CardAmount = parseFloat(value);
      break;
      case "check":
      element.CheckAmount = parseFloat(value);
    }
  }

  determineLast() {
    this.cagingArr.forEach((element, index) => {
      if (index == (this.cagingArr.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });
  }

  deleteRow(element: any) {
    const index = this.cagingArr.indexOf(element);
    if (this.cagingArr.length > 1) {
      this.cagingArr.splice(index, 1);
    }

    this.determineLast();

    this.cagingArr.forEach((element, index) => {
      if (index == (this.cagingArr.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });

    if (this.cagingArr.length == 1){
      this.cagingMessage = "Caging Entry";
    } else {
      this.cagingMessage = (this.cagingArr.length).toString() + " Caging Entries"; 
    }
  }

  addRow() {
    this.loadDefaultValues();
  }

  submitPage() {
    if (this.validationFunction()) {
      this.showSubmittedModal = true;
      this._authService.createDailies(this.cagingArr).subscribe();
      setTimeout(() => {
        this.showSubmittedModal = false;
        this.cagingArr = [];
        this.loadDefaultValues();
        this.router.navigate(['caging/new']);
      }, 1500)
    } else {
      alert('Please fill all required fields');
    }
  }

  validationFunction(): boolean {
    var formValid: boolean;
    this.cagingArr.forEach(element => {
      if (element.NonDonors == null || (element.NonDonors).toString() == "" ||
        element.CardAmount == null || (element.CardAmount).toString() == "" ||
        element.CardDonors == null || (element.CardDonors).toString() == "" ||
        element.CheckAmount == null || (element.CheckAmount).toString() == "" ||
        element.CheckDonors == null || (element.CheckDonors).toString() == "" ||
        element.CashAmount == null || (element.CashAmount).toString() == "" ||
        element.CashDonors == null || (element.CashDonors).toString() == "" ||
        element.Client == null || element.Client == "" ||
        element.MailCode == null || element.MailCode == "" ||
        element.DateCaged == null || (element.DateCaged).toString() == ""
      ) {
        formValid = false;
      } else {
        formValid = true;
      }
    });
    return formValid;
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.cagingArr = [];
    this.loadDefaultValues();
    this.router.navigate(['caging/new']);
  }


  //Excel file read
  /* File Input element for browser */
  onFileChange(evt: any) {
    this.fileUrl = evt.target.files[0].name;
    // console.log(this.fileInput);

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.read(bstr);
    };
    reader.readAsBinaryString(target.files[0]);
  };


  read(bstr: string) {
    //Determine whether to start array from scratch or build on top of previous array
    if (this.validationFunction()) {
      this.cagingArr = this.cagingArr;
    } else {
      this.cagingArr = [];
    }


    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.ExcelData = XLSX.utils.sheet_to_json(ws, { header: 1 });

    //Convert data to be passed to database
    var tempData = this.ExcelData.splice(1); //omitting header of excel file
    var currentDate = new Date();
    tempData.forEach(a => {
      if (a[0] != null) {
        let cagingElement = new CagingDailies();
        cagingElement.Agency = "HSP";
        // cagingElement.Client = this.convertClient(a[this.fileUrl]);
        cagingElement.MailCodeId = null;
        cagingElement.DateCaged = this.convertDate(a[0]);
        cagingElement.EnteredDate = currentDate;
        cagingElement.ModifiedDate = null;
        cagingElement.MailCode = a[1];
        cagingElement.NonDonors = a[2];
        cagingElement.CashDonors = a[3];
        cagingElement.CashAmount = a[4];
        cagingElement.CardDonors = a[5];
        cagingElement.CardAmount = a[6];
        cagingElement.CheckDonors = a[7];
        cagingElement.CheckAmount = a[8];
        cagingElement.EnteredBy = "TempUser";
        cagingElement.ModifiedBy = null;
        cagingElement.ClientControl = new FormControl();
        cagingElement.isLast = null;
        cagingElement.beenModified = null;
        cagingElement.TotalDonors = null;
        cagingElement.TotalGross = null;
        this.cagingArr.push(cagingElement);
      }
    });

    this.determineLast();
    // this.ref.detectChanges(); //"reloads" the page after the new rows are added from file
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

  convertDate(date: number): any {
    return new Date((date - 25568) * 86400 * 1000);
  }

  showExample(){
    this.showEx = !this.showEx;
  }


}
