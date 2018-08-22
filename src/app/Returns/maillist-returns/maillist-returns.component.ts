import { Component, OnInit, Input } from '@angular/core';
import { PhaseReturns } from '../../Models/PhaseReturns.model';
import { MailReturns } from '../../Models/MailReturns.model';

@Component({
  selector: 'app-maillist-returns',
  templateUrl: './maillist-returns.component.html',
  styleUrls: ['./maillist-returns.component.css']
})
export class MaillistReturnsComponent implements OnInit {

  // displayHouse: boolean = false;

  constructor() { }

  @Input() public MailList: MailReturns[];
  @Input() public Phase: PhaseReturns;
  // @Input() public MailTypeList: MailTypeReturns;
  @Input() public MailType: string;

  ngOnInit() {
  }

}
