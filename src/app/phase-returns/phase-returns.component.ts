import { Component, OnInit, Input } from '@angular/core';
import { PhaseReturns } from '../Models/PhaseReturns';
import { CampaignReturns } from '../Models/CampaignReturns';

@Component({
  selector: 'app-phase-returns',
  templateUrl: './phase-returns.component.html',
  styleUrls: ['./phase-returns.component.css']
})
export class PhaseReturnsComponent implements OnInit {

  constructor() { }

  @Input() public PhaseList: PhaseReturns[];
  @Input() public Campaign: CampaignReturns;

  ngOnInit() {
  }

}
