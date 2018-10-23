import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  navbarOpen = false;
  route: any;
  router: any;
  constructor(route: ActivatedRoute, router: Router) {
    this.route = route;
    this.router = router;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  NavigateToHome() {
    this.router.navigate(['returns']);
  }

}
