import { Component, OnInit, ViewChild } from '@angular/core';
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

    selectedYear = "";
    selectedItem = 1;

    setSelectedItem(id: number){
        this.selectedItem = id;
        if (id === 1 || id === 2){
        this.selectedYear = "";
        this.resetAlphabet();
        }
        if (id === 3 && this.selectedYear != ""){
            this.resetAlphabet()
        }
    }

    setYear(event: any){
        this.selectedYear = event.target.text;
        this.resetAlphabet();
    }

    resetAlphabet(){
        $('ul.alphabet > li > a').removeClass('active');
        $('#showAllClientsLi > a').addClass('active');
    }

  public ClientArr : ClientList[];
  public tokenParam : TokenParams;

  public triggers; 
  public filters; 
  public selectedYear: string = (new Date()).getFullYear().toString();

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    //   $("#ByYearId").html("By Year");
>>>>>>> bb52bfcadb49b5d64fc751f143aa74b168a1f609
>>>>>>> abb0954720397ea38addba2ceaf48557dd143bf6
      $('#alphabetResult').trigger( "click" );
      });   
  }

  GetArchivedAndReset(pYear: string): void {
      this.GetArchived(pYear);
      $("#ByYearId").html("By Year");
      this.selectedYear = (new Date()).getFullYear().toString();
    }

}
