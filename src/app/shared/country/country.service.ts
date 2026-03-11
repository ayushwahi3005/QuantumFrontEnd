import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

 private countryCodeSubject = new BehaviorSubject<string>('United States of America');
  countryCode$ = this.countryCodeSubject.asObservable();

  setCountryCode(code: string) {
    this.countryCodeSubject.next(code);
  }

  getCountryCode(): string {
    return this.countryCodeSubject.getValue();
  }

  private stateCodeSubject = new BehaviorSubject<string>('');
  stateCode$ = this.stateCodeSubject.asObservable();

  setStateCode(code: string) {
    this.stateCodeSubject.next(code);
  }

  getStateCode(): string {
    return this.stateCodeSubject.getValue();
  }
}
