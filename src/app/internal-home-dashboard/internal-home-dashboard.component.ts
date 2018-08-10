import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service'
import { TokenParams } from '../Models/TokenParams';
import { ClientList } from '../Models/ClientList';

declare var $:any;
//import * as $ from 'jquery';


@Component({
  selector: 'app-internal-home-dashboard',
  templateUrl: './internal-home-dashboard.component.html',
  styleUrls: ['./internal-home-dashboard.component.css']
})
export class InternalHomeDashboardComponent implements OnInit {

  public ClientArr : ClientList[];
  public tokenParam : TokenParams;

  public triggers; 
  public filters; 

  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this._authService.getClientList()
    .subscribe(data => {
      this.ClientArr = data;
      });

      this.triggers =  $('ul.alphabet li a');
      $('#showAllClientsLi').click(function () {
        this.filters.parent().fadeIn(222);
        $('#alphabetResult').html('');
    });

    this.triggers.click(function () {
        var takeLetter = $(this).text(), result = 0;
        this.filters =  $('ul.dictionary li a');  
        this.filters.parent().hide();  
        this.filters.each(function () {
            if (takeLetter != "#") {
                if (RegExp('^' + takeLetter).test($(this).text())) {
                    result += 1;
                    $(this).parent().fadeIn(222);
                }
            }
            else {
                if (RegExp('^' + '[0-9]').test($(this).text())) {
                    result += 1;
                    $(this).parent().fadeIn(222);
                }
            }
        });
        $('#alphabetResult').html('<b>' + (result < 1 ? 'No results found' : result + ' result(s) found') + '</b>');
    });

  }
}
