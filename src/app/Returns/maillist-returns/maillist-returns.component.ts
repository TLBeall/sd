<<<<<<< HEAD
import { Component, OnInit, Input, Type } from '@angular/core';
import { PhaseReturns } from '../../Models/PhaseReturns';
import { MailReturns } from '../../Models/MailReturns';
// import { MailTypeReturns } from '../../Models/MailTypeReturns';
=======
import { Component, OnInit, Input } from '@angular/core';
import { PhaseReturns } from '../../Models/PhaseReturns.model';
import { MailReturns } from '../../Models/MailReturns.model';
>>>>>>> 410a2a91437176135598952c34616ab86897287e

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
