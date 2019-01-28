import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  navbarOpen = false;
  route: any;
  router: any;
  constructor(route: ActivatedRoute, router: Router, private _g: GlobalService) {
    this.route = route;
    this.router = router;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  NavigateToHome() {
    this._g.clearCurCache = true;
    this.router.navigate(['homepage']);
  }

  NavigateToReturns() {
    this._g.clearCurCache = true;
    this.router.navigate(['returns']);
  }

  NavigateToWhitemail(){
    this._g.clearCurCache = true;
    this.router.navigate(['whitemail']);
  }

  NavigateToNewWhitemail(){
    this._g.clearCurCache = true;
    this.router.navigate(['whitemail/new']);
  }

  NavigateToLRI(){
    this._g.clearCurCache = true;
    this.router.navigate(['lri']);
  }

  NavigateToNewLRI(){
    this._g.clearCurCache = true;
    this.router.navigate(['lri/new']);
  }

  NavigateToIncidentals(){
    this._g.clearCurCache = true;
    this.router.navigate(['incidentals']);
  }

  NavigateToNewIncidentals(){
    this._g.clearCurCache = true;
    this.router.navigate(['incidentals/new']);
  }

  NavigateToNewCaging(){
    this._g.clearCurCache = true;
    this.router.navigate(['caging/new']);
  }

  NavigateToCagingCalendar(){
    this._g.clearCurCache = true;
    this.router.navigate(['caging/calendar']);
  }

  NavigateToUploadPDF() {
    this._g.clearCurCache = true;
    this.router.navigate(['uploadpdf']);
  }

  NavigateToExceptions(){
    this._g.clearCurCache = true;
    this.router.navigate(['exceptions']);
  }
}
