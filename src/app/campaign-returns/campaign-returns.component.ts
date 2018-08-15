import { Component, OnInit, Input } from '@angular/core';
import { CampaignReturns } from '../Models/CampaignReturns';
import { MailTypeReturns } from '../Models/MailTypeReturns';

@Component({
  selector: 'app-campaign-returns',
  templateUrl: './campaign-returns.component.html',
  styleUrls: ['./campaign-returns.component.css']
})
export class CampaignReturnsComponent implements OnInit {

    @Input() public CampaignList: CampaignReturns[];
    @Input() public MailType: MailTypeReturns;

  constructor() { }

  ngOnInit() {
  }

}
