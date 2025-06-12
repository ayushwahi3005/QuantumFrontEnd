import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { AuthService } from './auth.service';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
  
  @Injectable()
  export class SessionInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService,private router:Router) {}
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          const currentUrl = this.router.url;
          console.log("Current URL:", currentUrl.startsWith('/login'));
          if (error.status === 401 && currentUrl.startsWith('/login') === false&&currentUrl.startsWith('/register') === false&&currentUrl.startsWith('/admin') === false) {
          // if(false){
              // const currentUrl = this.router.url;
              console.log("Current URL:", currentUrl);
                // Ensure logout and redirection are handled only once
                console.log("IsloggedIn=========>"+this.authService.isLoggedIn)
                if(this.authService.isLoggedIn === "true"||this.authService.isLoggedIn === undefined){
                    this.authService.isLoggedIn = "false";
                    localStorage.setItem('isLoggedIn', 'false');
                    this.authService.sessionExpired$.next(true);
                    alert('Session Expired');
                    console.log(error);
                  //   this.router.navigate(['/login']);
                    this.authService.logout().then(() => {
                      this.router.navigate(['/login']); // Redirect after logout
                    }).catch(err => {
                      console.error('Logout failed:', err);
                    });
                }  
           
                 
                    
        
               
              }
          return throwError(() => error);
        })
      );
    }
  }
  