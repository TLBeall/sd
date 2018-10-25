import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ListGross } from 'src/app/Models/ListGross.model';


@Component({
  selector: 'app-list-gross',
  templateUrl: './list-gross.component.html',
  styleUrls: ['./list-gross.component.scss']
})
export class ListGrossComponent implements OnInit {
  private route: any;
  private pageReady: boolean = false;
  private PackageCode: string;
  private PhaseNumber: string;
  private MailCode: string;
  private GrossListArr: ListGross[];

  private Date: Date;

  constructor(private _authService: AuthService, route: ActivatedRoute, private _g: GlobalService) {
    this.route = route;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LoadValues(params['packagecode'], params['phasenumber'], params['mailcode']);             

      // this._authService.getPerformanceHierarchy().subscribe(data => {
      //   data = data.sort((n1,n2) => n1.SegmentSort > n2.SegmentSort ? 1:n2.SegmentSort > n1.SegmentSort ? -1:0);
      //   this.LMStrArr = Array.from(new Set(data.map(item =>  item.ListManagerName + ' - '+ item.ListManagerAbbrev))).sort();
      //   this.LOStrArr = Array.from(new Set(data.map(item =>  item.ListName + ' - '+ item.ListAbbrev))).sort();
      //   // this.LOInput.nativeElement.blur();
      //   this.RecStrArr = Array.from(new Set(data.map(item =>  item.SegmentName )));
      //   this.ClStrArr = Array.from(new Set(data.map(item =>  item.ClientName + ' - '+ item.ClientAbbrev))).sort();
      //   this.LOfilteredOptions = this.LOControl.valueChanges.pipe(
      //     startWith(null),
      //     map((listowner: string | null) => listowner ? this.LO_filter(listowner) : this.LOStrArr.slice())
      //   ); 
      //   this.LMfilteredOptions = this.LMControl.valueChanges.pipe(
      //     startWith(null),
      //     map((listmanager: string | null) => listmanager ? this.LM_filter(listmanager) : this.LMStrArr.slice())
      //   ); 
      //   this.RecfilteredOptions = this.RecControl.valueChanges.pipe(
      //     startWith(null),
      //     map((recency: string | null) => recency ? this.Rec_filter(recency) : this.RecStrArr.slice())
      //   ); 
      //   this.ClfilteredOptions = this.ClControl.valueChanges.pipe(
      //     startWith(null),
      //     map((client: string | null) => client ? this.Cl_filter(client) : this.ClStrArr.slice())
      //   );                                
      // });

      this._authService.getListGross(this.PackageCode, this.PhaseNumber, this.MailCode)
      .subscribe(data => {
        this.GrossListArr = data;
        // this.ListPerformanceArr.forEach(p => { p.Measure.Expanded = false; p.Measure["Selected"] = true; });
        this.pageReady = true;
      });    
   });
  }


  LoadValues(packagecode:string, phaseNumber:string, mailcode:string)
  {
    this.PackageCode = packagecode;
    this.PhaseNumber = phaseNumber;
    this.MailCode = mailcode;
  }


}
