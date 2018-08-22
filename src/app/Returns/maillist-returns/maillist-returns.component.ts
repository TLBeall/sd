import { Component, OnInit, Input, Type } from '@angular/core';
import { PhaseReturns } from '../../Models/PhaseReturns';
import { MailReturns } from '../../Models/MailReturns';
// import { MailTypeReturns } from '../../Models/MailTypeReturns';

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
