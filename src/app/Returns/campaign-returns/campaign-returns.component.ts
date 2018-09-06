import { Component, OnInit, Input } from '@angular/core';
import { CampaignReturns } from '../../Models/CampaignReturns.model';
import { MailTypeReturns } from '../../Models/MailTypeReturns.model';

@Component({
  selector: 'app-campaign-returns',
  templateUrl: './campaign-returns.component.html',
  styleUrls: ['./campaign-returns.component.scss']
})
export class CampaignReturnsComponent implements OnInit {

    @Input() public CampaignList: CampaignReturns[];
    @Input() public MailType: MailTypeReturns;

  constructor() { }

  ngOnInit() {    
  }
}
