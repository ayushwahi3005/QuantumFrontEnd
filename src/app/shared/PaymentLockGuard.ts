import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentLockGuard implements CanActivate {
   subscriptionEndpoint=environment.endpoint+"subscription/"// <-- set correct base URL

    private headers = new HttpHeaders({
      //  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
       'Content-Type': 'application/json',
       'Device-ID': `${localStorage.getItem('deviceId')}`
     });
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      // no companyId → allow navigation (or change to block if desired)
      return of(true);
    }
    const role=localStorage.getItem('role');
    const token=localStorage.getItem('authToken');
    if(role!='ADMIN'||!token){
      return of(true);
    }
    // Backend may return boolean or an object like { valid: true }
    const url = `${this.subscriptionEndpoint}subscription-valid/${companyId}`;
    console.log("PaymentLockGuard: checking Auth Token status at ", localStorage.getItem('authToken'));
    return this.http.get<boolean | { valid: boolean }>(url,{headers:this.headers}).pipe(
      map((resp) => {
        const isValid = (typeof resp === 'boolean') ? resp : !!(resp && (resp as any).valid);
        if (!isValid) {
          // return UrlTree to redirect (prevents navigation loops)
          // alert('Your subscription has expired or is invalid. Please update your payment information.');
          return this.router.createUrlTree(['/setting-home'], { queryParams: { tab: 'subscription' , alertDialog: true} });
          
        }
        return true;
      }),
      catchError((err) => {
        console.error('PaymentLockGuard: error fetching subscription status', err);
        // On error, choose conservative behaviour: allow (of(true)) or block (redirect)
        return of(true);
      })
    );
  }
}