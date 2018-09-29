import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  navbarOpen = false;
  route:any;
  constructor(route: ActivatedRoute) {
    this.route = route;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  NavigateToHome()
  {
    this.route.navigateUrl('/homepage');
  }

}
