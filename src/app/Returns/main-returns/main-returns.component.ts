
import { Component } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { LoaderService } from '../../Loader/loader.service';
import { AuthService } from '../../Services/auth.service';
import {ActivatedRoute} from "@angular/router";

import "ag-grid-enterprise";

@Component({
  selector: 'app-main-returns',
  templateUrl: './main-returns.component.html',
  styleUrls: ['./main-returns.component.scss']
})

export class ReturnsComponent  {
  title = 'SD360-Reporting-Angular';

  private gridApi;
  private gridColumnApi;
  private rowData: any;
  private service: AuthService;
  private MailTypeRender;
  private CampaignRender;
  private PhaseRender;
  private MailRender;
  private activeClient;
  private selectedYear;

  private columnDefs = [
    { headerName: 'Client', field: 'Client', cellRenderer: "agGroupCellRenderer"},
    { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
      return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) } },
    { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
      return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
    { headerName: 'Quantity', field: 'Measure.Quantity'},
    { headerName: 'Donors', field: 'Measure.Donors'},
    { headerName: 'NonDonors', field: 'Measure.NonDonors'},
    { headerName: 'NewDonors', field: 'Measure.NewDonors'},
    { headerName: 'RSP', field: 'Measure.RSP'},
    { headerName: 'AVG', field: 'Measure.AVG'},
    { headerName: 'Gross', field: 'Measure.Gross'},
    { headerName: 'Cost', field: 'Measure.Cost'},
    { headerName: 'Net', field: 'Measure.Net'},
    { headerName: 'GPP', field: 'Measure.GPP'},
    { headerName: 'CLM', field: 'Measure.CLM'},
    { headerName: 'NLM', field: 'Measure.NLM'},
    { headerName: 'IO', field: 'Measure.IO'}
  ];

  constructor(service: AuthService, route: ActivatedRoute, private loaderService: LoaderService) {
    this.service = service;
    route.params.subscribe( params => { 
      this.activeClient = params["client"]; 
      this.selectedYear = params["year"];
    });

    this.MailRender = {
      detailGridOptions: {
        columnDefs: [
          { headerName: 'Code', field: "MailCode"},
          { headerName: 'Description', field: "MailDescription" },
          { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Quantity', field: 'Measure.Quantity'},
          { headerName: 'Donors', field: 'Measure.Donors'},
          { headerName: 'NonDonors', field: 'Measure.NonDonors'},
          { headerName: 'NewDonors', field: 'Measure.NewDonors'},
          { headerName: 'RSP', field: 'Measure.RSP'},
          { headerName: 'AVG', field: 'Measure.AVG'},
          { headerName: 'Gross', field: 'Measure.Gross'},
          { headerName: 'Cost', field: 'Measure.Cost'},
          { headerName: 'Net', field: 'Measure.Net'},
          { headerName: 'GPP', field: 'Measure.GPP'},
          { headerName: 'CLM', field: 'Measure.CLM'},
          { headerName: 'NLM', field: 'Measure.NLM'},
          { headerName: 'IO', field: 'Measure.IO'}          
        ],
        enableSorting: true
      },    
      getDetailRowData: function(params) {
        params.successCallback(params.data.MailList);
      }
    };    

    this.PhaseRender = {
      detailGridOptions: {
        columnDefs: [
          { headerName: 'Phase', field: "PhaseName", cellRenderer: "agGroupCellRenderer" },
          { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Quantity', field: 'Measure.Quantity'},
          { headerName: 'Donors', field: 'Measure.Donors'},
          { headerName: 'NonDonors', field: 'Measure.NonDonors'},
          { headerName: 'NewDonors', field: 'Measure.NewDonors'},
          { headerName: 'RSP', field: 'Measure.RSP'},
          { headerName: 'AVG', field: 'Measure.AVG'},
          { headerName: 'Gross', field: 'Measure.Gross'},
          { headerName: 'Cost', field: 'Measure.Cost'},
          { headerName: 'Net', field: 'Measure.Net'},
          { headerName: 'GPP', field: 'Measure.GPP'},
          { headerName: 'CLM', field: 'Measure.CLM'},
          { headerName: 'NLM', field: 'Measure.NLM'},
          { headerName: 'IO', field: 'Measure.IO'}          
        ],
        enableSorting: true,
        masterDetail: true,  
        groupDefaultExpanded: -1, 
        detailCellRendererParams: this.MailRender
      },    
      getDetailRowData: function(params) {
        params.successCallback(params.data.PhaseList);
      }
    };

    this.CampaignRender = {
      detailGridOptions: {
        columnDefs: [
          { headerName: 'Campaign', field: "CampaignName", cellRenderer: "agGroupCellRenderer" },
          { headerName: 'Mailed', field: 'Measure.Mailed', cellRenderer: function(data) { return '<div _ngcontent-c4=""> Test Click...</div>' + data.value + '</b></div>'}, valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Quantity', field: 'Measure.Quantity'},
          { headerName: 'Donors', field: 'Measure.Donors'},
          { headerName: 'NonDonors', field: 'Measure.NonDonors'},
          { headerName: 'NewDonors', field: 'Measure.NewDonors'},
          { headerName: 'RSP', field: 'Measure.RSP'},
          { headerName: 'AVG', field: 'Measure.AVG'},
          { headerName: 'Gross', field: 'Measure.Gross'},
          { headerName: 'Cost', field: 'Measure.Cost'},
          { headerName: 'Net', field: 'Measure.Net'},
          { headerName: 'GPP', field: 'Measure.GPP'},
          { headerName: 'CLM', field: 'Measure.CLM'},
          { headerName: 'NLM', field: 'Measure.NLM'},
          { headerName: 'IO', field: 'Measure.IO'}          
        ],
        enableSorting: true,   
        masterDetail: true,     
        groupDefaultExpanded: -1,           
        detailCellRendererParams: this.PhaseRender
      },    
      getDetailRowData: function(params) {
        params.successCallback(params.data.CampaignList);
      }
    };

    this.MailTypeRender = {
      detailGridOptions: {
        columnDefs: [
          { headerName: 'Mail Type', field: "MailType", cellRenderer: "agGroupCellRenderer" },
          { headerName: 'Mailed', field: 'Measure.Mailed', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Caged', field: 'Measure.Caged', valueFormatter: function(data) {
            return data.value.substring(5,7) + '/' + data.value.substring(8,10) + '/' + data.value.substring(0,4) }},
          { headerName: 'Quantity', field: 'Measure.Quantity'},
          { headerName: 'Donors', field: 'Measure.Donors'},
          { headerName: 'NonDonors', field: 'Measure.NonDonors'},
          { headerName: 'NewDonors', field: 'Measure.NewDonors'},
          { headerName: 'RSP', field: 'Measure.RSP'},
          { headerName: 'AVG', field: 'Measure.AVG'},
          { headerName: 'Gross', field: 'Measure.Gross'},
          { headerName: 'Cost', field: 'Measure.Cost'},
          { headerName: 'Net', field: 'Measure.Net'},
          { headerName: 'GPP', field: 'Measure.GPP'},
          { headerName: 'CLM', field: 'Measure.CLM'},
          { headerName: 'NLM', field: 'Measure.NLM'},
          { headerName: 'IO', field: 'Measure.IO'}          
        ],
        enableSorting: true,   
        masterDetail: true, 
        groupDefaultExpanded: -1,     
        detailCellRendererParams: this.CampaignRender
      },    
      getDetailRowData: function(params) {
        params.successCallback(params.data.MailTypeList);
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.service.getReturns(this.activeClient, new Date("01/01/" + this.selectedYear), new Date("12/31/" + this.selectedYear));
  }
}
