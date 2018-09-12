
import { Component } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { LoaderService } from '../../Loader/loader.service';
import { AuthService } from '../../Services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { GroupRowInnerRenderer } from '../../group-row-inner-render/group-row-inner-render.component'

import "ag-grid-enterprise";
import { NewReturns } from '../../Models/NewReturns.model';

@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.scss']
})

export class ReturnsComponent {
  title = 'SD360-Reporting-Angular';

  private gridApi;
  private gridColumnApi;
  private rowData: NewReturns[];
  private service: AuthService;
  private activeClient;
  private selectedYear;
  private columnDefs
  private frameworkComponents;
  private groupRowInnerRenderer;
  private groupRowRendererParams;

  // private gridApi;
  // private gridColumnApi;
  // private rowData: any;
  // private service: AuthService;
  // private MailTypeRender;
  // private CampaignRender;
  // private PhaseRender;
  // private MailRender;
  // private activeClient;
  // private selectedYear;

  // private columnDefs = [
  //   { headerName: 'Client', field: 'Client', cellRenderer: "agGroupCellRenderer"},
  //   { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
  //     return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) } },
  //   { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
  //     return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //   { headerName: 'Quantity', field: 'Measure.Quantity'},
  //   { headerName: 'Donors', field: 'Measure.Donors'},
  //   { headerName: 'NonDonors', field: 'Measure.NonDonors'},
  //   { headerName: 'NewDonors', field: 'Measure.NewDonors'},
  //   { headerName: 'RSP', field: 'Measure.RSP'},
  //   { headerName: 'AVG', field: 'Measure.AVG'},
  //   { headerName: 'Gross', field: 'Measure.Gross'},
  //   { headerName: 'Cost', field: 'Measure.Cost'},
  //   { headerName: 'Net', field: 'Measure.Net'},
  //   { headerName: 'GPP', field: 'Measure.GPP'},
  //   { headerName: 'CLM', field: 'Measure.CLM'},
  //   { headerName: 'NLM', field: 'Measure.NLM'},
  //   { headerName: 'IO', field: 'Measure.IO'}
  // ];

  constructor(service: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
    this.service = service;
    route.params.subscribe(params => {
      this.activeClient = params["client"];
      this.selectedYear = params["year"];
    });
    this.columnDefs    = [
      { headerName: 'Type', field: 'MailType', width:80, hide: true, rowGroup: true },
      { headerName: 'Campaign', field: 'CampaignName', width:80, hide: true, rowGroup: true },
      { headerName: 'Phase', field: 'PhaseName', width:80, hide: true, rowGroup: true },
      { headerName: 'Code', width:100, field: 'MailCode' },
      { headerName: 'Description', width:220, field: 'MailDescription' },
      { headerName: 'Mailed', field: 'Mailed',  width:80, valueFormatter: dateFormatter },
      { headerName: 'Caged', field: 'Caged',  width:80, valueFormatter: dateFormatter },
      { headerName: 'Qty', width:70, field: 'Quantity', aggFunc: "sum", valueFormatter: quantityFormatter, cellClass: "number-cell"},
      { headerName: 'Don', width:70, field: 'Donors', aggFunc: "sum", valueFormatter: quantityFormatter, cellClass: "number-cell"},
      { headerName: 'Non', width:70, field: 'NonDonors', aggFunc: "sum", valueFormatter: quantityFormatter, cellClass: "number-cell"},
      { headerName: 'New', width:60, field: 'NewDonors', aggFunc: "sum", valueFormatter: quantityFormatter, cellClass: "number-cell"},
      { headerName: 'RSP', width:70, field: 'RSP', valueFormatter: numberFormatter, cellClass: "number-cell"},
      { headerName: 'AVG', width:70, valueFormatter: currencyFormatter, field: 'AVG', cellClass: "number-cell"},
      { headerName: 'Gross', width:100, valueFormatter: currencyFormatter, field: 'Gross', aggFunc: "sum", cellClass: "number-cell"},
      { headerName: 'Cost', width:100, valueFormatter: currencyFormatter, field: 'Cost', aggFunc: "sum", cellClass: "number-cell"},
      { headerName: 'Net', width:100, valueFormatter: currencyFormatter, field: 'Net', aggFunc: "sum", cellClass: "number-cell"},
      { headerName: 'GPP', width:60, valueFormatter: currencyFormatter, field: 'GPP', cellClass: "number-cell", 
      valueGetter: function (params) {
        if (params.data)
        {
        if (params.data.Quantity > 0)        
        return params.data.Gross /  params.data.Quantity;
        else
        return 0;
        }
        else
        return 0;
      }
    },
      { headerName: 'CLM', width:60, valueFormatter: currencyFormatter, field: 'CLM', cellClass: "number-cell"},
      { headerName: 'NLM', width:60, valueFormatter: currencyFormatter, field: 'NLM', cellClass: "number-cell"},
      { headerName: 'IO', width:60, valueFormatter: numberFormatter , field: 'IO', cellClass: "number-cell"}
    ];
  
    this.frameworkComponents = { groupRowInnerRenderer: GroupRowInnerRenderer };
    this.groupRowInnerRenderer = "GroupRowInnerRenderer";
    // this.groupRowRendererParams = {
    //   flagCodes: {
    //     Ireland: "ie",
    //     "United States": "us",
    //     Russia: "ru",
    //     Australia: "au",
    //     Canada: "ca",
    //     Norway: "no",
    //     China: "cn",
    //     Zimbabwe: "zw",
    //     Netherlands: "nl",
    //     "South Korea": "kr",
    //     Croatia: "hr",
    //     France: "fr"
    //   }
    // };
  
  }

