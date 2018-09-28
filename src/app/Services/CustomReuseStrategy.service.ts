import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from "@angular/router";
import { InternalHomePageComponent } from "../internal-home-page/internal-home-page.component";
import { Injectable } from "@angular/core";
import { GlobalService } from '../Services/global.service'

@Injectable({
  providedIn: 'root'
})
export class CustomReuseStrategy implements RouteReuseStrategy { 

  public handlers: {[key: string]: DetachedRouteHandle} = {};
  
  constructor(private c:GlobalService) {
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.handlers[route.url.join("/") || route.parent.url.join("/")] = handle;    
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.handlers[route.url.join("/")];    
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (this.c.clearCache)
    {
      delete this.handlers[route.url.join("/") || route.parent.url.join("/")];    
      this.c.clearCache = false;
    }
    return this.handlers[route.url.join("/") || route.parent.url.join("/")];    
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

}