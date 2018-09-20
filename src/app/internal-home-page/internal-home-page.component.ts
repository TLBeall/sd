// import { Component, OnInit, ViewChild, Input, Output, HostListener } from '@angular/core';
// import { AuthService } from '../Services/auth.service'
// import { TokenParams } from '../Models/TokenParams.model';
// import { ClientList } from '../Models/ClientList.model';
// import * as $ from 'jquery';
// import { ScreenDataService } from '../Services/screen-data.service';


// @Component({
//     selector: 'app-internal-home-page',
//     templateUrl: './internal-home-page.component.html',
//     styleUrls: ['./internal-home-page.component.scss']
// })
// export class InternalHomePageComponent implements OnInit {
//     public ClientArr: ClientList[];
//     public tokenParam: TokenParams;
//     public pYear: string;
//     public tempYearVal: number;
//     public selectedYear: string;
//     toolsOpened: Boolean;
//     hide: Boolean = false;
//     visibility: string = "hidden";
//     toolsIcon: string = "assessment";

//     public currentWindowWidth: number;

//     constructor(private _authService: AuthService, private _testWidth: ScreenDataService) { 
//     this.currentWindowWidth = this._testWidth.getUserData();
//     }



//     ngOnInit() {
//         // this.currentWindowWidth = window.innerWidth;

//         this._authService.getClientList((new Date()).getFullYear().toString())
//             .subscribe(data => {
//                 this.ClientArr = data;
//                 this.selectedYear = new Date().getFullYear().toString();
//             });
//     }

//     GetArchived(tab): void {
//         this.tempYearVal = tab.index;
//         if (tab.tab.textLabel != "By Year") {
//             if (this.tempYearVal == 0) {
//                 this.pYear = "2018";
//             } else if (this.tempYearVal == 1) {
//                 this.pYear = "All";
//             }
//             this._authService.getClientList(this.pYear)
//                 .subscribe(data => {
//                     this.ClientArr = data;
//                     this.resetAlphabet()
//                     this.selectedYear = "";
//                 });
//         } else this.ClientArr = null;
//     }

//     GetArchivedYear(val) {
//         this.pYear = (val.target.innerText);
//         this._authService.getClientList(this.pYear)
//             .subscribe(data => {
//                 this.ClientArr = data;
//             });
//     }

//     setYear(val) {
//         this.selectedYear = val.target.textContent;
//         this.resetAlphabet();
//     }

//     resetAlphabet() {
//         $('ul.alphabet > li > a').removeClass('active');
//         $('#showAllClientsLi > a').addClass('active');
//     }

//     toggle(tag: number) {
//         if (tag === 1) {
//             this.toolsOpened = !this.toolsOpened;
//             this.hide = !this.hide;
//             this.toolsIcon = this.toolsOpened ? "arrow_forward_ios" : "assessment";
//             this.visibleFunction();
//         }
//     }

//     visibleFunction() {
//         if (this.visibility == "hidden") {
//             setTimeout(() => {
//                 this.visibility = "visible";
//             }, 200);
//         } else {
//             this.visibility = "hidden";
//         }
//     }

//     // @HostListener('window:resize')
//     // onResize() {
//     //     this.currentWindowWidth = window.innerWidth
//     // }

// }



import { Component, OnInit, ViewChild, Input, Output, HostListener } from '@angular/core';
import { AuthService } from '../Services/auth.service'
import { TokenParams } from '../Models/TokenParams.model';
import { ClientList } from '../Models/ClientList.model';
import * as $ from 'jquery';
import { ScreenDataService } from '../Services/screen-data.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-internal-home-page',
    templateUrl: './internal-home-page.component.html',
    styleUrls: ['./internal-home-page.component.scss']
})
export class InternalHomePageComponent implements OnInit {
    public ClientArr: ClientList[];
    public tokenParam: TokenParams;
    public pYear: string;
    public tempYearVal: number;
    public selectedYear: string;
    toolsOpened: Boolean;
    hide: Boolean = false;
    visibility: string = "hidden";
    toolsIcon: string = "assessment";
    subscription: Subscription;
    public currentWindowWidth: number;
    public currentYear: number;

    constructor(private _authService: AuthService, private _testWidth: ScreenDataService) {
        this.currentYear = (new Date()).getFullYear();
        this.subscription = _testWidth.currentWindowWidth.subscribe(
            data => {
                this.currentWindowWidth = data;
            });
    }

    ngOnInit() {
        this._authService.getClientList((new Date()).getFullYear().toString())
            .subscribe(data => {
                this.ClientArr = data;
                this.selectedYear = new Date().getFullYear().toString();
            });
    }

    GetArchived(tab): void {
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

    toggle(tag: number) {
        if (tag === 1) {
            this.toolsOpened = !this.toolsOpened;
            this.hide = !this.hide;
            this.toolsIcon = this.toolsOpened ? "arrow_forward_ios" : "assessment";
            this.visibleFunction();
        }
    }

    visibleFunction() {
        if (this.visibility == "hidden") {
            setTimeout(() => {
                this.visibility = "visible";
            }, 200);
        } else {
            this.visibility = "hidden";
        }
    }

    // @HostListener('window:resize')
    // onResize() {
    //     this.currentWindowWidth = window.innerWidth
    // }

}
