import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import 'rxjs/add/observable/of'
import 'rxjs/add/observable/catch'
import 'rxjs/add/observable/map'

import { Headers, Http, HttpModule } from '@angular/http'

import { HttpHeaders } from '@angular/common/http'

import { TokenParams } from './Classes/TokenParams'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}
