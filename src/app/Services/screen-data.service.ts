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

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenDataService {
    
  
private windowSource = new Subject<number>();
currentWindowWidth = this.windowSource.asObservable();

setWidth(data: number){
  this.windowSource.next(data);
}

  constructor() { 
  }
}
