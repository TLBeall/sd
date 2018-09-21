import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
    
public cwWidth: number;
public size_lg:number = 1200;
public size_md:number = 992;
public size_sm:number = 768;
public size_xs:number = 576;


constructor() { 
  }

}
