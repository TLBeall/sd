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
}
