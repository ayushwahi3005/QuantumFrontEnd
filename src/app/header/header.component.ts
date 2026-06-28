import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { NotificationService } from '../notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { CustomerResetPasswordService } from '../customer-reset-password/customer-reset-password.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Output() alertEvent = new EventEmitter<{message: string, type: string}>();
  constructor(
    private headerService: HeaderService, 
    private router: Router, 
    private auth: AuthService, 
    private notificationService: NotificationService,
    private customerResetPasswordService: CustomerResetPasswordService
  ) { }

  changePasswordOtp: string = '';
  changePasswordNew: string = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
otpVerified: boolean = false;
showPassword: boolean = false;
pwChecks = { lower: false, length: false, upper: false, number: false };
isSubmittingPassword: boolean = false;

  openChangePassword(): void {
    this.changePasswordOtp = '';
    this.changePasswordNew = '';
    this.customerResetPasswordService.sendOTPToEmail(this.email).subscribe(
      (data) => {
        console.log("OTP sent to email");
      },
      (err) => {
        console.log("Error sending OTP", err);
      }
    );
  }

  submitChangePassword(): void {
  if (!this.changePasswordOtp || !this.changePasswordNew) {
    alert("Please enter both OTP and New Password");
    return;
  }
  
  this.isSubmittingPassword = true;  // ✅ start loader

  const obj = {
    email: this.email,
    password: this.changePasswordNew,
    otp: this.changePasswordOtp
  };
  this.customerResetPasswordService.updatePassword(obj, this.email).subscribe(
    (data) => {
      this.isSubmittingPassword = false;  // ✅ stop loader
      const closeBtn = document.getElementById('closeChangePasswordModal');
      if (closeBtn) closeBtn.click();
      this.alertEvent.emit({ message: 'Password updated successfully', type: 'success' });
    },
    (err) => {
      this.isSubmittingPassword = false;  // ✅ stop loader on error too
      this.alertEvent.emit({ message: err?.error?.errorMessage || "Error updating password", type: 'error' });
      // alert(err?.error?.errorMessage || "Error updating password");
    }
  );
}

  username: any = '';
  email: any = '';
  unReadCount: number = 0;
  notificationList: Notification[] = [];
  private notificationSubject = new Subject<string>();

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  hasMore: boolean = true;
  isLoadingMoreNotifications: boolean = false;
  totalCount: number = 0;

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

    // Load initial paginated notifications
    this.loadPaginatedNotifications();

    this.notificationService.getNotificationObservable().subscribe((message) => {
      try {
        this.unReadCount = 0;
        console.log("Raw notification message:", message);
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

  /**
   * Load paginated notifications from backend
   */
  loadPaginatedNotifications(): void {
    this.headerService.getPaginatedNotifications(this.email, this.currentPage, this.pageSize).subscribe((data) => {
      console.log("Paginated Notification Data", data);
      
      if (data != null) {
        // If it's the first page, replace; otherwise append
        if (this.currentPage === 0) {
          this.notificationList = data.notifications || [];
        } else {
          this.notificationList = [...this.notificationList, ...(data.notifications || [])];
        }
        console.log("Updated Notification List", this.notificationList);
        // Update pagination metadata
        this.totalPages = data.totalPages;
        this.hasMore = data.hasMore;
        this.totalCount = data.totalCount;

        // Count unread notifications
        this.unReadCount = 0;
        this.notificationList.forEach((notification: any) => {
          if (notification.isRead === false) {
            this.unReadCount++;
          }
        });

        console.log("Unread Count", this.unReadCount);
        console.log("Pagination Info - Page:", this.currentPage, "Total Pages:", this.totalPages, "Has More:", this.hasMore);
      } else {
        if (this.currentPage === 0) {
          this.notificationList = [];
        }
      }

      this.isLoadingMoreNotifications = false;
    },
      (err) => {
        console.log("Notification Error", err);
        if (this.currentPage === 0) {
          this.notificationList = [];
        }
        this.isLoadingMoreNotifications = false;
      });
  }

  /**
   * Load next page of notifications
   */
  loadMoreNotifications(): void {
    if (this.isLoadingMoreNotifications || !this.hasMore) {
      return; // Already loading or no more notifications
    }

    this.isLoadingMoreNotifications = true;
    this.currentPage++;
    this.loadPaginatedNotifications();
  }

  /**
   * Handle scroll event in notification dropdown
   */
  onNotificationListScroll(event: any): void {
    const element = event.target;
    
    // Check if scrolled to bottom (with small threshold for better UX)
    const scrollThreshold = 50; // pixels from bottom
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;

    if (isAtBottom && this.hasMore && !this.isLoadingMoreNotifications) {
      console.log("Scrolled to bottom, loading more notifications...");
      this.loadMoreNotifications();
    }
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

  get allChecksPass() {
  return Object.values(this.pwChecks).every(Boolean);
}

onOtpInput(index: number, event: any): void {
  const next = document.getElementById(`otp-${index + 1}`);
  if (event.target.value && next) (next as HTMLElement).focus();
  this.changePasswordOtp = this.otpDigits.join('');
}

checkPasswordStrength(value: string): void {
  this.pwChecks = {
    lower: /[a-z]/.test(value),
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /[0-9]/.test(value)
  };
}

}