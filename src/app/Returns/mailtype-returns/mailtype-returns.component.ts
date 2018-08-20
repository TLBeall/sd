import { Component, OnInit, Input } from '@angular/core';
import 'datatables.net';
import * as $ from 'jquery';
import { RootReturns } from '../../Models/RootReturns';
import { MailTypeReturns } from '../../Models/MailTypeReturns';

@Component({
  selector: 'app-mailtype-returns',
  templateUrl: './mailtype-returns.component.html',
  styleUrls: ['./mailtype-returns.component.css']
})
export class MailtypeReturnsComponent implements OnInit {

  @Input() public MailTypeList : MailTypeReturns;
  @Input() public RootReturns : RootReturns;

  constructor() { }

  ngOnInit() {    
  }

  ngAfterViewInit() {
  }
  
}
