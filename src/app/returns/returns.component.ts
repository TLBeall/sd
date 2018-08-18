import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { delay, share } from 'rxjs/operators';
import { RootReturns } from '../Models/RootReturns';
import { MailtypeReturnsComponent } from '../mailtype-returns/mailtype-returns.component'
import { CampaignReturnsComponent } from '../campaign-returns/campaign-returns.component';
import 'datatables.net';
import * as $ from 'jquery';
import { PhaseReturnsComponent } from '../phase-returns/phase-returns.component';
import { MaillistReturnsComponent } from '../maillist-returns/maillist-returns.component';
import { ChildElement } from 'src/app/Models/childElement';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})

export class ReturnsComponent implements OnInit {

  
  
  @ViewChildren(MaillistReturnsComponent, {read: ElementRef})
  public maillistChildren: QueryList<ElementRef>;
  public maillistArr: ChildElement[] = []; // title, className, innerHTML

  @ViewChildren(PhaseReturnsComponent, {read: ElementRef})
  public phaseChildren: QueryList<ElementRef>;
  public phaseArr: ChildElement[] = [];

  @ViewChildren(CampaignReturnsComponent, {read: ElementRef})
  public campaignChildren: QueryList<ElementRef>;
  public campaignArr: ChildElement[] = [];

  @ViewChild(MailtypeReturnsComponent, { read: ElementRef })
  public mailTypeChild: ElementRef;
  public mailTypeArr: ChildElement[] = [];
  
  public RootReturns: RootReturns;

  constructor(private _authService: AuthService) {
  }

  ngOnInit() {
    $(".clientTable").toggle(false);
    this._authService.getReturns()
      .subscribe(data => {
        this.RootReturns = data;
        $(".clientTable").toggle(true);
          });
  }

