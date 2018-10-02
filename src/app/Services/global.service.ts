import { Injectable } from '@angular/core';
// import { Subject, Observable } from 'rxjs';
// import { RootReturns } from '../Models/RootReturns.model';
import { ClientList } from '../Models/ClientList.model';

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

  SetLastElements(rootReturns: any): any {
    if (rootReturns)
      rootReturns[0].MailTypeList.forEach(element => {
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
    rootReturns[0].MailTypeList[rootReturns[0].MailTypeList.length - 1].Measure.IsLast = true;
    return rootReturns;
  }
}



