import { Component, OnInit, HostListener, Input, ViewChild, Host, Optional } from '@angular/core';
import * as $ from 'jquery';
import { getLocaleDateTimeFormat } from '@angular/common';
import { GlobalService } from '../../Services/global.service';
import { MatAutocompleteTrigger } from '@angular/material';



@Component({
    selector: 'app-home-page-internal-toolbar',
    templateUrl: './home-page-internal-toolbar.component.html',
    styleUrls: ['./home-page-internal-toolbar.component.scss']
})
export class HomePageInternalToolbarComponent implements OnInit {
    public triggers;
    public filters;
    public currentWindowWidth: number;
    public size_lg = this._g.size_lg;
    public size_md = this._g.size_md;
    public size_sm = this._g.size_sm;
    public size_xs = this._g.size_xs;
    public alphabetSelection: string;


    constructor(public _g: GlobalService) {
    }


    ngOnInit() {
        this.alphabetSelection = "Search by Letter";
    }

    findLetter(event) {
        var takeLetter = event.target.textContent;
        var result = 0;
        this.filters = $('ul.dictionary li button');
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
        var filters = $('ul.dictionary li button');
        filters.parent().fadeIn(222);
        this.alphabetSelection = "Search by Letter";
    }
}

