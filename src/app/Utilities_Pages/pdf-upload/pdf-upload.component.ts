import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER, COMMA, P } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import * as moment from 'moment';
import { PDFElement } from 'src/app/Models/PDFEelement.model';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss']
})
export class PdfUploadComponent implements OnInit {

  //FOR CHIP SELECTION SETTINGS
  @ViewChild('CLInput') CLInput: ElementRef<HTMLInputElement>;
  private CLStrArr: string[] = new Array<string>();
  private CLControl = new FormControl();
  private CLList: string[] = []; //clients in main returns
  private CLfilteredOptions: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  clientPlaceholder = "All Clients -- Select Client"


  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;


  // private packageCount = 0;
  private pdfCount = 0;
  private noneCount = 0;
  private bothCount = 0;

  public loading: boolean = true;
  private startDate: any;
  private endDate: any;
  private tableData;
  private dataSource;
  private pdfType: string[];
  private fileUrl: string;
  private tableState: number = 3;
  private selectedFile: File = null;
  private showSubmittedModal: boolean = false;
  private showUpdateConfirmModal: boolean = false;
  private storedFileElement: PDFElement;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;


  MainDisplayedColumns: string[] = ['PackageName', 'Client', 'Date', 'Description', 'Link', 'ButtonControl'];

  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService, private http: HttpClient) { }

  ngOnInit() {
    //FOR CLIENT SELECTION
    let dateStart = new Date("1/1/2000");
    let dateEnd = new Date("12/31/" + (new Date()).getFullYear().toString());
    //FOR TIME PARAMETER SELECTION
    let yearEnd = new Date("12-31-" + (new Date()).getFullYear().toString());
    let current = new Date();
    let tempStartDate = moment(current, "MM-DD-YYYY").subtract(91, 'd').format("MM-DD-YYYY");
    this.endDate = new Date();
    this.startDate = new Date(tempStartDate);

    this._authService.getClientsFilter(dateStart, dateEnd).subscribe(data => {
      this.CLStrArr = Array.from(new Set(data.map(item => item.gClientName + ' - ' + item.gClientAcronym))).sort();
      this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
        startWith(null),
        map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
      );
    });

    this.loadPDFData(this.convertCLList(), this.convertDate(this.startDate), this.convertDate(this.endDate));
  }



  ////////////////////////////// GETTING AND PROCESSING DATA FOR TABLE /////////////////////////////
  loadPDFData(clients: string, start: string, end: string) {
    this.loading = true;
    this.pdfType = ["PDF", "None"];
    this._authService.getPDFList(clients, start, end).subscribe(data => {
      this.tableData = new MatTableDataSource(data);
      this.tableData.data.forEach(element => {
        element.Hidden = false;
        element.ShowControl = false;
      });
      this.defaultSortTable();
      this.checkPageState();
      this.countPackages();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.tableData.filter = filterValue.trim().toLowerCase();
  }



  ///////////////////// CLIENT SELECTION / CHIP SETTINGS ///////////////////////////
  //CHIP FILTER START
  private CL_filter(name: string): string[] {
    if (name == null)
      return null;
    const filterValue = name.toLowerCase();
    return this.CLStrArr.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }

  //CHIP ADD START
  CL_Add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.CLList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.CLControl.setValue(null);
  }

  //CHIP REMOVE START
  CL_Remove(name: string): void {
    this.loading = true;
    const index = this.CLList.indexOf(name);
    if (index >= 0) {
      this.CLList.splice(index, 1);
    }

    this.loadPDFData(this.convertCLList(), this.convertDate(this.startDate), this.convertDate(this.endDate))


    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "All Clients -- Select Client"
    }
  }

  //CHIP DROPDOWN SELECTED START
  CL_Selected(event: MatAutocompleteSelectedEvent): void {
    this.loading = true;
    if (!this.CLList.includes(this.getAcronym(event.option.viewValue))) {
      this.CLList.push(this.getAcronym(event.option.viewValue));

    }
    this.CLInput.nativeElement.value = '';
    this.CLControl.setValue(null);
    this.CLfilteredOptions = this.CLControl.valueChanges.pipe(
      startWith(null),
      map((client: string | null) => client ? this.CL_filter(client) : this.CLStrArr.slice())
    );
    this.CLInput.nativeElement.blur();

    this.loadPDFData(this.convertCLList(), this.convertDate(this.startDate), this.convertDate(this.endDate))

    if (this.CLList.length > 0) {
      this.clientPlaceholder = "Add another client"
    } else {
      this.clientPlaceholder = "All Clients -- Select Client"
    }
  }



  ////////////////////// SORTING FUNCTIONS /////////////////////////
  defaultSortTable() {
    this.tableData.data = this.tableData.data.sort((a, b) => {
      const isAsc = 'asc';
      return this.compare(a.PhaseName, b.PhaseName, isAsc);
    })
  }

  SortFunction(sort: Sort, tData: any) {
    var data = tData.data.slice();

    var sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'PackageName': return this.compare(a.PhaseName, b.PhaseName, isAsc);
        case 'Client': return this.compare(a.gClientAcronym, b.gClientAcronym, isAsc);
        case 'Date': return this.compare(a.MailDate, b.MailDate, isAsc);
        default: return 0;
      }
    })
    this.tableData.data = sortedData;
  }

  compare(a: any, b: any, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }



  //////////////////////////// FILE UPLOAD FUNCTIONS /////////////////////
  preFileChange(element: PDFElement) {
    this.storedFileElement = element;

    if (element.HasPDF == false) {
      this.fileInput.nativeElement.click();
    } else {
      this.confirmFileOverwrite();
    }
  }

  confirmFileOverwrite() {
    this.showUpdateConfirmModal = true;
  }

  fileOverwriteConfirmed() {
    this.showUpdateConfirmModal = false;
    this.fileInput.nativeElement.click();
  }

  //File Input element for browser
  onFileChange(event: any) {
    if (event.target.files[0].type == "application/pdf") {
      const fileName = this.storedFileElement.PhaseID.toString() + ".pdf";
      this.selectedFile = <File>event.target.files[0];
      const formData = new FormData();
      formData.append('caption', this.selectedFile, fileName)
      this.http.post('https://sd360.sunrisedataservices.com/api/UpLoadPDF', formData)
        .subscribe(response => {
          if (response) {
            console.log(response);
            this.showSubmittedModal = true;
            setTimeout(() => {
              this.showSubmittedModal = false;
              this.storedFileElement.ShowControl = false;
              this.storedFileElement.HasPDF = true;
            }, 1500)
          }
        });
    } else {
      alert('Only PDFs can be uploaded');
    }
  }

  modalCancel() {
    this.showSubmittedModal = false;
    this.showUpdateConfirmModal = false;
  }



  ///////////////////// MISCELANEOUS HELPER/SUPPORT FUNCTIONS /////////////
  getAcronym(Name: string): string {
    var retString: string;
    retString = Name.substring(Name.lastIndexOf('-') + 1, Name.length).trim();
    return retString;
  }

  changeDate() {
    if (this.validateDate() == true) {
      this.loadPDFData(this.convertCLList(), this.convertDate(this.startDate), this.convertDate(this.endDate))
    } else {
      alert('Invalid Date');
    }
  }

  validateDate(): boolean {
    let tempStartDate = "";
    let tempEndDate = "";
    tempStartDate = this.startDateInput.nativeElement.value;
    tempEndDate = this.endDateInput.nativeElement.value;
    var reg = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
    if (tempStartDate.match(reg) && tempEndDate.match(reg)) {
      return true;
    } else {
      return false;
    }
  }

  convertCLList() {
    let str = "";
    if (this.CLList.length == 0) {
      str = "ALL";
    } else {
      this.CLList.forEach((element, index) => {
        if (index == 0) {
          str = element;
        } else {
          str = str + "." + element;
        }
      });
    }
    return str;
  }

  convertDate(date: string) {
    return moment(date).format("MM/DD/YYYY");
  }

  hoverRow(row: PDFElement) {
    if (row.Hidden == false && row.ShowControl == false) {
      row.ShowControl = true;
    } else if (row.Hidden == false && row.ShowControl == true) {
      row.ShowControl = false;
    }
  }

  changePDFType(value: string) {
    if (this.pdfType.includes(value)) {
      let index = this.pdfType.indexOf(value);
      this.pdfType.splice(index, 1);
    } else {
      this.pdfType.push(value);
    }
    this.checkPageState();

    if (this.tableState == 3) {
      this.tableData.data.forEach(element => {
        element.Hidden = false;
      });
    } else if (this.tableState == 1) {
      this.tableData.data.forEach(element => {
        if (element.HasPDF == true) {
          element.Hidden = false;
        } else {
          element.Hidden = true;
        }
      });
    } else if (this.tableState == 2) {
      this.tableData.data.forEach(element => {
        if (element.HasPDF == false) {
          element.Hidden = false;
        } else {
          element.Hidden = true;
        }
      });
    } else {
      this.tableData.data.forEach(element => {
        element.Hidden = true;
      });
    }
  }

  countPackages() {
    this.pdfCount = 0;
    this.noneCount = 0;
    this.bothCount = 0;

    this.tableData.data.forEach(element => {
      if (element.HasPDF == true) {
        this.pdfCount++
      } else {
        this.noneCount++
      }
    });
    this.bothCount = this.pdfCount + this.noneCount;
  }

  checkPageState() {
    //0 = No rows showing
    //1 = Rows only with PDF showing
    //2 = Rows only without PDF showing
    //3 = Everything showing

    if (this.pdfType.includes("PDF") && this.pdfType.includes("None")) {
      this.tableState = 3;
    } else if (this.pdfType.includes("PDF") && !this.pdfType.includes("None")) {
      this.tableState = 1
    } else if (this.pdfType.includes("None") && !this.pdfType.includes("PDF")) {
      this.tableState = 2;
    } else {
      this.tableState = 0;
    }
  }

}