// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ScreenDataService {
  
//   currentWindowWidth: number;
//   getUserData(){
//     return this.currentWindowWidth;
//   }

//   setUserData(data:any){
//     this.currentWindowWidth = data;
//   }


import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
    
public cwWidth: number;

constructor() { 
  }

}
