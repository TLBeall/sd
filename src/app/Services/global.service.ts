import { Injectable } from '@angular/core';
// import { Subject, Observable } from 'rxjs';
// import { RootReturns } from '../Models/RootReturns.model';
import { ClientList } from '../Models/ClientList.model';
import { Returns } from '../Models/Returns.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public cwWidth: number;
  public size_lg: number = 1200;
  public size_md: number = 992;
  public size_sm: number = 768;
  public size_xs: number = 576;

  mi_tooltipShowDelay: number = 750;
  mi_tooltipHideDelay: number = 250;

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
      DestinationMeasure.AVG = DestinationMeasure.Gross / DestinationMeasure.Donors;

    if (DestinationMeasure.Gross > 0)
      DestinationMeasure.IO = DestinationMeasure.Gross / DestinationMeasure.Cost;

    return DestinationMeasure;
  }

  AddToMeasure(SourceMeasure: Returns, DestinationMeasure: Returns): Returns {
    if (DestinationMeasure.Mailed)
      if (DestinationMeasure.Mailed.toString() == "0001-01-01T00:00:00") DestinationMeasure.Mailed = SourceMeasure.Mailed;
    if (DestinationMeasure.Mailed > SourceMeasure.Mailed)
      DestinationMeasure.Mailed = SourceMeasure.Mailed;
    if (DestinationMeasure.Caged)
      if (DestinationMeasure.Caged.toString() == "0001-01-01T00:00:00") DestinationMeasure.Caged = SourceMeasure.Caged;
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

  CalculateSummaries(rootReturns: any): any {
    if (rootReturns)
      rootReturns.forEach(client => {
        client.MailTypeList.forEach(type => {
          type.Measure.Quantity = 0;
          type.CampaignList.forEach(campaign => {
            campaign.Measure.Quantity = 0;
            campaign.PhaseList.forEach(phase => {
              phase.Measure.Quantity = 0;
              phase.MailList.forEach(list => {
                phase.Measure = this.AddToMeasure(list.Measure, phase.Measure);
              });
              phase.Measure = this.CalculateRates(phase.Measure);
              campaign.Measure = this.AddToMeasure(phase.Measure, campaign.Measure);
            });
            campaign.Measure = this.CalculateRates(campaign.Measure);
            type.Measure = this.AddToMeasure(campaign.Measure, type.Measure);
          });
          type.Measure = this.CalculateRates(type.Measure);
          client.Measure = this.AddToMeasure(type.Measure, client.Measure);
        });
        client.Measure = this.CalculateRates(client.Measure);
      })
    return rootReturns;
  }

  SetLastElements(rootReturns: any): any {
    var expandState = true;
    rootReturns = this.CalculateSummaries(rootReturns);
    if (rootReturns.length > 1)
      expandState = false;
    if (rootReturns)
      rootReturns.forEach(element => {
        element.MailTypeList.forEach(element => {
          element.Measure.IsLast = false;
          element.CampaignList.forEach(element => {
            element.Measure.IsLast = false;
            element.PhaseList.forEach(element => {
              element.Measure.IsLast = false;
              element.Measure.Expanded = expandState;
            });
            element.PhaseList[element.PhaseList.length - 1].Measure.IsLast = true;
            element.Measure.Expanded = expandState;
          });
          element.CampaignList[element.CampaignList.length - 1].Measure.IsLast = true;
          element.Measure.Expanded = expandState;
        });
        element.MailTypeList[element.MailTypeList.length - 1].Measure.IsLast = true;
        element.Measure.Expanded = true;
      })
    return rootReturns;
  }
}



