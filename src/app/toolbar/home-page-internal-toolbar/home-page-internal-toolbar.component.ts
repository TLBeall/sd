import { Component, OnInit, HostListener, Input } from '@angular/core';
import * as $ from 'jquery';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
    selector: 'app-home-page-internal-toolbar',
    templateUrl: './home-page-internal-toolbar.component.html',
    styleUrls: ['./home-page-internal-toolbar.component.scss']
})
export class HomePageInternalToolbarComponent implements OnInit {
    public triggers;
    public filters;
    public currentWindowWidth: number;
    public alphabetSelection: string;

    constructor(){
    }

    ngOnInit() {
        this.currentWindowWidth = window.innerWidth;
        this.alphabetSelection = "Search by Letter";

        $('#showAllClientsLi').click(function () {
            var filters = $('ul.dictionary li a');
            filters.parent().fadeIn(222);
        });


        this.triggers = $('ul.alphabet li a');

        this.triggers.click(function () {
            var takeLetter = $(this).text();
            var result = 0;
            this.filters = $('ul.dictionary li a');
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

    findLetter(event) {
        var takeLetter = event.target.textContent;
        var result = 0;
        this.filters = $('ul.dictionary li a');
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
        this.alphabetSelection = "Search results for " + takeLetter;
    }

    findAll(event){
        var filters = $('ul.dictionary li a');
        filters.parent().fadeIn(222);
        this.alphabetSelection = "Search by Letter";
    }

    @HostListener('window:resize')
    onResize() {
        this.currentWindowWidth = window.innerWidth
    }

}
