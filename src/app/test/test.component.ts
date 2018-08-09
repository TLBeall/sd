import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service'
import { TokenParams } from '../Models/TokenParams';
import { ClientList } from '../Models/ClientList';
//import { $ } from '../../../node_modules/protractor';
import * as $ from 'jquery';

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


      // $("#testBtn").click(function(){
      //   alert('test');
      // })
    });
  }
  
}
// class simpleCounter{
//   public count(){
//     let count = 5;

//     for(let i = 1; i <=7; i++){
//       document.write(i.toString() + '<br>');
//     }
//     console.log('all done')
//   }
// }

// let count = new simpleCounter();
// count.count();


