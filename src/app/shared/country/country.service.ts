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
}
