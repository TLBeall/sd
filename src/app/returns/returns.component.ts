import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { delay, share } from 'rxjs/operators';
import { RootReturns } from '../Models/RootReturns';
import { MailtypeReturnsComponent } from '../mailtype-returns/mailtype-returns.component'
import 'datatables.net';
import * as $ from 'jquery';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  public RootReturns : RootReturns;
  public tableWidget: any;
  constructor(private _authService: AuthService) {     
  }

  ngOnInit() {
    this._authService.getReturns()
    .subscribe(data => {
      this.RootReturns = data;
    });  
  }

  ngAfterViewInit() {
    this.initDatatable()
  }

  private initDatatable(): void {
    let exampleId: any = $('#example');
    this.tableWidget = exampleId.DataTable({
      select: true
    });
  }
}
