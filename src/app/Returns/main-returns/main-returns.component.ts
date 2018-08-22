import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { delay, share } from 'rxjs/operators';
import { RootReturns } from '../../Models/RootReturns.model';
import { MailtypeReturnsComponent } from '../mailtype-returns/mailtype-returns.component'
import { CampaignReturnsComponent } from '../campaign-returns/campaign-returns.component';
import 'datatables.net';
import * as $ from 'jquery';
import { PhaseReturnsComponent } from '../phase-returns/phase-returns.component';
import { MaillistReturnsComponent } from '../maillist-returns/maillist-returns.component';
import { ChildElement } from '../../Models/childElement.model';
import {ActivatedRoute} from "@angular/router";
import { LoaderService } from '../../Loader/loader.service';

@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.css']
})

export class ReturnsComponent implements OnInit {

  // Capturing child components MailType, Campaign, Phase, Mailist

  @ViewChildren(MaillistReturnsComponent, { read: ElementRef })
  public maillistChildren: QueryList<ElementRef>;
  public maillistArr: ChildElement[] = []; // title, className, innerHTML

  @ViewChildren(PhaseReturnsComponent, { read: ElementRef })
  public phaseChildren: QueryList<ElementRef>;
  public phaseArr: ChildElement[] = [];

  @ViewChildren(CampaignReturnsComponent, { read: ElementRef })
  public campaignChildren: QueryList<ElementRef>;
  public campaignArr: ChildElement[] = [];

  @ViewChild(MailtypeReturnsComponent, { read: ElementRef })
  public mailTypeChild: ElementRef;
  public mailTypeArr: ChildElement[] = [];

  public clientDataTable: any;
  public mailTypeDataTable: any;
  public campaignDataTable: any;
  public phaseDataTable: any;
  public dataAvailable: boolean = false;

  public RootReturns: RootReturns;

  public activeClient: string;

  constructor(private _authService: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
    route.params.subscribe( params => this.activeClient = params["id"] );
    //loading panel
    this.loaderService.display(true);
  }

  // API Call

  ngOnInit() {
    $(".clientTable").toggle(false);
    this._authService.getReturns(this.activeClient, new Date("01/01/2018"), new Date("12/31/2018"))
      .subscribe(data => {
        this.RootReturns = data;
        $(".clientTable").toggle(true);
        //loading panel
        this.loaderService.display(false);
      });
    }

  ngAfterViewInit() {
    this.PrepArrays();
    this.GeneratePage();

  }

  // Expand All, iterating through all tables

