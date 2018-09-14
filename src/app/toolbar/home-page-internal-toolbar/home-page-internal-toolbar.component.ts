import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-home-page-internal-toolbar',
  templateUrl: './home-page-internal-toolbar.component.html',
  styleUrls: ['./home-page-internal-toolbar.component.scss']
})
export class HomePageInternalToolbarComponent implements OnInit {
  public triggers; 
  public filters; 
  constructor() { }

  ngOnInit() {
    $('#showAllClientsLi').click(function () {
      var filters =  $('ul.dictionary li a');  
      filters.parent().fadeIn(222); 
      $('#alphabetResult').html('');
  });

  
  this.triggers =  $('ul.alphabet li a');

  this.triggers.click(function () {
      var takeLetter = $(this).text();
      var result = 0;
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
      // $('#alphabetResult').html('<b>' + (result < 1 ? 'No results found' : result + ' result(s) found') + '</b>');
  });    
  }

}
