import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  constructor(private auth:AuthService,private router:Router,private httpClient:HttpClient) { }
  canActivate(): boolean {
    let token=null;
    token=localStorage.getItem('authToken');
    console.log(token)
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
    return this.auth.isLoggedIn;
    
  }
 
  
 
  

  
}
