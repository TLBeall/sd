import { Component, OnInit } from '@angular/core';
import { ClientlistService } from '../clientlist.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public ClientList = [];

  constructor(private _clientlist: ClientlistService) { }

  ngOnInit() {
    this._clientlist.getClients()
    .subscribe(data => this.ClientList = data);
  }

}
