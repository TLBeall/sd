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
import { element } from 'protractor';
import { CompileMetadataResolver } from '@angular/compiler';


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


  private packageCount = 0;
  public loading: boolean = true;
  private startDate: any;
  private endDate: any;
  private tableData: PDFElement[];
  private dataSource;
  private pdfType: string[];
  private fileUrl: string;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;


  MainDisplayedColumns: string[] = ['PackageName', 'Client', 'Date', 'Description', 'Link', 'ButtonControl'];
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private _authService: AuthService) { }

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



  loadPDFData(clients: string, start: string, end: string) {
    this.loading = true;
    this.pdfType = ["PDF", "None"];
    this._authService.getPDFList(clients, start, end).subscribe(data => {
      this.tableData = data;
      this.tableData.forEach(element => {
        element.Hidden = false;
        element.ShowControl = false;
      });
      this.defaultSortTable();
      this.loading = false;
      this.countPackages();
    });
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
      this.loadPDFData(this.convertCLList(), this.convertDate(this.startDate), this.convertDate(this.endDate))
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

  defaultSortTable() {
    this.tableData = this.tableData.sort((a, b) => {
      const isAsc = 'asc';
      return this.compare(a.PhaseName, b.PhaseName, isAsc);
    })
  }

  SortFunction(sort: Sort, tData: PDFElement[]) {
    var data = tData.slice();

    var sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'PackageName': return this.compare(a.PhaseName, b.PhaseName, isAsc);
        case 'Client': return this.compare(a.gClientAcronym, b.gClientAcronym, isAsc);
        case 'Date': return this.compare(a.MailDate, b.MailDate, isAsc);
        default: return 0;
      }
    })

    this.tableData = sortedData;
  }

  compare(a: any, b: any, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  changePDFType(value: string) {
    if (this.pdfType.includes(value)) {
      let index = this.pdfType.indexOf(value);
      this.pdfType.splice(index, 1);
    } else {
      this.pdfType.push(value);
    }

    if (this.pdfType.includes("PDF") && this.pdfType.includes("None")) {
      this.tableData.forEach(element => {
        element.Hidden = false;
      });
    } else if (this.pdfType.includes("PDF")) {
      this.tableData.forEach(element => {
        if (element.HasPDF == true) {
          element.Hidden = false;
        } else {
          element.Hidden = true;
        }
      });
    } else if (this.pdfType.includes("None")) {
      this.tableData.forEach(element => {
        if (element.HasPDF == false) {
          element.Hidden = false;
        } else {
          element.Hidden = true;
        }
      });
    } else {
      this.tableData.forEach(element => {
        element.Hidden = true;
      });
    }

    this.countPackages();
  }

  hoverRow(row: PDFElement) {
    if (row.Hidden == false && row.ShowControl == false) {
      row.ShowControl = true;
    } else if (row.Hidden == false && row.ShowControl == true) {
      row.ShowControl = false;
    }
  }

  countPackages(){
    this.packageCount = 0;

    if (this.pdfType.includes("PDF") && this.pdfType.includes("None")) {
      this.tableData.forEach(element => {
        this.packageCount++;
      });
    } else if (this.pdfType.includes("PDF")) {
      this.tableData.forEach(element => {
        if (element.HasPDF == true) {
          this.packageCount++;
        }
      });
    } else if (this.pdfType.includes("None")) {
      this.tableData.forEach(element => {
        if (element.HasPDF == false) {
          this.packageCount++
        }
      });
    } else {
      this.packageCount = 0;
    }

  }


  /* File Input element for browser */
  onFileChange(evt: any) {
    this.fileUrl = evt.target.files[0].name;
    var test = 0;
  }

  // resetFile(){
  //   this.fileUrl = "";
  //   this.fileInput.nativeElement.value = null;
  // }

}
