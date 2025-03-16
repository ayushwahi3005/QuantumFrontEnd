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
           
            if (error.status === 401) {
                // Ensure logout and redirection are handled only once
                console.log("IsloggedIn=========>"+this.authService.isLoggedIn)
                if(this.authService.isLoggedIn === "true"){
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
  