  //   this.MailRender = {
  //     detailGridOptions: {
  //       columnDefs: [
  //         { headerName: 'Code', field: "MailCode"},
  //         { headerName: 'Description', field: "MailDescription" },
  //         { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Quantity', field: 'Measure.Quantity'},
  //         { headerName: 'Donors', field: 'Measure.Donors'},
  //         { headerName: 'NonDonors', field: 'Measure.NonDonors'},
  //         { headerName: 'NewDonors', field: 'Measure.NewDonors'},
  //         { headerName: 'RSP', field: 'Measure.RSP'},
  //         { headerName: 'AVG', field: 'Measure.AVG'},
  //         { headerName: 'Gross', field: 'Measure.Gross'},
  //         { headerName: 'Cost', field: 'Measure.Cost'},
  //         { headerName: 'Net', field: 'Measure.Net'},
  //         { headerName: 'GPP', field: 'Measure.GPP'},
  //         { headerName: 'CLM', field: 'Measure.CLM'},
  //         { headerName: 'NLM', field: 'Measure.NLM'},
  //         { headerName: 'IO', field: 'Measure.IO'}          
  //       ],
  //       enableSorting: true
  //     },    
  //     getDetailRowData: function(params) {
  //       params.successCallback(params.data.MailList);
  //     }
  //   };    

  //   this.PhaseRender = {
  //     detailGridOptions: {
  //       columnDefs: [
  //         { headerName: 'Phase', field: "PhaseName", cellRenderer: "agGroupCellRenderer" },
  //         { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Quantity', field: 'Measure.Quantity'},
  //         { headerName: 'Donors', field: 'Measure.Donors'},
  //         { headerName: 'NonDonors', field: 'Measure.NonDonors'},
  //         { headerName: 'NewDonors', field: 'Measure.NewDonors'},
  //         { headerName: 'RSP', field: 'Measure.RSP'},
  //         { headerName: 'AVG', field: 'Measure.AVG'},
  //         { headerName: 'Gross', field: 'Measure.Gross'},
  //         { headerName: 'Cost', field: 'Measure.Cost'},
  //         { headerName: 'Net', field: 'Measure.Net'},
  //         { headerName: 'GPP', field: 'Measure.GPP'},
  //         { headerName: 'CLM', field: 'Measure.CLM'},
  //         { headerName: 'NLM', field: 'Measure.NLM'},
  //         { headerName: 'IO', field: 'Measure.IO'}          
  //       ],
  //       enableSorting: true,
  //       masterDetail: true,  
  //       groupDefaultExpanded: -1, 
  //       detailCellRendererParams: this.MailRender
  //     },    
  //     getDetailRowData: function(params) {
  //       params.successCallback(params.data.PhaseList);
  //     }
  //   };

