import { Component, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { NotificationService } from '../notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from '../dialogue/dialogue.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor(private headerService: HeaderService, private router: Router, private auth: AuthService, private notificationService: NotificationService) { }

  username: any = '';
  email: any = '';
  unReadCount: number = 0;
  notificationList: Notification[] = [];
  private notificationSubject = new Subject<string>();

  ngOnInit(): void {
    this.email = localStorage.getItem('user');
    console.log(localStorage.getItem('name'))
    if (localStorage.getItem('name') != null && localStorage.getItem('name') != '') {
      this.username = localStorage.getItem('name');
    }
    else {
      this.headerService.dashboard(this.email).subscribe((data) => {
        this.username = data.firstName + " " + data.lastName;
        console.log("dashboard" + this.username)
        if (this.username == '' || this.username == null) {
          this.ngOnInit();
        }
        else {
          localStorage.setItem('name', this.username);
        }
      },
        (err) => {
          console.log("myerr------------>", err.status);
        })

    }

    this.headerService.getNotification(this.email).subscribe((data) => {
      // console.log("Notification Data",data);  
      this.unReadCount = 0;
      if (data != null) {
        // console.log("Notification",data);
        this.notificationList = data;
        console.log("Notification", this.notificationList);
        this.notificationList.forEach((notification: any) => {
          console.log("Is Unread", notification.isRead);
          if (notification.read === false) {
            this.unReadCount++;
          }
        });
        console.log("Unread Count", this.unReadCount);
      }
      else {
        this.notificationList = [];
      }
    },
      (err) => {
        console.log("Notification Error", err);
        this.notificationList = [];
      });



    this.notificationService.getNotificationObservable().subscribe((message) => {
      try {
        this.unReadCount = 0;
        this.notificationList = typeof message === 'string' ? JSON.parse(message) : message;
        this.notificationList.forEach((notification: any) => {
          console.log("Is Unread", notification.isRead);
          if (notification.read === false) {
            this.unReadCount++;
          }
        });
      } catch (e) {
        this.notificationList = [];
        console.error('Failed to parse notification message:', e);
      }
      console.log("Notification received:", this.notificationList);
    });
  }

  notificationClick() {
    console.log("Notification Clicked");
    if (this.unReadCount > 0) {
      this.headerService.updateNotification(this.notificationList, this.email).subscribe(
        (response) => {
          console.log(response);
          this.unReadCount = 0; // Reset unread count after marking as read
        },
        (error) => {
          console.error("Error updating notification", error);
        }
      );
    }
  }
  async logout(): Promise<void> {
    this.router.navigate(['/login']);
    console.log("logging out")
    this.auth.currUser = null;
    this.auth.isLoggedIn = false;
    this.headerService.removeSession(this.email).subscribe((data) => {
      console.log("Session Removed")
    },
      (err) => {
        console.log("Session delete error ", err)
      })
    localStorage.clear()
  }

}