  ExpandAll() {
    this.clientDataTable.rows().every(function () {      // Default expand single client row and create child row
      var tableHeader = $('.clientTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      row.child.show();
      tableHeader.css("visibility", "hidden");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });

    for (var mailTypeIdx = 0; mailTypeIdx < $('table.mailTypeTable').length; mailTypeIdx++) { // multiple campaign tables
      this.mailTypeDataTable.tables(mailTypeIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.mailTypeTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        row.child.show();
        tableHeader.css("visibility", "collapse");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).addClass('hideParentRow');
        }
        tr.addClass('shown');
      });
    }

    for (var campaignIdx = 0; campaignIdx < $('table.campaignTable').length; campaignIdx++) { // multiple campaign tables
      this.campaignDataTable.tables(campaignIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.campaignTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        row.child.show();
        tableHeader.css("visibility", "collapse");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).addClass('hideParentRow');
        }
        tr.addClass('shown');
      });
    }

    for (var phaseIdx = 0; phaseIdx < $('table.phaseTable').length; phaseIdx++) { // multiple campaign tables
      this.phaseDataTable.tables(phaseIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.phaseTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        row.child.show();
        tableHeader.css("visibility", "collapse");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).addClass('hideParentRow');
        }
        tr.addClass('shown');
      });
    }
  }

  // Collapse all, iterating through all tables

  CollapseAll() {

    for (var phaseIdx = 0; phaseIdx < $('table.phaseTable').length; phaseIdx++) { // multiple campaign tables
      this.phaseDataTable.tables(phaseIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.phaseTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        row.child.hide();
        tableHeader.css("visibility", "initial");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).removeClass('hideParentRow');
        }
        tr.removeClass('shown');
      });
    }

    for (var campaignIdx = 0; campaignIdx < $('table.campaignTable').length; campaignIdx++) { // multiple campaign tables
      this.campaignDataTable.tables(campaignIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.campaignTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        row.child.hide();
        tableHeader.css("visibility", "initial");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).removeClass('hideParentRow');
        }
        tr.removeClass('shown');
      });
    }

    for (var mailTypeIdx = 0; mailTypeIdx < $('table.mailTypeTable').length; mailTypeIdx++) { // multiple campaign tables
      this.mailTypeDataTable.tables(mailTypeIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.mailTypeTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        row.child.hide();
        tableHeader.css("visibility", "initial");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).removeClass('hideParentRow');
        }
        tr.removeClass('shown');
      });
    }

    this.clientDataTable.rows().every(function () {      // Default expand single client row and create child row
      var tableHeader = $('.clientTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      row.child.hide();
      tableHeader.css("visibility", "initial");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).removeClass('hideParentRow');
      }
      tr.removeClass('shown');
    });

  }

  // Storing all descendants (child components) in array

  private PrepArrays(): void {
    var MailTypeChild = this.mailTypeChild;
    this.mailTypeArr.push({ 'title': MailTypeChild.nativeElement.title, 'innerHTML': MailTypeChild.nativeElement.getElementsByClassName('mailtypediv')[0].innerHTML });

    var CampaignChildrenData = this.campaignChildren;
    CampaignChildrenData.forEach(p => {
      this.campaignArr.push({ 'title': p.nativeElement.title, 'innerHTML': p.nativeElement.getElementsByClassName('campaigndiv')[0].innerHTML });
    });

    var PhaseChildrenData = this.phaseChildren;
    PhaseChildrenData.forEach(p => {
      this.phaseArr.push({ 'title': p.nativeElement.title, 'innerHTML': p.nativeElement.getElementsByClassName('phasediv')[0].innerHTML });
    });

    var MailListChildrenData = this.maillistChildren;
    MailListChildrenData.forEach(p => {
      this.maillistArr.push({ 'title': p.nativeElement.title, 'innerHTML': p.nativeElement.getElementsByClassName('maillistdiv')[0].innerHTML });
    });

    var id = this.campaignArr.findIndex(p => p.title == "House");
  }

  // Main function to generate all page

  private GeneratePage(): void {
    let clientTable: any = $('table.clientTable');

    this.clientDataTable = clientTable.DataTable({
      "columnDefs": [
        { targets: 0, width: 20},
        { targets: 1, className: "clientColumn"},
        //skip to keep the width flexible on the description column
        {
            targets: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], className: "tableSmallColumns"
        },
    ],
      "select": true,
      "autoWidth": false,
      "paging": false,
      "info": false,
      "searching": false,
      "ordering": true,
      initComplete: function () {
      }
    });

    $("table.mailTypeTable").remove();
    $("table.campaignTable").remove();
    $("table.phaseTable").remove();
    $("table.maillistTable").remove();

    var mailTypeArr = this.mailTypeArr;
    this.clientDataTable.rows().every(function () {      // Default expand single client row and create child row
      var tableHeader = $('.clientTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      var id = mailTypeArr.findIndex(p => p.title == row.data()[1]);
      var childHTML = mailTypeArr[id].innerHTML;
      row.child(childHTML).show();
      tableHeader.css("visibility", "hidden");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });

    let mailTypeTable: any = $('table.mailTypeTable');

    this.mailTypeDataTable = mailTypeTable.DataTable({
      "columnDefs": [
        { targets: 0, width: 20},
        { targets: 1, className: "mailTypeColumn"},
        //skip to keep the width flexible on the description column
        {
            targets: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], className: "tableSmallColumns"
        },
    ],
      "select": true,
      "autoWidth": false,
      "paging": false,
      "info": false,
      "searching": false,
      "ordering": true,
      initComplete: function () {
      }
    });

    var CampaignArr = this.campaignArr;

    this.mailTypeDataTable.rows().every(function () {      // Default expand and create child rows
      var tableHeader = $('.mailTypeTableHeader');
      var tr = $(this.node());
      var row = this.row(tr);
      var id = CampaignArr.findIndex(p => p.title == row.data()[1]);
      var childHTML = CampaignArr[id].innerHTML;
      row.child(childHTML).show();
      tableHeader.css("visibility", "collapse");
      for (var j = 2; j < 25; j++) {
        var nodes = this.column(j).nodes();
        $(nodes[row.index()]).addClass('hideParentRow');
      }
      tr.addClass('shown');
    });

    let campaignTable: any = $('table.campaignTable');

    this.campaignDataTable = campaignTable.DataTable({
      "columnDefs": [
        { targets: 0, width: 20},
        { targets: 1, className: "campaignColumn"},
        //skip to keep the width flexible on the description column
        {
            targets: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], className: "tableSmallColumns"
        },
    ],
      "select": true,
      "autoWidth": false,
      "paging": false,
      "info": false,
      "searching": false,
      "ordering": true,
      initComplete: function () {
      }
    });

    var PhaseArr = this.phaseArr;

    for (var campaignIdx = 0; campaignIdx < $('table.campaignTable').length; campaignIdx++) { // multiple campaign tables
      this.campaignDataTable.tables(campaignIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.campaignTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        var id = PhaseArr.findIndex(p => p.title == row.data()[1]);
        var childHTML = PhaseArr[id].innerHTML;
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

    this.phaseDataTable = phaseTable.DataTable({
      "columnDefs": [
        { targets: 0, width: 20},
        { targets: 1, className: "phaseColumn"},
        //skip to keep the width flexible on the description column
        {
            targets: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], className: "tableSmallColumns"
        },
    ],
      "select": true,
      "autoWidth": false,
      "paging": false,
      "info": false,
      "searching": false,
      "ordering": true,
      initComplete: function () {
      }
    });

    var maillistArr = this.maillistArr;

    for (var phaseIdx = 0; phaseIdx < $('table.phaseTable').length; phaseIdx++) { // multiple campaign tables
      this.phaseDataTable.tables(phaseIdx).rows().every(function () {      // Default expand and create child rows
        var tableHeader = $('.phaseTableHeader');
        var tr = $(this.node());
        var row = this.row(tr);
        var id = maillistArr.findIndex(p => p.title == row.data()[1]);
        var childHTML = maillistArr[id].innerHTML;
        row.child(childHTML).show();
        tableHeader.css("visibility", "collapse");
        for (var j = 2; j < 25; j++) {
          var nodes = this.column(j).nodes();
          $(nodes[row.index()]).addClass('hideParentRow');
        }
        tr.addClass('shown');
      });
    }

    let maillistTable: any = $('table.maillistTable');

    maillistTable.DataTable({
        "columnDefs": [
          { targets: 0, width: 20},
          { targets: 1, className: "mailcodeColumn"},
          { targets: 2, width: 8},
          //skip to keep the width flexible on the description column
          { targets: 4, className: "listTypeColumn"},
          {
              targets: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], className: "tableSmallColumns"
          },
      ],
      "select": true,
      "autoWidth": false,
      "paging": false,
      "info": false,
      "searching": false,
      "ordering": true,
      initComplete: function () {
      }
    });

    var clientDataTable = this.clientDataTable;
    $('table.clientTable tbody').on('click', 'td.details-control', function () { // Handle expand/collapse
      var tr = $(this).closest('tr');
      var row = clientDataTable.row(tr);
      var tableHeader = $('.clientTableHeader');
      if (row.child.isShown()) {
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
        row.child.show();
        tr.addClass('shown');
        tableHeader.css("visibility", "hidden");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[row.index()]).addClass('hideParentRow');
        }
      }
    });

    var mailTypeDataTable = this.mailTypeDataTable;
    $('table.mailTypeTable tbody').on('click', 'td.mdetails-control', function () { // Handle expand/collapse
      var tr = $(this).closest('tr');
      var row = mailTypeDataTable.row(tr);
      var tableHeader = $('.mailTypeTableHeader');
      var mailType = row.data()[1];
      var index = 0;
      for (var idx = 0; idx < row.column(i).nodes().length; idx++) {
        if (row.column(1).nodes()[idx].innerHTML == mailType) {
          index = idx;
          break;
        }
      }

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
        if (row.index() == 0)
          tableHeader.css("visibility", "initial");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[index]).removeClass('hideParentRow');
        }
      }
      else {
        row.child.show();
        tr.addClass('shown');
        tableHeader.css("visibility", "collapse");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[index]).addClass('hideParentRow');
        }
      }
    });

    var campaignDataTable = this.campaignDataTable;
    $('table.campaignTable tbody').on('click', 'td.cdetails-control', function () { // Handle expand/collapse
      var tr = $(this).closest('tr');
      var row = campaignDataTable.tables().row(tr);
      var tableHeader = $('.campaignTableHeader');

      var campaign = row.data()[1];
      var index = 0;
      for (var idx = 0; idx < row.column(i).nodes().length; idx++) {
        if (row.column(1).nodes()[idx].innerHTML == campaign) {
          index = idx;
          break;
        }
      }

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
        if (row.index() == 0)
          tableHeader.css("visibility", "initial");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[index]).removeClass('hideParentRow');
        }
      }
      else {
        row.child.show();
        tr.addClass('shown');
        tableHeader.css("visibility", "collapse");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[index]).addClass('hideParentRow');
        }
      }
    });

    var phaseDataTable = this.phaseDataTable;
    $('table.phaseTable tbody').on('click', 'td.pdetails-control', function () { // Handle expand/collapse
      var tr = $(this).closest('tr');
      var row = phaseDataTable.tables().row(tr);
      var tableHeader = $('.phaseTableHeader');

      var phase = row.data()[1];
      var index = 0;
      for (var idx = 0; idx < row.column(i).nodes().length; idx++) {
        if (row.column(1).nodes()[idx].innerHTML == phase) {
          index = idx;
          break;
        }
      }

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
        if (row.index() == 0)
          tableHeader.css("visibility", "initial");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[index]).removeClass('hideParentRow');
        }
      }
      else {
        row.child.show();
        tr.addClass('shown');
        tableHeader.css("visibility", "collapse");
        for (var i = 2; i < 25; i++) {
          var nodes = row.column(i).nodes();
          $(nodes[index]).addClass('hideParentRow');
        }
      }
    });

  }

}
