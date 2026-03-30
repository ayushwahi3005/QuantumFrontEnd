import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
  } from '@angular/common/http';
  import { inject, Injectable } from '@angular/core';
  import { AuthService } from './auth.service';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from '../dialogue/dialogue.component';
  
  @Injectable()
  export class SessionInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService,private router:Router) {}
    readonly dialog = inject(MatDialog);
    
        openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(DialogueComponent, {
           disableClose: true, 
        });
    
        dialogRef.afterClosed().subscribe(result => {
           this.authService.logout().then(() => {
                      this.router.navigate(['/login']); // Redirect after logout
                    }).catch(err => {
                      console.error('Logout failed:', err);
                    });
          console.log('The dialog was closed');
         
        });
      }
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
  const currentUrl = this.router.url;

  // Handle subscription required case
  if (error?.error?.error === "SUBSCRIPTION_REQUIRED") {
    this.router.navigate(['/setting-home'], {
      queryParams: { tab: 'subscription' }
    });
    return throwError(() => error);
  }

  // Existing 401 logic
  if (
    error.status === 401 &&
    !currentUrl.startsWith('/login') &&
    !currentUrl.startsWith('/register') &&
    !currentUrl.startsWith('/admin') &&
    !currentUrl.includes('/invitation/')
  ) {
    if (
      this.authService.isLoggedIn === "true" ||
      this.authService.isLoggedIn === undefined
    ) {
      this.authService.isLoggedIn = "false";
      localStorage.setItem('isLoggedIn', 'false');
      this.authService.sessionExpired$.next(true);

      console.log(
        'Session expired - Interceptor: Session has expired. User will be logged out.'
      );

      this.openSessionExpiredDialog();
    }
  }

  return throwError(() => error);
})
      );
    }
  }
  