import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';
import { RootReturns } from '../Models/RootReturns.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
    
public cwWidth: number;
public size_lg:number = 1200;
public size_md:number = 992;
public size_sm:number = 768;
public size_xs:number = 576;
public client: string = "FDFL";
public startDate:Date = new Date("01/01/" + new Date().getFullYear());
public endDate:Date = new Date("12/31/" + new Date().getFullYear());
public listowner: number;
public listmanager: number;
public recency: number;
public rootReturns: RootReturns;
public showlistperformance: boolean;

constructor() { 
  }

}
