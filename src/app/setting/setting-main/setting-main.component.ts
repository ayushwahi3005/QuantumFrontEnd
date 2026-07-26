import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingMainService } from './setting-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Lottie from 'lottie-web';
import { CompanyInformation } from './companyInformation';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';
import { CountryService } from 'src/app/shared/country/country.service';

declare var bootstrap: any; // important

@Component({
  selector: 'app-setting-main',
  templateUrl: './setting-main.component.html',
  styleUrls: ['./setting-main.component.css']
})
export class SettingMainComponent {
  @ViewChild('lottieAnimation') lottieAnimationContainer!: ElementRef;
  email: any = '';
  current: number = 1;
  username: any = '';
  companyInformationForm!: FormGroup;
  companyImage: any;
  country: any;
  companyInformation!: CompanyInformation;
  companyId!: any;
  role: any;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';
  showTrialAlert: boolean = false;
  unReadCount: number = 0;
  private notificationSubject = new Subject<string>();
  notificationList: Notification[] = [];
  trialStatus: any;
  trialDayLeft!: number;
  currentSubscription: any;
  stateList: any = [];
  countryList = [
    "Canada", "Mexico", "United States of America",
    "Antigua and Barbuda", "The Bahamas", "Barbados", "Cuba", "Dominica",
    "Dominican Republic", "Grenada", "Haiti", "Jamaica", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Trinidad and Tobago",
    "Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"
  ];
  currentSelectedCountryCode = 'US';
  selectedCountryCode = 'United States of America';

  sideBarOption = [
    { number: 1, name: 'Company Information', icon: 'bi bi-bookshelf', tab: 'company' },
    { number: 2, name: 'Locations and Bins', icon: 'bi bi-geo-alt-fill', tab: 'location' },
    { number: 3, name: 'Custom Fields', icon: 'bi bi-boxes', tab: 'custom-fields' },
    { number: 4, name: 'Categories', icon: 'bi bi-boxes', tab: 'category' },
    { number: 12, name: 'Inspection Template', icon: 'bi bi-boxes', tab: 'inspection-template' },
    { number: 5, name: 'Import', icon: 'bi bi-journal-text', tab: 'import' },
    { number: 11, name: 'Import History', icon: 'bi bi-clock-history', tab: 'import-history' },
    { number: 6, name: 'Roles and Permissions', icon: 'bi bi-person', tab: 'role' },
    { number: 7, name: 'Users', icon: 'bi bi-people-fill', tab: 'users' },
    { number: 9, name: 'Subscription', icon: 'bi bi-clipboard-check', tab: 'subscription' },
    { number: 10, name: 'Asset QR code', icon: 'bi bi-qr-code', tab: 'asset-qr' },
    { number: 13, name: 'Audit Logs', icon: 'bi bi-clock-history', tab: 'audit-logs' },
  ];

  constructor(
    private settingMainService: SettingMainService,
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private countryService: CountryService
  ) {}

  ngOnInit() {
    // SINGLE form group definition — includes id and customerEmail now
    this.companyInformationForm = this.formBuilder.group({
      id: [''],
      companyName: ['', Validators.required],
      comapanyLogo: [''],
      country: [''],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: [''], // not required
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z]{3,15}$')]],
      phoneNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      website: ['', [Validators.required, Validators.pattern('^.+\\.com$')]],
      customerEmail: ['']
    });

    let trialInfo = localStorage.getItem('trialAlertDismissedInfo');

    this.email = localStorage.getItem('user');
    this.companyId = localStorage.getItem('companyId');
    this.role = localStorage.getItem('role');

    this.loadCompanyInformation();

