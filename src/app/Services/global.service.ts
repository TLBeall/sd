import { Injectable } from '@angular/core';
// import { Subject, Observable } from 'rxjs';
// import { RootReturns } from '../Models/RootReturns.model';
import { ClientList } from '../Models/ClientList.model';
import { Returns } from '../Models/Returns.model';
import { ListPerformance } from '../Models/ListPerformance.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public cwWidth: number;
  public size_lg: number = 1200;
  public size_md: number = 992;
  public size_sm: number = 768;
  public size_xs: number = 576;

  public clientArr: ClientList[];
  public clearCurCache: boolean = false;

  constructor() {
  }

  CalculateRates(DestinationMeasure: Returns): Returns {

    DestinationMeasure.Net = DestinationMeasure.Gross - DestinationMeasure.Cost;

    if (DestinationMeasure.Quantity > 0) {
      DestinationMeasure.RSP = DestinationMeasure.Donors / DestinationMeasure.Quantity;
      DestinationMeasure.GPP = DestinationMeasure.Gross / DestinationMeasure.Quantity;
      DestinationMeasure.CLM = DestinationMeasure.Cost / DestinationMeasure.Quantity;
      DestinationMeasure.NLM = DestinationMeasure.Net / DestinationMeasure.Quantity;
    }

    if (DestinationMeasure.Donors > 0)
    {
      DestinationMeasure.AVG = DestinationMeasure.Gross / DestinationMeasure.Donors;
      DestinationMeasure.CPD = DestinationMeasure.Cost / DestinationMeasure.Donors;
    }

    if (DestinationMeasure.Gross > 0)
      DestinationMeasure.IO = DestinationMeasure.Gross / DestinationMeasure.Cost;

    return DestinationMeasure;
  }

  ListPerformanceSummary(ListPerformanceArray:ListPerformance[]):Returns
  {
      var Summary: Returns = new Returns;
      this.InitializeMeasure(Summary);
      ListPerformanceArray.forEach(element => {
         if (element.Measure["Selected"] == true)
          this.AddToMeasure(element.Measure, Summary);
      });
      Summary = this.CalculateRates(Summary);
      return Summary;
  }

  AddToMeasure(SourceMeasure: Returns, DestinationMeasure: Returns): Returns {
    if (DestinationMeasure.Mailed != null)
      if (DestinationMeasure.Mailed == "01/01/1900")
        DestinationMeasure.Mailed = SourceMeasure.Mailed;
    if (DestinationMeasure.Mailed > SourceMeasure.Mailed)
      DestinationMeasure.Mailed = SourceMeasure.Mailed;
    if (DestinationMeasure.Caged != null)
      if (DestinationMeasure.Caged == "01/01/1900")
        DestinationMeasure.Caged = SourceMeasure.Caged;
    if (DestinationMeasure.Caged < SourceMeasure.Caged)
      DestinationMeasure.Caged = SourceMeasure.Caged;

    DestinationMeasure.Quantity = SourceMeasure.Quantity + DestinationMeasure.Quantity;
    DestinationMeasure.Donors = SourceMeasure.Donors + DestinationMeasure.Donors;
    DestinationMeasure.NonDonors = SourceMeasure.NonDonors + DestinationMeasure.NonDonors;
    DestinationMeasure.NewDonors = SourceMeasure.NewDonors + DestinationMeasure.NewDonors;
    DestinationMeasure.Gross = SourceMeasure.Gross + DestinationMeasure.Gross;
    DestinationMeasure.Cost = SourceMeasure.Cost + DestinationMeasure.Cost;    

    return DestinationMeasure;
  }

  InitializeMeasure(element: Returns): Returns {
    element.Caged = "01/01/1900";
    element.Mailed = "01/01/1900";
    element.Cost = 0;
    element.Donors = 0;
    element.Gross = 0;
    element.Net = 0;
    element.NewDonors = 0;
    element.NonDonors = 0;
    element.Quantity = 0;
    element.AVG = 0;
    element.RSP = 0;
    element.IO = 0;
    element.NLM = 0;
    element.GPP = 0;
    element.CLM = 0;
    element.CPD = 0;
    return element;
  }

  CalculateSummaries(rootReturns: any): any {
    var grandTotal: Returns = new Returns();
    this.InitializeMeasure(grandTotal);
    if (rootReturns)
      rootReturns.forEach(client => {
        client.Measure = this.InitializeMeasure(client.Measure);
        client.MailTypeList.forEach(type => {
          type.Measure = this.InitializeMeasure(type.Measure);
          type.CampaignList.forEach(campaign => {
            campaign.Measure = this.InitializeMeasure(campaign.Measure);
            campaign.PhaseList.forEach(phase => {
              phase.Measure = this.InitializeMeasure(phase.Measure);
              phase.MailList.forEach(list => {
                if (list.Measure.Selected)
                  phase.Measure = this.AddToMeasure(list.Measure, phase.Measure);
              });
              phase.Measure = this.CalculateRates(phase.Measure);
              if (phase.Measure.Selected || phase.Measure.Indeterminate)
                campaign.Measure = this.AddToMeasure(phase.Measure, campaign.Measure);
            });
            campaign.Measure = this.CalculateRates(campaign.Measure);
            if (campaign.Measure.Selected || campaign.Measure.Indeterminate)
              type.Measure = this.AddToMeasure(campaign.Measure, type.Measure);
          });
          type.Measure = this.CalculateRates(type.Measure);
          if (type.Measure.Selected || type.Measure.Indeterminate)
            client.Measure = this.AddToMeasure(type.Measure, client.Measure);
        });
        client.Measure = this.CalculateRates(client.Measure);
        grandTotal = this.AddToMeasure(client.Measure, grandTotal);
      })
    grandTotal = this.CalculateRates(grandTotal)
    return {
      grandTotal: grandTotal,
      rootReturns: rootReturns
    };;
  }

  ExpandAll(rootReturns: any): any {
    var expandState = true;
    if (rootReturns.length > 1)
      return rootReturns;
    if (rootReturns)
      rootReturns.forEach(element => {
          element.MailTypeList.forEach(element => {
            element.CampaignList.forEach(element => {
              element.PhaseList.forEach(element => {
                element.Measure.Expanded = expandState;
              });
              element.Measure.Expanded = expandState;
            });
            element.Measure.Expanded = expandState;
          });
          element.Measure.Expanded = true;
      })
    return rootReturns;
  }


  SetLastElements(rootReturns: any): any {
    if (rootReturns)
      rootReturns.forEach(element => {
        element.Measure.IsLast = false;
          element.MailTypeList.forEach(element => {
            element.Measure.IsLast = false;
            element.CampaignList.forEach(element => {
              element.Measure.IsLast = false;
              element.PhaseList.forEach(element => {
                element.Measure.IsLast = false;
              });
              element.PhaseList[element.PhaseList.length - 1].Measure.IsLast = true;
            });
            element.CampaignList[element.CampaignList.length - 1].Measure.IsLast = true;
          });
          element.MailTypeList[element.MailTypeList.length - 1].Measure.IsLast = true;
      })
    rootReturns[rootReturns.length - 1].Measure.IsLast = true;
    return rootReturns;
  }
}



