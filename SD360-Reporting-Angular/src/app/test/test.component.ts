import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service'
import { TokenParams } from '../Models/TokenParams';
import { ClientList } from '../Models/ClientList';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public ClientArr : ClientList[];
  public tokenParam : TokenParams;
  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this._authService.getClientList()
    .subscribe(data => {
      this.ClientArr = data
    });
  }

}
