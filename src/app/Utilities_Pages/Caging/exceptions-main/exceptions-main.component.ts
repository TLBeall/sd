import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { startWith, map } from 'rxjs/operators';
import { ExceptionAggregate } from 'src/app/Models/ExceptionAggregate.model';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ExceptionElement } from 'src/app/Models/ExceptionElement.model';
import { GlobalService } from 'src/app/Services/global.service';


@Component({
  selector: 'app-exceptions-main',
  templateUrl: './exceptions-main.component.html',
  styleUrls: ['./exceptions-main.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class ExceptionsMainComponent implements OnInit {

  public rawData: any;
  public exceptionsAggregate: ExceptionAggregate[];
  public tableLoading: boolean = true;
  public allInstancesExpanded: boolean = false;
  public selectionMode: boolean = false;
  public showExceptionBlank = false;


  public InstanceColumns: string[];
  public MailcodeColumns: string[];

  constructor(public route: ActivatedRoute, public router: Router, public _authService: AuthService, public _g: GlobalService) { }

  ngOnInit() {
    this.InstanceColumns = ['ExpandParent', 'PsuedoSelection', 'Instance', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlParent'];
    this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlChild'];

    this._authService.getDailiesExceptions().subscribe(data => {
      if (data.length > 0) {
        this.showExceptionBlank = false;
        this.exceptionsAggregate = data;
        this.exceptionsAggregate.forEach(a => {
          a.Expanded = false;
          a.showControl = false;
          a.ExceptionList.forEach(b => {
            b.showControl = false;
          });
          this.tableLoading = false;
        });
      } else {
        this.tableLoading = false;
        this.showExceptionBlank = true;
      }
    })

  }

  ToggleExpansion(element: ExceptionAggregate) {
    if (element.Expanded == true) {
      element.Expanded = false;
    } else {
      element.Expanded = true;
    }
    this.checkClientExpansion();
    if (element.Expanded == true) {
      element.showControl = true;
    } else {
      element.showControl = false;
    }
  }

  checkClientExpansion() {
    var numberExpanded = 0;
    this.exceptionsAggregate.forEach(element => {
      if (element.Expanded) {
        numberExpanded++;
      }
    });
    if (numberExpanded > 0) {
      this.allInstancesExpanded = true;
      this.InstanceColumns = ['ExpandParent', 'PsuedoSelection', 'PseudoDate', 'Instance', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlParent'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Date', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlChild'];
    } else {
      this.allInstancesExpanded = false;
      this.InstanceColumns = ['ExpandParent', 'PsuedoSelection', 'Instance', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlParent'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlChild'];
    }
  }

  expandAllInstance() {
    if (this.allInstancesExpanded == false) {
      this.allInstancesExpanded = true;
      this.InstanceColumns = ['ExpandParent', 'PsuedoSelection', 'PseudoDate', 'Instance', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlParent'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Date', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlChild'];
      this.exceptionsAggregate.forEach(element => {
        element.Expanded = true;
        element.showControl = true;
      });
    } else {
      this.allInstancesExpanded = false;
      this.InstanceColumns = ['ExpandParent', 'PsuedoSelection', 'Instance', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlParent'];
      this.MailcodeColumns = ['ExpandChild', 'SelectionBox', 'Mailcode', 'NonDonors', 'CashDonors', 'CashGross', 'CardDonors', 'CardGross', 'CheckDonors', 'CheckGross', 'ControlChild'];
      this.exceptionsAggregate.forEach(element => {
        element.Expanded = false;
        element.showControl = false;
      });
    }
  }

  hoverParentOn(row: ExceptionAggregate) {
    row.showControl = true;
  }

  hoverParentOff(row: ExceptionAggregate) {
    row.showControl = false;
    if (row.Expanded == true) {
      row.showControl = true;
    }
  }

  hoverRowChild(row: ExceptionElement) {
    row.showControl = !row.showControl;
  }

  navigateToEditInstance(element: ExceptionAggregate) {
    this._g.exceptionElem = null;

    var idString = "";
    element.ExceptionList.forEach((a, index) => {
      if (index == 0) {
        idString = a.ID.toString();
      } else {
        idString = idString + "." + a.ID.toString();
      }
    });
    this._g.exceptionInstanceElem = element;
    this.router.navigate(['exceptions/edit/' + idString]);
    // element.showControl = false;
  }

  navigateToEditMailcode(element: ExceptionElement) {
    this._g.exceptionInstanceElem = null;
    this._g.exceptionElem = element;
    this.router.navigate(['exceptions/edit/' + element.ID]);
    // element.showEditButton = false;
  }

}
