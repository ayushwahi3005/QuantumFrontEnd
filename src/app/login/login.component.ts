import { Component, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { LoginService } from './login.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';
  loader = false;
  activeSessionDetails: any;
  currentyear: any;
  showPassword!: boolean;
  showPasswordType!: string;
  showPasswordIconClass!: string;
  
  // Keep reference to Bootstrap modal instance
  private bootstrapModal: any;

  constructor(private auth: AuthService, private authService: AuthService, private loginService: LoginService, private router: Router) { }

  async ngOnInit(): Promise<void> {

    if (localStorage.getItem('isLoggedIn') != null) {
      this.authService.isLoggedIn = localStorage.getItem('isLoggedIn');
    }
    else {
      this.authService.isLoggedIn = false;
    }
    this.showPassword = false;
    this.showPasswordType = 'password'
    this.showPasswordIconClass = 'bi bi-eye-fill';
    this.currentyear = new Date().getFullYear();

    // Subscribe to navigation to dashboard completion
    this.auth.navigationToDashboard$.subscribe(() => {
      this.loader = false;
    });

    console.log("Login KeyValue")
    const localStorageData: { [key: string]: string } = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        localStorageData[key] = value || '';
      }
    }
    for (let key in localStorageData) {
      console.log(`${key}: ${localStorageData[key]}`);
    }

  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  login() {
    this.loader = true;

    console.log("---------login loader" + this.loader)

    if (this.email == '') {
      this.triggerAlert("Please enter email", "warning")
      this.loader = false;
      return;
    }
    if (this.password == '') {
      this.triggerAlert("Please enter password", "warning")
      this.loader = false;
      return;
    }

    let userId, deviceId, userAgent;

    userId = this.email;

    if (localStorage.getItem('deviceId') != null) {
      deviceId = localStorage.getItem('deviceId')
    }
    else {
      deviceId = uuidv4();
    }

    userAgent = window.navigator.userAgent;

    let mydata = {
      "userId": userId,
      "deviceId": deviceId,
      "userAgent": userAgent
    }
    this.activeSessionDetails = mydata

    this.loginService.isSameBrowserAndDevice(mydata).subscribe((data) => {
      console.log("Active LogIn")
      console.log(data)
      if (!data) {
        this.loader = false;
        setTimeout(() => {
          this.showModal();
        }, 0);
      }
      else {
        this.auth.login(this.email, this.password, mydata);
        this.email = '';
        this.password = '';
        console.log(this.loader)
        this.subscribeToService();
        console.log(this.errorMessage + " in Login");
      }
    },
      (err) => {
        console.log("Error->" + err)
        this.loader = false;
      })
  }

  subscribeToService() {
    this.loginService.getTriggerFunctionSubject().subscribe((mydata: any) => {
      console.log("trigger------>" + mydata.data + " " + mydata.type)
      this.triggerAlert(mydata.data, mydata.type);
      this.errorMessage = mydata.data;
    });
  }

  /**
   * FIXED: Properly hide modal using Bootstrap API, then cleanup
   */
  logoutFromAllDevice() {
    this.loader = true;

    this.loginService.removeSession(this.email).subscribe(
      (data) => {
        console.log("Removed from all devices");

        // CRITICAL FIX: Use Bootstrap Modal API to hide
        this.hideModalProperly();

        // Wait for modal to fully close before proceeding
        setTimeout(() => {
          this.auth.login(this.email, this.password, this.activeSessionDetails);
          this.email = '';
          this.password = '';

          this.loader = false;
          console.log("Loader state:", this.loader);

          this.subscribeToService();
          console.log(this.errorMessage + " in Login");
        }, 300); // Wait 300ms for modal animation to complete

      },
      (err) => {
        console.error("Error removing session:", err);
        this.hideModalProperly();
        this.loader = false;
      },
      () => {
        this.hideModalProperly();
        this.loader = false;
      }
    );
  }

  /**
   * CRITICAL: Properly hide Bootstrap modal using its API
   */
  private hideModalProperly(): void {
    const modalElement = document.getElementById('removeLoggedIn');
    
    if (modalElement && this.bootstrapModal) {
      try {
        // Use Bootstrap's hide method
        this.bootstrapModal.hide();
      } catch (error) {
        console.error('Error hiding modal:', error);
      }
    }

    // Also do manual cleanup as backup
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
    }

    // Remove modal-open class from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Remove ALL backdrops
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.remove();
    });
  }

  /**
   * Route to login page with proper cleanup
   */
  routeToLogin() {
    this.hideModalProperly();
    this.loader = false;
  }

  /**
   * Show modal using Bootstrap API
   */
  showModal() {
    this.loader = false;
    const modalElement = document.getElementById('removeLoggedIn');
    
    if (modalElement) {
      try {
        // Create Bootstrap modal instance
        this.bootstrapModal = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        // Show the modal
        this.bootstrapModal.show();
      } catch (error) {
        console.error('Error showing modal:', error);
      }
    }
  }

  showPasswordFunc() {
    if (this.showPassword == true) {
      this.showPassword = false;
      this.showPasswordType = 'password';
      this.showPasswordIconClass = 'bi bi-eye-fill';
    }
    else {
      this.showPassword = true;
      this.showPasswordType = 'text';
      this.showPasswordIconClass = 'bi bi-eye-slash-fill';
    }
  }
}