    document.body.style.overflow = 'hidden';
    if (localStorage.getItem('settingHomeOption') != null) {
      this.current = Number(this.sideBarOption.find(opt => opt.tab === localStorage.getItem('settingHomeOption'))?.number);
    }
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        const match = this.sideBarOption.find(opt => opt.tab === tab);
        if (match) {
          this.current = match.number;
          localStorage.setItem('settingHomeOption', match.tab.toString());
        }
      }
    });

    this.settingMainService.dashboard(this.email).subscribe((data) => {
      this.username = data.firstName + " " + data.lastName;
    }, (err) => {
      console.log(err);
    });

    this.settingMainService.getFreeTrail(this.companyId).subscribe((data) => {
      this.trialStatus = data;
      if (this.trialStatus.trialExpired == false) {
        const today = new Date();
        const trialEndDate = new Date(this.trialStatus.trialEndDate);
        const timeDiff = trialEndDate.getTime() - today.getTime();
        this.trialDayLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
      this.settingMainService.getCurrSubscription(this.companyId).subscribe((data) => {
        this.currentSubscription = data;
        if ((this.currentSubscription == null || this.currentSubscription.status != 'ACTIVE') && this.trialStatus.trialExpired === false && this.trialDayLeft > 0) {
          const trialDate = trialInfo ? new Date(trialInfo) : new Date(0);
          const now = new Date();
          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          const isWithinOneDay = (now.getTime() - trialDate.getTime()) <= ONE_DAY_MS;
          if (trialInfo !== null && trialInfo !== undefined && isWithinOneDay) {
            this.showTrialAlert = false;
          } else {
            this.showTrialAlert = true;
          }
        } else {
          this.showTrialAlert = false;
        }
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });

    this.settingMainService.getNotification(this.email).subscribe((data) => {
      this.unReadCount = 0;
      if (data != null) {
        this.notificationList = data;
        this.notificationList.forEach((notification: any) => {
          if (notification.read === false) {
            this.unReadCount++;
          }
        });
      } else {
        this.notificationList = [];
      }
    }, (err) => {
      console.log("Notification Error", err);
      this.notificationList = [];
    });

    this.notificationService.getNotificationObservable().subscribe((message) => {
      try {
        this.unReadCount = 0;
        this.notificationList = typeof message === 'string' ? JSON.parse(message) : message;
        this.notificationList.forEach((notification: any) => {
          if (notification.read === false) {
            this.unReadCount++;
          }
        });
      } catch (e) {
        this.notificationList = [];
        console.error('Failed to parse notification message:', e);
      }
    });

    this.settingMainService.dashboard(this.email).subscribe((data) => {
      this.username = data.firstName + " " + data.lastName;
      if (this.username == '' || this.username == null) {
        this.ngOnInit();
      } else {
        localStorage.setItem('name', this.username);
      }
    }, (err) => {
      console.log("myerr------------>", err.status);
    });

    this.stateList = [];
  }

  // Decoupled: patch the form immediately after company info loads,
  // and load the state list independently (doesn't block form population)
  loadCompanyInformation(): void {
    this.settingMainService.getCompanyInformation(this.companyId).subscribe({
      next: (company: any) => {
        console.log('Company data received:', company);
        this.companyInformation = company;
        this.selectedCountryCode = company.country || '';
        this.companyImage = company.comapanyLogo;

        this.companyInformationForm.patchValue({
          id: company.id,
          companyName: company.companyName,
          address1: company.address1,
          address2: company.address2,
          city: company.city,
          state: company.state,
          country: company.country,
          zipCode: company.zipCode,
          phoneNo: company.phoneNo,
          website: company.website,
          customerEmail: company.customerEmail
        });

        console.log('Form value after patch:', this.companyInformationForm.value);

        // Load state list separately — doesn't block form patching above
        if (company.country) {
          this.settingMainService.countryStateList(company.country).subscribe({
            next: (states: any[]) => {
              this.stateList = states;
              // re-apply state now that the dropdown options exist
              this.companyInformationForm.patchValue({ state: company.state });
            },
            error: (err) => console.error('State list error:', err)
          });
        }
      },
      error: (err) => console.error('Company info error:', err)
    });
  }

  fetchCompanyInformation() {
    this.settingMainService.getCompanyInformation(this.companyId).subscribe((data) => {
      if (data?.country) {
        this.countryService.setCountryCode(data.country);
      }
      this.companyInformation = data;
      this.companyInformationForm.patchValue({
        country: this.companyInformation?.country || '',
        state: this.companyInformation?.state || ''
      });
      this.companyImage = this.companyInformation?.comapanyLogo;
    }, (err) => {
      console.log(err);
    });
  }

  playLottieAnimation() {
    Lottie.loadAnimation({
      container: this.lottieAnimationContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/tick.json'
    });
  }

  update(val: number) {
    this.current = val;
    const selectedVal = this.sideBarOption.find(opt => opt.number === this.current);
    localStorage.setItem('settingHomeOption', selectedVal?.tab.toString() || 'company');
    const selected = this.sideBarOption.find(opt => opt.number === val);
    if (selected) {
      this.router.navigate(['/setting-home'], { queryParams: { tab: selected.tab } });
    }
  }

  logout() {
    this.auth.currUser = null;
    this.auth.isLoggedIn = false;
    this.settingMainService.removeSession(this.email).subscribe((data) => {
      console.log("Session Removed");
    }, (err) => {
      console.log("Session delete error ", err);
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currOption');
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');
    this.router.navigate(['/login']);
  }

  imageUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.companyImage = reader.result;
    };
  }

  addCompanyInformation() {
    if (this.companyInformationForm.invalid) {
      const invalidFields: string[] = [];
      Object.keys(this.companyInformationForm.controls).forEach(key => {
        const control = this.companyInformationForm.get(key);
        if (control && control.invalid) {
          invalidFields.push(key);
        }
      });
      this.triggerAlert(`Please fill required fields correctly: ${invalidFields.join(', ')}`, 'danger');
      return;
    }

    this.companyInformationForm.controls['customerEmail'].setValue(this.email);
    this.companyInformationForm.controls['comapanyLogo'].setValue(this.companyImage);
    this.companyInformationForm.controls['id'].setValue(this.companyId);

    const includedFields = ['companyName', 'address1', 'zipCode', 'phoneNo', 'website'];
    let allFieldsValid = true;
    includedFields.forEach(field => {
      const value = this.companyInformationForm.get(field)?.value;
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        this.triggerAlert(`Please Fill Field.`+field, 'danger');
        allFieldsValid = false;
        return;
      }
    });
    if (!allFieldsValid) {
      return;
    }

    this.settingMainService.addCompanyInformation(this.companyInformationForm.value).subscribe((data) => {
      this.triggerAlert("Company Information Updated Successfully", 'success');
    }, (err) => {
      console.log(err);
      alert(err);
    });
  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  notificationClick() {
    if (this.unReadCount > 0) {
      this.settingMainService.updateNotification(this.notificationList, this.email).subscribe(
        (response) => {
          this.unReadCount = 0;
        },
        (error) => {
          console.error("Error updating notification", error);
        }
      );
    }
  }

  forgotpassword() {
    const modalElement = document.getElementById('manageaccount');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    this.router.navigate(['/reset-password']);
  }

  getStateList(country: any) {
    this.settingMainService.countryStateList(country).subscribe((data) => {
      this.stateList = data;
    }, (err) => {
      console.log(err);
    });
  }

  makeTrialAlertFalse() {
    this.showTrialAlert = false;
    localStorage.setItem('trialAlertDismissedInfo', new Date().toISOString());
  }
}