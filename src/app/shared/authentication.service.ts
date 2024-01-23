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
    if(!this.auth.isLoggedIn){
      this.router.navigate(['/login']);
      
    }
    return this.auth.isLoggedIn;
    
  }
 
  

  
}
