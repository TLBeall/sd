import { Component, OnInit, Input } from '@angular/core';
import { PhaseReturns } from '../../Models/PhaseReturns.model';
import { CampaignReturns } from '../../Models/CampaignReturns.model';

@Component({
  selector: 'app-phase-returns',
  templateUrl: './phase-returns.component.html',
  styleUrls: ['./phase-returns.component.scss']
})
export class PhaseReturnsComponent implements OnInit {

  constructor() { }

  @Input() public PhaseList: PhaseReturns[];
  @Input() public Campaign: CampaignReturns;

  ngOnInit() {
  }

}