  ngAfterViewInit() {
  this.PrepArrays();
  this.GeneratePage();
}

private PrepArrays(): void {
  var MailTypeChild = this.mailTypeChild;
  this.mailTypeArr.push({'title': MailTypeChild.nativeElement.title, 'className': MailTypeChild.nativeElement.getElementsByClassName('mailTypeTable')[0].className,  'innerHTML' : MailTypeChild.nativeElement.getElementsByClassName('mailTypeTable')[0].innerHTML});

  var CampaignChildrenData = this.campaignChildren;
  CampaignChildrenData.forEach(p => {
    this.campaignArr.push({'title': p.nativeElement.title, 'className': p.nativeElement.getElementsByClassName('campaignTable')[0].className,  'innerHTML' : p.nativeElement.getElementsByClassName('campaignTable')[0].innerHTML});
  });

  var PhaseChildrenData = this.phaseChildren;
  PhaseChildrenData.forEach(p => {
    this.phaseArr.push({'title': p.nativeElement.title, 'className': p.nativeElement.getElementsByClassName('phaseTable')[0].className,  'innerHTML' : p.nativeElement.getElementsByClassName('phaseTable')[0].innerHTML});
  });

  var MailListChildrenData = this.maillistChildren;
  MailListChildrenData.forEach(p => {
    this.maillistArr.push({'title': p.nativeElement.title, 'className': p.nativeElement.getElementsByClassName('maillistTable')[0].className,  'innerHTML' : p.nativeElement.getElementsByClassName('maillistTable')[0].innerHTML});
  });

   var id = this.campaignArr.findIndex(p => p.title == "House");
}

private GeneratePage(): void {
  let clientTable: any = $('table.clientTable');

  var clientDataTable = clientTable.DataTable({
   select: true,
   autoWidth: false,
   paging: false,
   info: false,
   searching: false,
   initComplete: function () {
   }
 });



   $("table.mailTypeTable").remove();
   $("table.campaignTable").remove();
   $("table.phaseTable").remove();
   $("table.maillistTable").remove();

   var mailTypeArr = this.mailTypeArr;
   clientDataTable.rows().every(function () {      // Default expand single client row and create child row
    var tableHeader = $('.clientTableHeader');
    var tr = $(this.node());
    var row = this.row(tr);
    var id = mailTypeArr.findIndex(p => p.title == row.data()[1]);
    var childHTML = '<table class="'+ mailTypeArr[id].className +'">' + mailTypeArr[id].innerHTML + '</table>'; 
    row.child(childHTML).show();
    tableHeader.css("visibility", "collapse");
    for (var j = 2; j < 25; j++) {
      var nodes = this.column(j).nodes();
      $(nodes[row.index()]).addClass('hideParentRow');
    }
    tr.addClass('shown');
  });

  let mailTypeTable: any = $('table.mailTypeTable');

  var mailTypeDataTable = mailTypeTable.DataTable({
     select: true,
     autoWidth: false,
     paging: false,
     info: false,
     searching: false,
     initComplete: function () {
     }
   });

  var CampaignArr = this.campaignArr;

   mailTypeDataTable.rows().every(function () {      // Default expand and create child rows
    var tableHeader = $('.mailTypeTableHeader');
    var tr = $(this.node());
    var row = this.row(tr);
    var id = CampaignArr.findIndex(p => p.title == row.data()[1]);
    var childHTML = '<table class="'+ CampaignArr[id].className +'">' + CampaignArr[id].innerHTML + '</table>'; 
    row.child(childHTML).show();
    tableHeader.css("visibility", "collapse");
    for (var j = 2; j < 25; j++) {
      var nodes = this.column(j).nodes();
      $(nodes[row.index()]).addClass('hideParentRow');
    }
    tr.addClass('shown');
  });

  let campaignTable: any = $('table.campaignTable');

   var campaignDataTable = campaignTable.DataTable({
     select: true,
     autoWidth: false,
     paging: false,
     info: false,
     searching: false,
     initComplete: function () {
     }
   });

   var PhaseArr = this.phaseArr;

   for (var campaignIdx = 0; campaignIdx < $('table.campaignTable').length; campaignIdx++) { // multiple campaign tables
    campaignDataTable.tables(campaignIdx).rows().every(function () {      // Default expand and create child rows
      var tableHeader = $('.campaignTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      var id = PhaseArr.findIndex(p => p.title == row.data()[1]);
      var childHTML = '<table class="'+ PhaseArr[id].className +'">' + PhaseArr[id].innerHTML + '</table>'; 
      row.child(childHTML).show();
      tableHeader.css("visibility", "collapse");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });
  }

  let phaseTable: any = $('table.phaseTable');

  var phaseDataTable = phaseTable.DataTable({
    select: true,
    autoWidth: false,
    paging: false,
    info: false,
    searching: false,
    initComplete: function () {
    }
  });

  var maillistArr = this.maillistArr;

  for (var phaseIdx = 0; phaseIdx < $('table.phaseTable').length; phaseIdx++) { // multiple campaign tables
    phaseDataTable.tables(phaseIdx).rows().every(function () {      // Default expand and create child rows
      var tableHeader = $('.phaseTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      var id = maillistArr.findIndex(p => p.title == row.data()[1]);
      var childHTML = '<table class="'+ maillistArr[id].className +'">' + maillistArr[id].innerHTML + '</table>'; 
      row.child(childHTML).show();
      tableHeader.css("visibility", "collapse");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });
  }

  $('table.clientTable tbody').on('click', 'td.details-control', function () { // Handle expand/collapse
    var tr = $(this).closest('tr');
    var row = clientDataTable.row(tr);
    var tableHeader = $('.clientTableHeader');
    if (row.child.isShown()) {
      this.classList.remove("btn-primary")
      this.classList.add("btn-info")
      row.child.hide();
      tr.removeClass('shown');
      if (row.index() == 0)
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

  $('table.mailTypeTable tbody').on('click', 'td.mdetails-control', function () { // Handle expand/collapse
   var tr = $(this).closest('tr');
   var row = mailTypeDataTable.row(tr);
   var tableHeader = $('.mailTypeTableHeader');
   if (row.child.isShown()) {
     this.classList.remove("btn-primary")
     this.classList.add("btn-info")
     row.child.hide();
     tr.removeClass('shown');
     if (row.index() == 0)
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

 $('table.campaignTable tbody').on('click', 'td.cdetails-control', function () { // Handle expand/collapse
   var tr = $(this).closest('tr');
   var row = campaignDataTable.tables().row(tr);
   var tableHeader = $('.campaignTableHeader');
   if (row.child.isShown()) {
     this.classList.remove("btn-primary")
     this.classList.add("btn-info")
     row.child.hide();
     $(tr).removeClass('shown');
     if (row.index() == 0)
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

 $('table.phaseTable tbody').on('click', 'td.pdetails-control', function () { // Handle expand/collapse
  var tr = $(this).closest('tr');
  var row = phaseDataTable.tables().row(tr);
  var tableHeader = $('.phaseTableHeader');
  if (row.child.isShown()) {
    this.classList.remove("btn-primary")
    this.classList.add("btn-info")
    row.child.hide();
    $(tr).removeClass('shown');
    if (row.index() == 0)
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

}

}
