import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { delay, share } from 'rxjs/operators';
import { RootReturns } from '../Models/RootReturns';
import { MailtypeReturnsComponent } from '../mailtype-returns/mailtype-returns.component'
import { CampaignReturnsComponent } from '../campaign-returns/campaign-returns.component';
import 'datatables.net';
import * as $ from 'jquery';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  @ViewChildren(CampaignReturnsComponent, {read: ElementRef})
  public campaignChildren: QueryList<ElementRef>;

  @ViewChild(MailtypeReturnsComponent, { read: ElementRef })
  public mailTypeChild: ElementRef;
  
  public RootReturns: RootReturns;

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
    this.campaignChildren.forEach(function (el) {
      console.log(el.nativeElement);
  });
   this.initDatatable();
}

  private initDatatable(): void {

     let clientTable: any = $('table.clientTable');
     let mailTypeTable: any = $('table.mailTypeTable');

     var clientDataTable = clientTable.DataTable({
      select: true,
      autoWidth: false,
      paging: false,
      info: false,
      searching: false,
      initComplete: function () {
      }
    });

     var mailTypeDataTable = mailTypeTable.DataTable({
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

    clientDataTable.rows().every(function () {      // Default expand and create child rows
      var tableHeader = $('.clientTableHeader');
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

    var CampaignChildrenData = this.campaignChildren;

    mailTypeDataTable.rows().every(function () {      // Default expand and create child rows
      var tableHeader = $('.mailTypeTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      var childHTML = CampaignChildrenData.find(p => p.nativeElement.title == row.data()[1]).nativeElement.getElementsByClassName('campaignTable')[0].innerHTML;
      row.child(childHTML).show();
      tableHeader.css("visibility", "collapse");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });

     $('table.clientTable tbody').on('click', 'td.details-control', function () { // Handle expand/collapse
       var tr = $(this).closest('tr');
       var row = clientDataTable.row(tr);
       var tableHeader = $('.clientTableHeader');
       if (row.child.isShown()) {
         this.classList.remove("btn-primary")
         this.classList.add("btn-info")
         row.child.hide();
         tr.removeClass('shown');
         tableHeader.css("visibility", "initial");
         for (var i = 2; i < 25; i++) {
           var nodes = row.column(i).nodes();
           $(nodes[row.index()]).removeClass('hideParentRow');
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
           $(nodes[row.index()]).addClass('hideParentRow');
         }
       }
     });

     $('table.mailTypeTable tbody').on('click', 'td.details-control', function () { // Handle expand/collapse
      var tr = $(this).closest('tr');
      var row = mailTypeDataTable.row(tr);
      //var tableHeader = $('.clientTableHeader');
      if (row.child.isShown()) {
        this.classList.remove("btn-primary")
        this.classList.add("btn-info")
        row.child.hide();
        tr.removeClass('shown');
        //tableHeader.css("visibility", "initial");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[row.index()]).removeClass('hideParentRow');
        }
      }
      else {
        this.classList.remove("btn-info")
        this.classList.add("btn-primary")
        row.child.show('<p> TEST TEST TEST </p>');
        tr.addClass('shown');
        //tableHeader.css("visibility", "collapse");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[row.index()]).addClass('hideParentRow');
        }
      }
    });
  }
}
