import { Component } from '@angular/core';
import {enableProdMode} from '@angular/core';
// import { LoaderService } from './Loader/loader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SD360-Reporting-Angular';

  // showLoader: boolean;

  //   constructor(
  //       private loaderService: LoaderService) {
  //   }

  //   ngOnInit() {
  //       this.loaderService.status.subscribe((val: boolean) => {
  //           this.showLoader = val;
  //       });
  //   }
}

enableProdMode();
