import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-returns',
  templateUrl: './campaign-returns.component.html',
  styleUrls: ['./campaign-returns.component.css']
})
export class CampaignReturnsComponent implements OnInit {

  @Input() public CampaignList;
  @Input() public MailType;

  constructor() { }

  ngOnInit() {
  }

}