  //   this.CampaignRender = {
  //     detailGridOptions: {
  //       columnDefs: [
  //         { headerName: 'Campaign', field: "CampaignName", cellRenderer: "agGroupCellRenderer" },
  //         { headerName: 'Mailed', field: 'Measure.Mailed', cellRenderer: function(data) { return '<div _ngcontent-c4=""> Test Click...</div>' + data.value + '</b></div>'}, valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Quantity', field: 'Measure.Quantity'},
  //         { headerName: 'Donors', field: 'Measure.Donors'},
  //         { headerName: 'NonDonors', field: 'Measure.NonDonors'},
  //         { headerName: 'NewDonors', field: 'Measure.NewDonors'},
  //         { headerName: 'RSP', field: 'Measure.RSP'},
  //         { headerName: 'AVG', field: 'Measure.AVG'},
  //         { headerName: 'Gross', field: 'Measure.Gross'},
  //         { headerName: 'Cost', field: 'Measure.Cost'},
  //         { headerName: 'Net', field: 'Measure.Net'},
  //         { headerName: 'GPP', field: 'Measure.GPP'},
  //         { headerName: 'CLM', field: 'Measure.CLM'},
  //         { headerName: 'NLM', field: 'Measure.NLM'},
  //         { headerName: 'IO', field: 'Measure.IO'}          
  //       ],
  //       enableSorting: true,   
  //       masterDetail: true,     
  //       groupDefaultExpanded: -1,           
  //       detailCellRendererParams: this.PhaseRender
  //     },    
  //     getDetailRowData: function(params) {
  //       params.successCallback(params.data.CampaignList);
  //     }
  //   };

  //   this.MailTypeRender = {
  //     detailGridOptions: {
  //       columnDefs: [
  //         { headerName: 'Mail Type', field: "MailType", cellRenderer: "agGroupCellRenderer" },
  //         { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
  //           return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
  //         { headerName: 'Quantity', field: 'Measure.Quantity'},
  //         { headerName: 'Donors', field: 'Measure.Donors'},
  //         { headerName: 'NonDonors', field: 'Measure.NonDonors'},
  //         { headerName: 'NewDonors', field: 'Measure.NewDonors'},
  //         { headerName: 'RSP', field: 'Measure.RSP'},
  //         { headerName: 'AVG', field: 'Measure.AVG'},
  //         { headerName: 'Gross', field: 'Measure.Gross'},
  //         { headerName: 'Cost', field: 'Measure.Cost'},
  //         { headerName: 'Net', field: 'Measure.Net'},
  //         { headerName: 'GPP', field: 'Measure.GPP'},
  //         { headerName: 'CLM', field: 'Measure.CLM'},
  //         { headerName: 'NLM', field: 'Measure.NLM'},
  //         { headerName: 'IO', field: 'Measure.IO'}          
  //       ],
  //       enableSorting: true,   
  //       masterDetail: true, 
  //       groupDefaultExpanded: -1,     
  //       detailCellRendererParams: this.CampaignRender
  //     },    
  //     getDetailRowData: function(params) {
  //       params.successCallback(params.data.MailTypeList);
  //     }
  //   };
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.service.getNewReturns(this.activeClient, new Date("01/01/" + this.selectedYear), new Date("12/31/" + this.selectedYear)).subscribe(data => { this.rowData = data });
  }
}

  function currencyFormatter(params) {
    if(params.value)
      return "$" + params.value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "";
  }
  function numberFormatter(params) {
    if(params.value)
      return params.value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "";
  }
  function quantityFormatter(params) {
    if(params.value)
      return params.value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "";
  }

  function dateFormatter (params) {
    if (params.value)
    return params.value.substring(5,7) + '/' + params.value.substring(8,10) + '/' + params.value.substring(2,4);
    else
    return "";
  }
  // function round(value, decimals) {
  //   return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  // }

