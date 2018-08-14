import { Component, OnInit, ViewChild, ElementRef, ContentChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { delay, share } from 'rxjs/operators';
import { RootReturns } from '../Models/RootReturns';
import { MailtypeReturnsComponent } from '../mailtype-returns/mailtype-returns.component'
import 'datatables.net';
import * as $ from 'jquery';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  @ViewChild(MailtypeReturnsComponent, {read: ElementRef})
  public mailTypeChild: ElementRef;
  public RootReturns : RootReturns;
  public tableWidget: any;
  constructor(private _authService: AuthService) {     
  }

  ngOnInit() {
    $("#returnsDiv").toggle(false);
    $(".clientTable").toggle(false);
    this._authService.getReturns()
    .subscribe(data => {
      this.RootReturns = data;
      $("#returnsDiv").toggle(true);
      $(".clientTable").toggle(true);
    });  
  }

  ngAfterViewInit() {
    this.initDatatable()
  }

  private initDatatable(): void {
    let clientTable: any = $('table.clientTable');
    this.tableWidget = clientTable.DataTable({
      select: true,
      autoWidth: false,
      paging: false,
      info: false,
      searching: false,
      initComplete: function () {
      }
    });

    var el: HTMLElement = this.mailTypeChild.nativeElement;
    var childTable = el.getElementsByClassName('mailTypeTable');
     this.tableWidget.rows().every(function () {
       var tableHeader = $('.clientTableHeader');
       var tr = $(this.node());
       var row = this.row(tr);  
       row.child(childTable[0]).show();
       // tableHeader.css("visibility", "collapse");
       for (var j = 2; j < 25; j++) {
               var nodes = this.column(j).nodes();
               $(nodes[row.index()]).addClass('hideParentRow');
           }
       tr.addClass('shown');
    });
  }
}
