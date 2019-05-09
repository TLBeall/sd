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

  public clientList: ClientList[];
  public filteredClientList: Observable<string[]>;
  public ClientStrArr: string[] = new Array<string>();
  myControl = new FormControl();

  public cagingElement: CagingDailies;
  public cagingArr: CagingDailies[];
  public showSubmittedModal: boolean;
  public cagingMessage: string; 
  public loading: boolean = false;

  public ExcelData: any[];
  public fileUrl: string = "";
  public showEx = false;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(public _authService: AuthService, public route: ActivatedRoute, public _g: GlobalService, public router: Router) { }

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

  public _filter(value: string): string[] {
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

  applyClientToAllRows(client: string){
    this.cagingArr.forEach(element => {
      element.Client = client;
    });
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
    this.loading = true;
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

    var depositDateCol: number;
    var mailcodeCol: number;
    var nonDonorsCol: number;
    var cashDonorsCol: number;
    var cashAmountCol: number;
    var ccDonorsCol: number;
    var ccAmountCol: number;
    var checkDonorsCol: number;
    var checkAmountCol: number;

    /* save data */
    this.ExcelData = XLSX.utils.sheet_to_json(ws, { header: 1 });
    this.ExcelData[0].forEach((element, index) => {
      let header = element.trim().toLowerCase();
      switch (header){
        case "maildate":
        depositDateCol = index;
        break;
        case "depositdate":
        depositDateCol = index;
        break;
        case "cagedate":
        depositDateCol = index;
        break;
        case "mailcode":
        mailcodeCol = index;
        break;
        case "nondonors":
        nonDonorsCol = index;
        break;
        case "donors":
        cashDonorsCol = index;
        break;
        case "amount":
        cashAmountCol = index;
        break;
        case "cashdonors":
        cashDonorsCol = index;
        break;
        case "cashamount":
        cashAmountCol = index;
        break;
        case "ccdonors":
        ccDonorsCol = index;
        break;
        case "ccamount":
        ccAmountCol = index;
        break;
        case "checkdonors":
        checkDonorsCol = index;
        break;
        case "checkamount":
        checkAmountCol = index;
        break;
      }
    });

    //Convert data to be passed to database
    var tempData = this.ExcelData.splice(1); //omitting header of excel file
    var currentDate = new Date();
    tempData.forEach(a => {
      if (this.lastRowInFile(a) == false) {
        let cagingElement = new CagingDailies();
        cagingElement.Agency = "HSP";
        // cagingElement.Client = this.convertClient(a[this.fileUrl]);
        cagingElement.MailCodeId = null;
        cagingElement.DateCaged = this.convertDate(a[depositDateCol]);
        cagingElement.EnteredDate = currentDate;
        cagingElement.ModifiedDate = null;
        cagingElement.MailCode = a[mailcodeCol];
        cagingElement.NonDonors = this.fileValueSet(a[nonDonorsCol]);
        cagingElement.CashDonors = this.fileValueSet(a[cashDonorsCol]);
        cagingElement.CashAmount = this.fileValueSet(a[cashAmountCol]);
        cagingElement.CardDonors = this.fileValueSet(a[ccDonorsCol]);
        cagingElement.CardAmount = this.fileValueSet(a[ccAmountCol]);
        cagingElement.CheckDonors = this.fileValueSet(a[checkDonorsCol]);
        cagingElement.CheckAmount = this.fileValueSet(a[checkAmountCol]);
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
    this.loading = false;
    // this.ref.detectChanges(); //"reloads" the page after the new rows are added from file
  }

  fileValueSet(value: any){
    if (value == null){
      return 0;
    } else {
      return value;
    }
  }

  lastRowInFile(row: any){
    var rowCheck = 0;
    if (row[0] == null){
      rowCheck++;
    }
    row.forEach(element => {
      let str = element.toString().toLowerCase();
      if (str == "total" || str == "totals"){
        rowCheck++;
      }
    });
    if (rowCheck > 0){
      return true;
    } else {
      return false;
    }
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
