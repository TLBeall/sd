import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { AuthService } from '../Services/auth.service'
import { TokenParams } from '../Models/TokenParams.model';
import { ClientList } from '../Models/ClientList.model';
import * as $ from 'jquery';


@Component({
    selector: 'app-internal-home-dashboard',
    templateUrl: './internal-home-dashboard.component.html',
    styleUrls: ['./internal-home-dashboard.component.scss']
})
export class InternalHomeDashboardComponent implements OnInit {
    public ClientArr: ClientList[];
    public tokenParam: TokenParams;
    public pYear: string;
    public tempYearVal: number;
    public selectedYear: string = "";
    public selectedItem: number = 1;

    constructor(private _authService: AuthService) { }

    ngOnInit() {
        this._authService.getClientList((new Date()).getFullYear().toString())
            .subscribe(data => {
                this.ClientArr = data;
            });
    }

<<<<<<< HEAD
    public ClientArr : ClientList[];
    public tokenParam : TokenParams;
  
    public triggers; 
    public filters; 
    public selectedYear: string = (new Date()).getFullYear().toString();
      selectedItem = 1;
=======
    GetArchived(tab): void {
        console.log(tab);
        this.tempYearVal = tab.index;
        if (tab.tab.textLabel != "By Year") {
            if (this.tempYearVal == 0) {
                this.pYear = "2018";
            } else if (this.tempYearVal == 1) {
                this.pYear = "All";
            }
            this._authService.getClientList(this.pYear)
                .subscribe(data => {
                    this.ClientArr = data;
                    this.resetAlphabet()
                    this.selectedYear = "";
                });
        } else this.ClientArr = null;
    }
>>>>>>> 79755303ffa6d4afd21c979ac11387b9f00abf06

    GetArchivedYear(val) {
        this.pYear = (val.target.innerText);
        this._authService.getClientList(this.pYear)
            .subscribe(data => {
                this.ClientArr = data;
            });
    }

    setYear(val) {
        this.selectedYear = val.target.textContent;
        this.resetAlphabet();
    }

    resetAlphabet() {
        $('ul.alphabet > li > a').removeClass('active');
        $('#showAllClientsLi > a').addClass('active');
    }
<<<<<<< HEAD

  constructor(private _authService: AuthService) { }

  

  ngOnInit() {

    this._authService.getClientList((new Date()).getFullYear().toString())
    .subscribe(data => {
      this.ClientArr = data;
      });
      
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


  GetArchived(pYear: string): void {
    this.selectedYear = pYear;
    this._authService.getClientList(pYear)
    .subscribe(data => {
      this.ClientArr = data;
      $('#alphabetResult').trigger( "click" );
      });   
  }

  GetArchivedAndReset(pYear: string): void {
      this.GetArchived(pYear);
      $("#ByYearId").html("By Year");
      this.selectedYear = (new Date()).getFullYear().toString();
    }

=======
>>>>>>> 79755303ffa6d4afd21c979ac11387b9f00abf06
}
