import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mailtype-returns',
  templateUrl: './mailtype-returns.component.html',
  styleUrls: ['./mailtype-returns.component.css']
})
export class MailtypeReturnsComponent implements OnInit {

  @Input() public MailTypeList;

  constructor() { }

  ngOnInit() {
  }

}
