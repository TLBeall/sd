import { Component, OnInit, Input } from '@angular/core';
import { PhaseReturns } from '../Models/PhaseReturns';
import { MailReturns } from '../Models/MailReturns';

@Component({
  selector: 'app-maillist-returns',
  templateUrl: './maillist-returns.component.html',
  styleUrls: ['./maillist-returns.component.css']
})
export class MaillistReturnsComponent implements OnInit {

  constructor() { }

  @Input() public MailList: MailReturns[];
  @Input() public Phase: PhaseReturns;

  ngOnInit() {
  }

}
