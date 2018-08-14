import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild(MailtypeReturnsComponent, { read: ElementRef })
  public mailTypeChild: ElementRef;
  public RootReturns: RootReturns;
  //public tableWidget: any;
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
    var tableWidget: any;

    tableWidget = clientTable.DataTable({
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
    
    tableWidget.rows().every(function () {
      var tableHeader = $('.clientTableHeader');
      var tableFooter = $('.clientTableFooter');
      var tr = $(this.node());
      var row = this.row(tr);
      row.child(childTable[0]).show();
      tableHeader.css("visibility", "collapse");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });


     $('table.clientTable tbody').on('click', 'td.details-control', function () {
       var tr = $(this).closest('tr');
       var row = tableWidget.row(tr);
       var tableHeader = $('.clientTableHeader');
       if (row.child.isShown()) {
         this.classList.remove("btn-primary")
         this.classList.add("btn-info")
         //$('div.slider', row.child()).slideUp(function () {
           row.child.hide();
           tr.removeClass('shown');
           tableHeader.css("visibility", "initial");
         //});
         for (var i = 2; i < 25; i++) {
           var nodes = row.column(i).nodes();
           $(nodes[0]).removeClass('hideParentRow');
         }
       }
       else {
         this.classList.remove("btn-info")
         this.classList.add("btn-primary")
         row.child.show();
         tr.addClass('shown');
         tableHeader.css("visibility", "collapse");
         for (var i = 2; i < 25; i++) {
           var nodes = row.column(i).nodes();
           $(nodes[0]).addClass('hideParentRow');
         }
         //$('div.slider', row.child()).slideDown();
       }
     });
  }
}
