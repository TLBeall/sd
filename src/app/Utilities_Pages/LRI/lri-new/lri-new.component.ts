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

type AOA = ListRental[];

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

  public ExcelData: any[];
  private fileUrl: string = "";
  private exampleLRI = false;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;


  constructor(
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _g: GlobalService,
    private router: Router,
    private ref: ChangeDetectorRef) {
  }

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
      ID: 0,
      LRIDate: currentDate,
      ListID: 0,
      ModifiedBy: null,
      ModifiedDate: null,
      ClientControl: new FormControl(),
      isLast: null,
      beenModified: false
    };

    this.LRIArray.push(element);

    if (this.LRIArray.length == 1) {
      this.LRINumMessage = "LRI";
    } else {
      this.LRINumMessage = (this.LRIArray.length).toString() + " LRI rows";
    }

    this.determineLast();

    this.LRIArray.forEach(element => {
      this.filteredClientList = element.ClientControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });
  }

  updateElement(e: any, element: ListRental){
    //UPDATES VALUE OF INPUT TO PIPE CURRENCY FORMAT
    var value = (Number(e.target.value.replace(/[^0-9.-]+/g,""))).toFixed(2);
      element.Amount = parseFloat(value);
  }

  determineLast() {
    this.LRIArray.forEach((element, index) => {
      if (index == (this.LRIArray.length - 1)) {
        element.isLast = true;
      } else {
        element.isLast = false;
      }
    });
  }

  private _filter(value: string): string[] {
    var filterValue;
    if (value != null) {
      filterValue = value.toLowerCase();
    } else {
      filterValue = "";
    }
    return this.ClientStrArr.filter(option => option.toLowerCase().includes(filterValue));
  }

  deleteRow(element: any) {
    const index = this.LRIArray.indexOf(element);
    if (this.LRIArray.length > 1) {
      this.LRIArray.splice(index, 1);
    }

    this.determineLast();

    if (this.LRIArray.length == 1) {
      this.LRINumMessage = "LRI";
    } else {
      this.LRINumMessage = (this.LRIArray.length).toString() + " LRI rows";
    }
  }

  //adds to front end
  addLRIRow() {
    this.loadDefaultValues();
  }

  //Adds to database
  addLRI() {
    if (this.validationFunction()) {
      this.showSubmittedModal = true;
      this._authService.createLRI(this.LRIArray).subscribe();
      setTimeout(() => {
        this.router.navigate(['lri/new']);
        this.showSubmittedModal = false;
        this.resetFile();
        this.LRIArray = [];
        this.loadDefaultValues();
      }, 1500)
    } else {
      alert('Please fill all fields');
    }
  }

  validationFunction(): boolean {
    var formValid: boolean;
    this.LRIArray.forEach(element => {
      if (element.Client == null || element.Client == "" ||
        element.Amount == null || (element.Amount).toString() == "" || element.Amount == 0 ||
        element.LRIDate == null || (element.LRIDate).toString() == ""
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
    this.LRIArray = [];
    this.resetFile();
    this.loadDefaultValues();
    this.router.navigate(['lri/new']);
  }


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
      this.LRIArray = this.LRIArray;
    } else {
      this.LRIArray = [];
    }


    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.ExcelData = XLSX.utils.sheet_to_json(ws, { header: 1 });

    //Convert data to be passed to database
    var tempData = this.ExcelData.splice(3); //omitting header of excel file
    var currentDate = new Date();
    tempData.forEach(a => {
      if (a[0] != null) {
        let LRIElement = new ListRental();
        LRIElement.Amount = a[3];
        LRIElement.Client = this.convertClient(a[1]);
        LRIElement.CreatedBy = "TempUser";
        LRIElement.CreatedDate = currentDate;
        LRIElement.Description = "";
        LRIElement.ID = 0;
        LRIElement.LRIDate = this.convertDate(a[0]);
        LRIElement.ListID = 0;
        LRIElement.ModifiedBy = null;
        LRIElement.ModifiedDate = null;
        LRIElement.ClientControl = new FormControl();
        LRIElement.isLast = null;
        this.LRIArray.push(LRIElement);
        // console.log(this.LRIArray);
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

  showExampleLRI(){
    this.exampleLRI = !this.exampleLRI;
  }

}
